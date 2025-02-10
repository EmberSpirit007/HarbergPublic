<template>
    <chart-js
                            :snatchedPositions="snatchPositions.map((obj) => obj.id)"
                            :positions="activePositions"
                            :dark="darkTheme"
                        ></chart-js>
</template>

<script setup lang="ts">
import ChartJs from "@/components/chart/ChartJs.vue";
import {bigInt2Number, formatBigIntDivision} from "@/utils/helper";
import { computed, ref } from "vue";
import { useStatCollection } from "@/composables/useStatCollection";
import { useStake } from "@/composables/useStake";
import { loadActivePositions, usePositions, type Position } from "@/composables/usePositions";
import { useDark } from "@/composables/useDark";
const { darkTheme } = useDark();

const { activePositions, myActivePositions, tresholdValue, myClosedPositions, createRandomPosition } = usePositions();
const ignoreOwner = ref(false);

const taxRate = ref<number>(1.0);

const minStakeAmount = computed(() => {
console.log("minStake", minStake.value);

return formatBigIntDivision(minStake.value, 10n ** 18n);
});

const stakeAbleHarbAmount = computed(() => statCollection.harbTotalSupply / 5n);

const minStake = computed(() => stakeAbleHarbAmount.value / 600n);

const stake = useStake();
const statCollection = useStatCollection();
const snatchPositions = computed(() => {
if (
    bigInt2Number(statCollection.outstandingStake, 18) + stake.stakingAmountNumber <=
    bigInt2Number(statCollection.harbTotalSupply, 18) * 0.2
) {
    return [];
}
//Differenz aus outstandingSupply und totalSupply bestimmen, wie viel HARB kann zum Snatch verwendet werden
const difference =
    bigInt2Number(statCollection.outstandingStake, 18) +
    stake.stakingAmountNumber -
    bigInt2Number(statCollection.harbTotalSupply, 18) * 0.2;
console.log("difference", difference);

//Division ohne Rest, um zu schauen wie viele Positionen gesnatched werden könnten
const snatchAblePositionsCount = Math.floor(difference / minStakeAmount.value);

//wenn mehr als 0 Positionen gesnatched werden könnten, wird geschaut wie viele Positionen in Frage kommen
if (snatchAblePositionsCount > 0) {
    const snatchAblePositions = activePositions.value.filter((obj: Position) => {
        if (ignoreOwner.value) {
            return obj.taxRatePercentage < taxRate.value;
        }
        return obj.taxRatePercentage < taxRate.value && !obj.iAmOwner;
    });
    const slicedArray = snatchAblePositions.slice(0, snatchAblePositionsCount);
    return slicedArray;
}

return [];
});

</script>
