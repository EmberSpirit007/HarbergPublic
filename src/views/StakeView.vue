<template>
	<div class="stake-view">
        <div class="stake-view-wrapper">
                <h3>Staking Dashboard</h3>
                <div class="stake-view-body">
                    <chart-complete></chart-complete>
                    <stake-holder></stake-holder>
                </div>
            </div>
            <h3>Statistics</h3>
            <div class="statistics-wrapper">
<stats-output headline="Average Slot Tax" :price="`${stats.inflation7d}%`"></stats-output>
<stats-output headline="Claimed Owner Slots" price="10,510 / 20,000"></stats-output>
<stats-output headline="Total Supply Change / 7d" :price="`+ ${ stats.totalSupplyChange7d} USD`"></stats-output>
<stats-output headline="Inflation / 7d" :price="`+${stats.inflation7d}%`"></stats-output>
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
import { onMounted } from "vue";
import {useStatCollection} from "@/composables/useStatCollection" 
// todo interface positions

const stats = useStatCollection();
onMounted(async () => {});
</script>

<style lang="sass">
.stake-view
    padding: 48px
    .stake-view-wrapper
        background-color: #07111B
        padding: 24px
        border-radius: 24px
        .stake-view-body
            display: flex
            gap: 40px
            .positions-graph
                flex: 1 1 67%
            .hold-stake-wrapper
                flex: 1 1 33%
.statistics-wrapper
    display: flex
    justify-content: center
    gap: 46px
    .stats-output
        min-width: 280px
</style>
