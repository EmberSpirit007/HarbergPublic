<template>
	<div class="hold-stake-wrapper">
		<f-card class="inner-border">
					<div class="hold-inner">
							<div class="stake-inner">
								<template v-if="!statCollection.initialized">
									<div>
										<f-loader></f-loader>
									</div>
								</template>
								<template v-else>
									<div class="subheader2">Token Amount</div>
									<FSlider
										:min="minStakeAmount"
										:max="maxStakeAmount"
										v-model="stake.stakingAmountNumber"
									></FSlider>
									<div class="formular">
										<div class="row row-1">
											<f-input
												label="Staking Amount $HARB"
												class="staking-amount"
												v-model="stake.stakingAmountNumber"
											>
												<template v-slot:details>
													<div>Balance: {{ maxStakeAmount.toFixed(2) }} $HARB</div>
													<div @click="setMaxAmount" class="staking-amount-max">
														<b>Max</b>
													</div>
												</template>
											</f-input>
                                            <Icon class="stake-arrow" icon="mdi:chevron-right"></Icon>
											<f-input
												label="Owner Slots"
												class="staking-amount"
                                                disabled
												:modelValue="`${(Number(supplyFreeze) * 1000).toFixed(2)}(${supplyFreeze})`"
											>
											</f-input>
											<!-- <f-select :items="adjustTaxRate.taxRates" label="Tax" v-model="taxRate">
											<template v-slot:info>
												The tax you have to pay to keep your staking position open. The tax is
												calculated on a yearly basis but paid continuously.
											</template>
										</f-select> -->
										</div>
										<div class="row row-2">
											<f-select :items="adjustTaxRate.taxRates" label="Tax" v-model="taxRate">
												<template v-slot:info>
													The tax you have to pay to keep your staking position open. The tax
													is calculated on a yearly basis but paid continuously.
												</template>
											</f-select>
											<f-input label="Floor Tax" disabled :modelValue="floorTax">
												<template v-slot:info>
													You need at least a certain amount based on the available staking
													positions and total supply.
												</template>
											</f-input>
											<f-input
												label="Positions Buyout"
												disabled
												:modelValue="snatchPositions.length"
											>
												<template v-slot:info>
													You need at least a certain amount based on the available staking
													positions and total supply.
												</template>
											</f-input>
										</div>
									</div>
								</template>
                                <f-button v-if="status === 'disconnected'" @click="showPanel = true" size="large" block
                                >Connect Wallet</f-button>
								<f-button size="large" disabled block v-else-if="stake.state === 'NoBalance'"
									>Insufficient Balance</f-button
								>
								<f-button
									size="large"
									block
									v-else-if="stake.state === 'StakeAble' && snatchPositions.length === 0"
									@click="stakeSnatch"
									>Stake</f-button
								>
								<f-button
									size="large"
									block
									v-else-if="stake.state === 'StakeAble' && snatchPositions.length > 0"
									@click="stake.snatch(stake.stakingAmount, taxRate)"
									>Snatch and Stake</f-button
								>
								<f-button size="large" outlined block v-else-if="stake.state === 'SignTransaction'"
									>Sign Transaction ...</f-button
								>
								<f-button size="large" outlined block v-else-if="stake.state === 'Waiting'"
									>Waiting ...</f-button
								>
							</div>
						
						<!-- <template v-if="myActivePositions.length > 0 && status === 'connected'">
							<h5>Your Active Positions</h5>
							<collapse-active
								v-for="position in myActivePositions"
								:taxRate="position.taxRatePercentage"
								:amount="position.amount"
								:treshold="tresholdValue"
								:id="position.positionId"
								:position="position"
								:key="position.id"
							></collapse-active>
						</template>
						<template v-if="myClosedPositions.length > 0 && status === 'connected'">
							<h5>History</h5>
							<collapse-history
								v-for="position in myClosedPositions"
								:taxRate="position.taxRatePercentage"
								:taxPaid="formatBigNumber(position.taxPaid, 18)"
								:amount="position.amount"
								:treshold="tresholdValue"
								:id="position.positionId"
								:key="position.id"
								:position="position"
							></collapse-history>
						</template> -->
					</div>
		</f-card>
	</div>
</template>

<script setup lang="ts">
import FTabs from "@/components/fcomponents/tabs/FTabs.vue";
import FTab from "@/components/fcomponents/tabs/FTab.vue";
import FButton from "@/components/fcomponents/FButton.vue";
import FInput from "@/components/fcomponents/FInput.vue";
import FSelect from "@/components/fcomponents/FSelect.vue";
import FLoader from "@/components/fcomponents/FLoader.vue";
import FSlider from "@/components/fcomponents/FSlider.vue";
import FCard from "@/components/fcomponents/FCard.vue";
import FOutput from "@/components/fcomponents/FOutput.vue";
import { Icon } from "@iconify/vue";
import {
	formatBigIntDivision,
	InsertCommaNumber,
	formatBigNumber,
	bigInt2Number,
} from "@/utils/helper";
// import StatsOutput from "@/components/molecules/StatsOutput.vue";
// import ChartJs from "@/components/ChartJs.vue";
import CollapseActive from "@/components/collapse/CollapseActive.vue";
import CollapseHistory from "@/components/collapse/CollapseHistory.vue";
// import { bytesToUint256, uint256ToBytes } from "harb-lib";
// import { getSnatchList } from "harb-lib/dist/";
import { formatUnits } from "viem";
import axios from "axios";
import { useAccount } from "@wagmi/vue";
import { getChainId, getChains, type Config } from "@wagmi/core";
import { loadActivePositions, usePositions, type Position } from "@/composables/usePositions";

import { useChain } from "@/composables/useChain";

import { useStake } from "@/composables/useStake";
import { useClaim } from "@/composables/useClaim";
import { useAdjustTaxRate } from "@/composables/useAdjustTaxRates";

// import { minStake } from "@/contracts/stake";
import { totalSupply, getTotalSupply } from "@/contracts/stake";
import { totalSupply as totalSupplyHarb, getTotalSupply as getTotalSupplyHarb } from "@/contracts/harb";
import { useWallet } from "@/composables/useWallet";
import { ref, onMounted, watch, computed, inject } from "vue";
import { useStatCollection } from "@/composables/useStatCollection";
import { useRoute } from "vue-router";
const chain = useChain();
const route = useRoute();
const showPanel = inject("showPanel");
const darkTheme: boolean | undefined = inject("darkTheme");
const adjustTaxRate = useAdjustTaxRate();

const position = {
	totalSupplyInit: BigInt("1000000000000000000000"),
	totalSupplyEnd: BigInt("2000000000000000000000"),
	amount: 1500,
};

const activeTab = ref("stake");
const StakeMenuOpen = ref(false);
const ignoreOwner = ref(false);
// let minStakeAmount = ref();
const taxRate = ref<number>(1.0);
// const positions = ref<Array<any>>([]);
const loading = ref<boolean>(true);
const stakeSnatchLoading = ref<boolean>(false);
const { status } = useAccount();
const stake = useStake();
const claim = useClaim();
const wallet = useWallet();
const statCollection = useStatCollection();

const { activePositions, myActivePositions, tresholdValue, myClosedPositions, createRandomPosition } = usePositions();

const floorTax = computed(() => {
	const taxRate = activePositions.value.reduce((min, item) => {
		return item.taxRate < min ? item.taxRate : min;
	}, 0);
	return taxRate * 100;
});
const harbAmount = computed(() => {
	if (wallet.balance?.value) {
		return formatBigNumber(wallet.balance.value, wallet.balance.decimals);
	} else {
		return "0";
	}
});

const supplyFreeze = computed(() => {
	if (!stake.stakingAmount) {
		return 0;
	}
	return ((Number(stake.stakingAmount) / Number(statCollection.harbTotalSupply)) * 100).toFixed(4);
});

const stakeAbleHarbAmount = computed(() => statCollection.harbTotalSupply / 5n);
const minStake = computed(() => stakeAbleHarbAmount.value / 600n);

const tokenIssuance = computed(() => {
	if (statCollection.harbTotalSupply === 0n) {
		return 0n;
	}

	return (statCollection.nettoToken7d / statCollection.harbTotalSupply) * 100n;
});

async function stakeSnatch() {
	await stake.snatch(stake.stakingAmount, taxRate.value);
	stakeSnatchLoading.value = true;
	await new Promise((resolve) => setTimeout(resolve, 10000));
	await loadActivePositions();
	stakeSnatchLoading.value = false;
}

watch(
	route,
	async (to) => {
		console.log("to", to.hash);
		if (to.hash === "#stake") {
			console.log("StakeMenuOpen", StakeMenuOpen.value);

			StakeMenuOpen.value = true;

			// if(element){
			//     element.scrollIntoView({behavior: "smooth"});
			// }

			// if(ele){
			//     window.scrollTo(ele.offsetLeft,ele.offsetTop);
			// }
		}
	},
	{ flush: "pre", immediate: true, deep: true }
);

onMounted(async () => {
	try {
		//on AccountChange
		//TODO
		// await getTotalSupply();
		// await getTotalSupplyHarb();
		// await getOutstandingSupply();

		stake.stakingAmountNumber = minStakeAmount.value;
	} catch (error) {
		console.error("error", error);
	} finally {
		loading.value = false;
	}
});
// async function getGraphData(): Promise<Array<any>> {
// 	let res = await axios.post("https://api.studio.thegraph.com/query/47986/harb/version/latest", {
// 		query: "query MyQuery {\n  positions {\n    id\n    lastTaxTime\n    owner\n    share\n    status\n    taxRate\n    creationTime\n  }\n}",
// 	});
// 	return res.data.data.positions;
// }

// const result = useReadContract({
// 	abi: StakeContract.abi,
// 	address: StakeContract.contractAddress,
// 	functionName: "minStake",
// 	args: [],
// });
// minStakeAmount = result.data;

const minStakeAmount = computed(() => {
	console.log("minStake", minStake.value);

	return formatBigIntDivision(minStake.value, 10n ** 18n);
});
const maxStakeAmount = computed(() => {
	if (wallet.balance?.value) {
		// return Number(balance?.value?.value / 10n ** BigInt(balance?.value!.decimals));
		console.log("wallet.balance.value", wallet.balance);
		console.log(
			"formatBigIntDivision(wallet.balance.value, 10n ** 18n)",
			formatBigIntDivision(wallet.balance.value, 10n ** 18n)
		);

		return formatBigIntDivision(wallet.balance.value, 10n ** 18n);
	} else {
		return 0;
	}
});

watch(
	minStakeAmount,
	async (newValue) => {
		console.log("newValue", newValue);
		if (newValue > stake.stakingAmountNumber && stake.stakingAmountNumber === 0) {
			stake.stakingAmountNumber = minStakeAmount.value;
		}
	},
	{ immediate: true }
);

function setMaxAmount() {
	console.log("maxStakeAmount.value", maxStakeAmount.value);

	stake.stakingAmountNumber = maxStakeAmount.value;
}
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

<style lang="sass">
.hold-stake-wrapper
    display: flex
    flex-direction: column
    gap: 48px
    .stats-wrapper
        display: flex
        gap: 32px
        flex-direction: column
        @media (min-width: 768px)
            flex-direction: row
        .stats-output
            flex: 1 1 50%
    .f-card
        overflow: unset
        &.inner-border
            padding: 0
            .hold-inner
                .positions-graph
                    align-self: center
                    margin-bottom: 32px
            .stake-inner
                display: flex
                flex-direction: column
                gap: 24px
                .formular
                    display: flex
                    flex-direction: column
                    gap: 8px
                    .row
                        >*
                            flex: 1 1 auto
                    .row-1
                        gap: 12px
                        >:nth-child(2)
                            flex: 0 0 auto
                        .staking-amount
                            .f-input--details
                                display: flex
                                gap: 8px
                                justify-content: flex-end
                                .staking-amount-max
                                    &:hover, &:active, &:focus
                                        cursor: pointer
                    .row-2
                        justify-content: space-between
                        >*
                            flex: 0 0 30%
                        // >:nth-child(2)
                        //     flex: 0 0 22%
                        // >:nth-child(3)
                        //     flex: 0 1 28%
.stake-arrow
    align-self: center
</style>
