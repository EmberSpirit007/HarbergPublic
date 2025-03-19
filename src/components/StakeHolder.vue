<template>
	<div class="hold-inner">
		<div class="stake-inner">
			<template v-if="!statCollection.initialized">
				<div>
					<f-loader></f-loader>
				</div>
			</template>

			<template v-else>
				<div class="subheader2">Token Amount</div>
				<FSlider :min="minStakeAmount" :max="maxStakeAmount" v-model="stake.stakingAmountNumber"></FSlider>
				<div class="formular">
					<div class="row row-1">
						<f-input label="Staking Amount" class="staking-amount" v-model="stake.stakingAmountNumber">
							<template v-slot:details>
								<div class="balance">Balance: {{ maxStakeAmount.toFixed(2) }} $KRK</div>
								<div @click="setMaxAmount" class="staking-amount-max">
									<b>Max</b>
								</div>
							</template>
						</f-input>
						<Icon class="stake-arrow" icon="mdi:chevron-triple-right"></Icon>
						<f-input
							label="Owner Slots"
							class="staking-amount"
							disabled
							:modelValue="`${stakeSlots}(${supplyFreeze?.toFixed(4)})`"
						>
							<template #info>
								Slots correspond to a percentage of ownership in the protocol.<br /><br />1,000 Slots =
								1% Ownership<br /><br />When you unstake you get the exact percentage of the current
								$KRK total supply. When the total supply increased since you staked you get more tokens
								back than before.
							</template>
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
								The yearly tax you have to pay to keep your slots open. The tax is paid when unstaking
								or manually in the dashboard. If someone pays a higher tax they can buy you out.
							</template>
						</f-select>
						<f-input label="Floor Tax" disabled :modelValue="floorTax">
							<template v-slot:info>
								This is the current minimum tax you have to pay to claim owner slots from other owners.
							</template>
						</f-input>
						<f-input label="Positions Buyout" disabled :modelValue="snatchAblePositions.length">
							<template v-slot:info>
								This shows you the numbers of staking positions you buy out from current owners by
								paying a higher tax. If you get bought out yourself by new owners you get paid out the
								current market value of your position incl. your profits.
							</template>
						</f-input>
					</div>
				</div>
				<f-button size="large" disabled block v-if="stake.state === 'NoBalance'">Insufficient Balance</f-button>
				<f-button size="large" disabled block v-else-if="stake.stakingAmountNumber < minStakeAmount"
					>Stake amount too low</f-button
				>
				<f-button
					size="large"
					disabled
					block
					v-else-if="
						!openPositionsAvailable && stake.state === 'StakeAble' && snatchAblePositions.length === 0
					"
					>taxRate too low to snatch</f-button
				>
				<f-button
					size="large"
					block
					v-else-if="stake.state === 'StakeAble' && snatchAblePositions.length === 0"
					@click="stakeSnatch"
					>Stake</f-button
				>
				<f-button
					size="large"
					block
					v-else-if="stake.state === 'StakeAble' && snatchAblePositions.length > 0"
					@click="stakeSnatch"
					>Snatch and Stake</f-button
				>
				<f-button size="large" outlined block v-else-if="stake.state === 'SignTransaction'"
					>Sign Transaction ...</f-button
				>
				<f-button size="large" outlined block v-else-if="stake.state === 'Waiting'">Waiting ...</f-button>
			</template>
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
</template>

<script setup lang="ts">
import FButton from "@/components/fcomponents/FButton.vue";
import FInput from "@/components/fcomponents/FInput.vue";
import FSelect from "@/components/fcomponents/FSelect.vue";
import FLoader from "@/components/fcomponents/FLoader.vue";
import FSlider from "@/components/fcomponents/FSlider.vue";
import FOutput from "@/components/fcomponents/FOutput.vue";
import { Icon } from "@iconify/vue";
import { formatBigIntDivision, InsertCommaNumber, formatBigNumber, bigInt2Number } from "@/utils/helper";
// import StatsOutput from "@/components/molecules/StatsOutput.vue";
// import ChartJs from "@/components/ChartJs.vue";
// import CollapseActive from "@/components/collapse/CollapseActive.vue";
// import CollapseHistory from "@/components/collapse/CollapseHistory.vue";
// import { bytesToUint256, uint256ToBytes } from "harb-lib";
// import { getSnatchList } from "harb-lib/dist/";
import { formatUnits } from "viem";
import axios from "axios";
import { useAccount } from "@wagmi/vue";
import { loadActivePositions, usePositions, type Position } from "@/composables/usePositions";

import { useStake } from "@/composables/useStake";
import { useClaim } from "@/composables/useClaim";
import { useAdjustTaxRate } from "@/composables/useAdjustTaxRates";

import { assetsToShares } from "@/contracts/stake";
import { getMinStake } from "@/contracts/harb";
import { useWallet } from "@/composables/useWallet";
import { ref, onMounted, watch, computed, inject, watchEffect } from "vue";
import { useStatCollection, loadStats } from "@/composables/useStatCollection";
import { useRoute } from "vue-router";

const demo = sessionStorage.getItem("demo") === "true";
const route = useRoute();

const adjustTaxRate = useAdjustTaxRate();

const activeTab = ref("stake");
const StakeMenuOpen = ref(false);
// let minStakeAmount = ref();
const taxRate = ref<number>(1.0);
// const positions = ref<Array<any>>([]);
const loading = ref<boolean>(true);
const stakeSnatchLoading = ref<boolean>(false);
const stake = useStake();
const claim = useClaim();
const wallet = useWallet();
const statCollection = useStatCollection();

const { activePositions } = usePositions();

const floorTax = ref(1);
const minStake = ref(0n);
const stakeSlots = ref();
const supplyFreeze = ref<number>(0);
let debounceTimer: ReturnType<typeof setTimeout>;
watchEffect(() => {
	console.log("supplyFreeze");

	if (!stake.stakingAmount) {
		supplyFreeze.value = 0;
		return;
	}

	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(async () => {
		stake.stakingAmountShares = await assetsToShares(stake.stakingAmount);
		const stakingAmountSharesNumber = bigInt2Number(stake.stakingAmountShares, 18);
		const stakeableSupplyNumber = bigInt2Number(statCollection.stakeableSupply, 18);
		minStake.value = await getMinStake();

		console.log(stakingAmountSharesNumber / stakeableSupplyNumber);
		supplyFreeze.value = stakingAmountSharesNumber / stakeableSupplyNumber;
	}, 500); // Verzögerung von 500ms
});

const openPositionsAvailable = computed(() => {
	if (
		bigInt2Number(statCollection.outstandingStake, 18) + bigInt2Number(stake.stakingAmountShares, 18) <=
		bigInt2Number(statCollection.stakeTotalSupply, 18) * 0.2
	) {
		return true;
	} else {
		return false;
	}
});

watchEffect(() => {
	console.log("stakeSlots");
	stakeSlots.value = (supplyFreeze.value * 1000)?.toFixed(2);
});

// const stakeAbleHarbAmount = computed(() => statCollection.harbTotalSupply / 5n);
//war das mal so, wurde das geändert --> funktioniert nicht mehr
// const minStake = computed(() => stakeAbleHarbAmount.value / 600n);

const tokenIssuance = computed(() => {
	if (statCollection.harbTotalSupply === 0n) {
		return 0n;
	}

	return (statCollection.nettoToken7d / statCollection.harbTotalSupply) * 100n;
});

function getMinFloorTax() {
	const taxRate = activePositions.value.reduce((min, item) => {
		return item.taxRate < min ? item.taxRate : min;
	}, 1);
	return taxRate * 100;
}

async function stakeSnatch() {
	if (snatchAblePositions.value.length === 0) {
		await stake.snatch(stake.stakingAmount, taxRate.value);
	} else {
		const snatchAblePositionsIds = snatchAblePositions.value.map((p: Position) => p.positionId);
		await stake.snatch(stake.stakingAmount, taxRate.value, snatchAblePositionsIds);
	}
	stakeSnatchLoading.value = true;
	await new Promise((resolve) => setTimeout(resolve, 10000));
	await loadActivePositions();
	await loadStats();
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

		minStake.value = await getMinStake();
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

	return bigInt2Number(minStake.value, 18);
});
const maxStakeAmount = computed(() => {
	if (wallet.balance?.value) {
		// return Number(balance?.value?.value / 10n ** BigInt(balance?.value!.decimals));
		console.log("wallet.balance.value", wallet.balance);
		console.log("formatBigIntDivision(wallet.balance.value, 10n ** 18n)", bigInt2Number(wallet.balance.value, 18));

		return bigInt2Number(wallet.balance.value, 18);
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
const snatchAblePositions = ref<Array<any>>([]);

watchEffect(async () => {
	console.log("watchEffect - snatchAblePositions");

	let outStandingStake = statCollection.outstandingStake;
	let positions = activePositions.value;
	let selectedTaxRate = taxRate.value;

	// Prüfe, ob bereits offene Positionen verfügbar sind, dann kein Snatching erforderlich
	if (openPositionsAvailable.value) {
		snatchAblePositions.value = [];
		floorTax.value = getMinFloorTax();
		return;
	}

	console.log("bigInt2Number(outStandingStake, 18)", bigInt2Number(outStandingStake, 18));
	console.log("bigInt2Number(stake.stakingAmountShares, 18)", bigInt2Number(stake.stakingAmountShares, 18));
	console.log(
		"(bigInt2Number(statCollection.stakeTotalSupply, 18) * 0.2)",
		bigInt2Number(statCollection.stakeTotalSupply, 18) * 0.2
	);

	// **1. Berechnung der Differenz**
	const difference =
		bigInt2Number(outStandingStake, 18) +
		bigInt2Number(stake.stakingAmountShares, 18) -
		bigInt2Number(statCollection.stakeTotalSupply, 18) * 0.2;

	console.log("difference", difference);

	// **2. Potentiell snatchbare Positionen holen**
	const snatchAble = positions.filter((obj: Position) => {
		if (demo) {
			return obj.taxRatePercentage < selectedTaxRate;
		}
		// return obj.taxRatePercentage < selectedTaxRate && !obj.iAmOwner;
		return obj.taxRatePercentage < selectedTaxRate;
	});

	console.log("snatchAblePositions", snatchAble);

	if (snatchAble.length === 0) {
		snatchAblePositions.value = [];
		floorTax.value = getMinFloorTax();
		return;
	}

	// **3. Positionen nach der taxRate sortieren (aufsteigend)**
	const sortedPositions = [...snatchAble].sort((a, b) => a.taxRatePercentage - b.taxRatePercentage);

	// **4. Die 50% der niedrigsten Positionen auswählen**
	const halfIndex = Math.floor(sortedPositions.length / 2);
	const cheapestHalf = sortedPositions.slice(0, halfIndex);

	console.log("cheapestHalf", cheapestHalf);

	// **5. Zufällige Auswahl bis zum gewünschten Staking-Bereich**
	let selectedPositions: Position[] = [];
	let accumulatedStake = 0;

	// Warte auf die Umrechnung von minStake in minStakeShares
	const minStakeShares = await assetsToShares(minStake.value);
	const minStakeShareNumber = bigInt2Number(minStakeShares, 18);

	console.log("minStakeShares", minStakeShares);
	console.log("minStakeShareNumber", minStakeShareNumber);

	// Zufällige Reihenfolge für eine bessere Verteilung
	const shuffled = cheapestHalf.sort(() => Math.random() - 0.5);
	console.log("shuffled", shuffled);

	for (const position of shuffled) {
		console.log("accumulatedStake", accumulatedStake);
		console.log(" position.stakingAmountShares", position);
		console.log("difference", difference);
		const harbDepositShares = await assetsToShares(position.harbDeposit);
		const harbDepositNumber = bigInt2Number(harbDepositShares, 18);
		console.log("harbDepositNumber", harbDepositNumber);

     // **Berechnung von `floorTax.value`**
     if (selectedPositions.length > 0) {
         const taxPosition = Math.max(...selectedPositions.map(p => p.taxRateIndex)) +1;
         
         floorTax.value = adjustTaxRate.taxRates[taxPosition].year;
         
    } else {
        floorTax.value = getMinFloorTax()
    }
});
</script>

<style lang="sass">

.hold-inner
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
                        color: #9A9898
                        font-size: 14px
                        .staking-amount-max
                            font-weight: 600
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
    font-size: 30px
</style>
