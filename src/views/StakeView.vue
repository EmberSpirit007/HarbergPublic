<template>
	<div class="stake-view">
		<div class="stake-view-wrapper">
			<h3>
				Staking Dashboard
				<IconInfo size="20px">
					<template #text>
						Stake your $KRK and claim owner slots. Owner slots give a return on every token buy that
						increases the liquidity of KrAIken. Owner slots are limited to 20,000 slots in total. To enable
						everyone and anyone to join staking is protected by a “Harberger Tax” mechanism.
					</template>
				</IconInfo>
			</h3>

			<div class="stake-view-body">
				<chart-complete></chart-complete>
				<stake-holder></stake-holder>
			</div>
		</div>
		<div class="statistics-wrapper">
			<h3>Statistics</h3>
			<div class="statistics-outputs-wrapper">
				<stats-output headline="Average Slot Tax" :price="`${averageTaxRate.toFixed(2)} %`"></stats-output>
				<stats-output
					headline="Claimed Owner Slots"
					:price="`${InsertCommaNumber(stats.claimedSlots)} / ${InsertCommaNumber(stats.maxSlots)}`"
				></stats-output>
				<stats-output
					headline="Total Supply Change / 7d"
					:price="`+ ${stats.totalSupplyChange7d} $KRK`"
				></stats-output>
				<stats-output headline="Inflation / 7d" :price="`+${stats.inflation7d}%`"></stats-output>
			</div>
		</div>
		<div class="active-positions-wrapper">
			<h3>Active Positions</h3>
			<div class="active-positions-list">
				<collapse-active
					v-for="position in myActivePositions"
					:taxRate="position.taxRatePercentage"
					:amount="position.amount"
					:treshold="tresholdValue"
					:id="position.positionId"
					:position="position"
					:key="position.id"
				></collapse-active>
			</div>
		</div>
		<!-- <f-button @click="getGraphData">graphql test</f-button>
		<div v-for="position in positions" :key="position.id">
			{{ position }}
		</div> -->
	</div>
</template>

<script setup lang="ts">
import StakeHolder from "@/components/StakeHolder.vue";
import ChartComplete from "@/components/chart/ChartComplete.vue";
import StatsOutput from "@/components/StatsOutput.vue";
import CollapseActive from "@/components/collapse/CollapseActive.vue";
import { onMounted, computed } from "vue";
import { useStatCollection } from "@/composables/useStatCollection";
import IconInfo from "@/components/icons/IconInfo.vue";
// todo interface positions
import { usePositions } from "@/composables/usePositions";
import { compactNumber, InsertCommaNumber } from "@/utils/helper";

const { myActivePositions, tresholdValue, activePositions } = usePositions();

const stats = useStatCollection();

function calculateAverageTaxRate(data: any): number {
	console.log("data", data);

	if (data.length === 0) {
		return 0;
	}
	const totalTaxRate = data.reduce((sum: any, entry: any) => sum + parseFloat(entry.taxRate), 0);
	const averageTaxRate = totalTaxRate / data.length;
	return averageTaxRate * 100;
}

const averageTaxRate = computed(() => calculateAverageTaxRate(activePositions.value));
onMounted(async () => {});
</script>

<style lang="sass">
.stake-view
    display: flex
    flex-direction: column
    gap: 32px
    padding: 16px
    @media (min-width: 992px)
        padding: 48px
    .stake-view-wrapper
        background-color: #07111B
        padding: 12px 0
        border-radius: 24px
        @media (min-width: 992px)
            padding: 24px
        .stake-view-body
            display: flex
            gap: 40px
            position: relative
            flex-direction: column
            @media (min-width: 992px)
                flex-direction: row
            .positions-graph
                flex: 1 1 67%
            .hold-stake-wrapper
                flex: 1 1 33%
.statistics-wrapper
    .statistics-outputs-wrapper
        display: flex
        justify-content: center
        flex-direction: column
        gap: 46px
        @media (min-width: 768px)
            flex-direction: row
            flex-wrap: wrap
        .stats-output
            min-width: 280px

.active-positions-wrapper
    width: 100%
    margin-left: auto
    margin-right: auto
    @media (min-width: 768px)
        width: 580px
    .active-positions-list
        display: flex
        flex-direction: column
        gap: 12px
</style>
