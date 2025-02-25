<template>
	<f-collapse class="f-collapse-history">
		<template v-slot:header>
			<div class="collapse-header">
				<div><span class="subheader2">Tax</span> {{ props.taxRate }} %</div>
				<div>
					<span class="subheader2">ID</span> <span class="number-small">{{ props.id }}</span>
				</div>
				<div class="collapse-amount">
					<span class="number-small">{{ compactNumber(props.amount) }}</span>
					<span class="caption"> $KRK</span>
				</div>
			</div>
		</template>
		<div class="collapsed-body history">
			<div>
				<span class="subheader2">Tax paid</span><span class="number-small">{{ props.taxPaid }}</span
				><span class="caption"> $KRK</span>
			</div>
			<div>
				<span class="subheader2">Profit</span><span class="number-small">{{ profit }}</span
				><span class="caption"> $KRK</span>
			</div>
		</div>
	</f-collapse>
</template>

<script setup lang="ts">
import type { Position } from "@/composables/usePositions";
import FCollapse from "@/components/fcomponents/FCollapse.vue";
import { compactNumber } from "@/utils/helper";
import { formatUnits } from "viem";

import { computed } from "vue";
const props = defineProps<{
	taxRate: number;
	taxPaid: string;
	treshold: number;
	id: bigint;
	amount: number;
	position: Position;
}>();

const profit = computed(() => {
	const multiplier =
		Number(formatUnits(props.position.totalSupplyInit, 18)) /
		Number(formatUnits(props.position.totalSupplyEnd!, 18));
	console.log("multiplier", multiplier);
	console.log("props.position.amount", props.position.amount);
	return (
		Number(formatUnits(props.position.totalSupplyEnd!, 18)) * multiplier -
		Number(formatUnits(props.position.totalSupplyEnd!, 18))
	);
});
</script>

<style lang="sass">
@use 'collapse'
.f-collapse
    &.f-collapse-history
        .collapse-header, .collapsableDiv
            margin-right: 32px
</style>
