<template>
	<f-collapse class="f-collapse-active" @collapse:opened="loadActivePositionData" :loading="loading">
		<template v-slot:header>
			<div class="collapse-header">
				<div class="collapse-header-row1">
					<div><span class="subheader2">Tax</span> {{ props.taxRate }} %</div>
					<div class="">
						<span class="subheader2">ID</span> <span class="number-small">{{ props.id }}</span>
					</div>
				</div>
				<div class="collapse-header-row2">
					<div>
						<div class="profit-stats-item">
							<div><b>Initial Stake</b></div>
							<div>{{ compactNumber(props.amount) }} $HARB</div>
						</div>
					</div>
					<div class="tags-list">
						<f-tag v-if="tag">{{ tag }}</f-tag>
					</div>
				</div>
				<!-- <div class="collapse-amount">
					<span class="number-small">{{ compactNumber(props.amount) }}</span>
					<span class="caption"> $HARB</span>
				</div> -->
			</div>
		</template>
		<div class="collapsed-body">
			<div class="profit-stats-wrapper">
				<div class="profit-stats-item">
					<div><b>Tax Paid</b></div>
					<div>{{ taxPaidGes }} $HARB</div>
				</div>
				<div class="profit-stats-item">
					<div><b>Issuance Earned</b></div>
					<div>{{ profit }} $HARB</div>
				</div>
				<div class="profit-stats-item profit-stats-total">
					<div><b>Total</b></div>
					<div>{{ total.toFixed(5) }} $HARB</div>
				</div>
			</div>
		</div>
		<div class="collapsed-body--actions">
			<div :class="{ 'collapse-menu-open': showTaxMenu }">
				<f-button size="small" dense block outlined v-if="adjustTaxRate.state === 'SignTransaction'"
					>Sign Transaction ...</f-button
				>
				<f-button
					size="small"
					dense
					outlined
					block
					v-else-if="adjustTaxRate.state === 'Waiting'"
					@click="unstakePosition"
					>Waiting ...</f-button
				>
				<f-button
					size="small"
					dense
					block
					v-else-if="adjustTaxRate.state === 'Action' && !showTaxMenu"
					@click="showTaxMenu = true"
					>Adjust Tax Rate</f-button
				>
				<template v-else>
					<div class="collapse-menu-input">
						<f-select :items="filteredTaxRates" v-model="newTaxRate"> </f-select>
					</div>
					<div>
						<f-button size="small" dense @click="changeTax(props.id, newTaxRate)">Confirm</f-button>
						<f-button size="small" dense outlined @click="showTaxMenu = false">Cancel</f-button>
					</div>
				</template>
			</div>
			<div></div>
			<div>
				<f-button size="small" dense block outlined v-if="unstake.state === 'SignTransaction'"
					>Sign Transaction ...</f-button
				>
				<f-button size="small" dense outlined block v-else-if="unstake.state === 'Waiting'"
					>Waiting ...</f-button
				>
				<f-button size="small" dense block v-else-if="unstake.state === 'Unstakeable'" @click="unstakePosition"
					>Unstake</f-button
				>
			</div>
		</div>
	</f-collapse>
</template>

<script setup lang="ts">
import FButton from "@/components/fcomponents/FButton.vue";
import FTag from "@/components/fcomponents/FTag.vue";
import FSelect from "@/components/fcomponents/FSelect.vue";
import FCollapse from "@/components/fcomponents/FCollapse.vue";
import { compactNumber, formatBigNumber } from "@/utils/helper";
import { useUnstake } from "@/composables/useUnstake";
import { useAdjustTaxRate } from "@/composables/useAdjustTaxRates";
import { computed, ref, onMounted } from "vue";
import { getTaxDue } from "@/contracts/stake";
import { type Position, loadPositions } from "@/composables/usePositions";
import { useStatCollection } from "@/composables/useStatCollection";

import { formatUnits } from "viem";

const unstake = useUnstake();
const adjustTaxRate = useAdjustTaxRate();
const statCollection = useStatCollection();

const props = defineProps<{
	taxRate: number;
	treshold: number;
	id: bigint;
	amount: number;
	position: Position;
}>();

const showTaxMenu = ref(false);
const newTaxRate = ref<number>(1);
const taxDue = ref<bigint>();
const taxPaidGes = ref<string>();
const profit = ref<number>();
const loading = ref<boolean>(false);

const tag = computed(() => {
	if (props.taxRate < props.treshold) {
		return "Low Tax!";
	}
	return "";
});

const total = computed(() => props.amount + profit.value! + -taxPaidGes.value!);

async function changeTax(id: bigint, newTaxRate: number) {
	await adjustTaxRate.changeTax(id, newTaxRate);
	showTaxMenu.value = false;
}

async function unstakePosition() {
	console.log(props.id);
	await unstake.exitPosition(props.id);
	loading.value = true;
	await new Promise((resolve) => setTimeout(resolve, 5000));
	console.log("loadPositions begin");
	await loadPositions();
	console.log("loadPositions end");
	loading.value = false;
}

async function loadActivePositionData() {
	console.log("loadActivePositionData", props.position);

	//loadTaxDue
	taxDue.value = await getTaxDue(props.id);
	console.log("taxDue", taxDue.value);
	taxPaidGes.value = formatBigNumber(taxDue.value + BigInt(props.position.taxPaid), 18);
	console.log("loadActivePositionData", taxPaidGes.value);

	//loadTotalSupply

	const multiplier =
		Number(formatUnits(props.position.totalSupplyInit, 18)) /
		Number(formatUnits(statCollection.harbTotalSupply, 18));
	console.log("props.position.totalSupplyInit", props.position.totalSupplyInit);

	console.log("multiplier", multiplier);

	profit.value =
		Number(formatUnits(statCollection.harbTotalSupply, 18)) * multiplier -
		Number(formatUnits(statCollection.harbTotalSupply, 18));
}

onMounted(() => {
	const taxRate = adjustTaxRate.taxRates.find((obj) => obj.index === props.position.taxRateIndex + 1);
    
    
	if (taxRate) {
		newTaxRate.value = taxRate.year;
	}
});

const filteredTaxRates = computed(() => adjustTaxRate.taxRates.filter((obj) => obj.year > props.taxRate))

</script>

<style lang="sass">
@use 'collapse'
.f-collapse
    &.f-collapse-active
        .collapse-header
            width: 100%
            display: flex
            justify-content: space-between
            flex-direction: column
            position: relative
            gap: 16px
            .collapse-header-row1
                display: flex
                flex-direction: row
                justify-content: space-between
                margin-right: 32px
            .collapse-header-row2
                display: flex
                justify-content: space-between
                >div
                    width: 50%
                    min-height: 22px
                    .profit-stats-item
                        display: grid
                        grid-template-columns: 1fr 1fr
                        gap: 8px
                        div
                            &:last-child
                                text-align: right
                .tags-list
                    margin-right: 32px
                    text-align: right
.collapsableDiv
    .collapsed-body
        display: flex
        flex-direction: column
        margin-right: 32px
        .collapsed-body--header
            justify-content: space-between
        .profit-stats-wrapper
            display: flex
            width: 50%
            flex-direction: column
            gap: 4px
            margin: 4px auto 0 0
            .profit-stats-item
                display: grid
                grid-template-columns: 1fr 1fr
                gap: 8px
                div
                    &:last-child
                        text-align: right
                &.profit-stats-total
                    border-top: 2px solid var(--color-font)
                    padding-top: 2px
        .collapsed-body--actions
            .collapse-menu-open
                display: flex
                align-items: center
                gap: 4px
                flex: 1 1 auto
                .collapse-menu-input
                    display: flex
                    align-items: center
</style>
