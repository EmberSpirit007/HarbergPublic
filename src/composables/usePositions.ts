import { ref, onMounted, onUnmounted, reactive, computed, type ComputedRef } from "vue";
import { config } from "@/wagmi";
import { type WatchEventReturnType, toBytes, type Hex } from "viem";
import axios from "axios";
import { getAccount, watchContractEvent, watchChainId, watchAccount } from "@wagmi/core";
import type { WatchChainIdReturnType, WatchAccountReturnType, GetAccountReturnType} from "@wagmi/core";

import { HarbContract } from "@/contracts/harb";
import { bytesToUint256, uint256ToBytes } from "harb-lib";
import { bigInt2Number } from "@/utils/helper";
import { useChain } from "@/composables/useChain";
import { taxRates } from "@/composables/useAdjustTaxRates";
import logger from "@/utils/logger";
const rawActivePositions = ref<Array<Position>>([]);
const rawClosedPositoins = ref<Array<Position>>([]);
const loading = ref(false);
const chain = useChain();
const activePositions = computed(() => {
	const account = getAccount(config as any);

	return rawActivePositions.value
		.map((obj: any) => {
			return {
				...obj,
				positionId: formatId(obj.id),
				amount: bigInt2Number(obj.harbDeposit, 18),
				taxRatePercentage: Number(obj.taxRate) * 100,
				taxRate: Number(obj.taxRate),
				taxRateIndex: taxRates.find((taxRate) => taxRate.year === Number(obj.taxRate) * 100)?.index,
				iAmOwner: obj.owner?.toLowerCase() === account.address?.toLowerCase(),
				totalSupplyEnd: obj.totalSupplyEnd ? BigInt(obj.totalSupplyEnd) : undefined,
				totalSupplyInit: BigInt(obj.totalSupplyInit),
				taxPaid: BigInt(obj.taxPaid),
				share: Number(obj.share),
			};
		})
		.sort((a, b) => {
			if (a.taxRate > b.taxRate) {
				return 1;
			} else if (a.taxRate < b.taxRate) {
				return -1;
			} else {
				return 0;
			}
		});
});

export interface Position {
	creationTime: Date;
	id: string;
	positionId: bigint;
	owner: string;
	lastTaxTime: Date;
	taxPaid: bigint;
	taxRate: number;
	taxRateIndex: number;
	taxRatePercentage: number;
	share: number;
	status: string;
	totalSupplyEnd?: bigint;
	totalSupplyInit: bigint;
	amount: number;
	harbDeposit: bigint;
	iAmOwner: boolean;
}

const myClosedPositions: ComputedRef<Position[]> = computed(() => {
	const account = getAccount(config as any);

	return rawClosedPositoins.value.map((obj: any) => {
		const taxRatePosition = obj.taxRate * 100;
		console.log("taxRatePosition", taxRatePosition);

		console.log("taxRates[taxRatePosition]", taxRates[taxRatePosition]);

		return {
			...obj,
			positionId: formatId(obj.id),
			amount: obj.share * 1000000,
			// amount: bigInt2Number(obj.harbDeposit, 18),
			taxRatePercentage: Number(obj.taxRate) * 100,
			taxRate: Number(obj.taxRate),
			taxRateIndex: taxRates.find((taxRate) => taxRate.year === Number(obj.taxRate) * 100)?.index,
			iAmOwner: obj.owner?.toLowerCase() === account.address?.toLowerCase(),
			totalSupplyEnd: BigInt(obj.totalSupplyEnd),
			totalSupplyInit: BigInt(obj.totalSupplyInit),
			taxPaid: BigInt(obj.taxPaid),
			share: Number(obj.share),
		};
	});
});

const myActivePositions: ComputedRef<Position[]> = computed(() =>
	activePositions.value.filter((obj: Position) => {
		return obj.iAmOwner;
	})
);

const tresholdValue = computed(() => {
	const arrayTaxRatePositions = activePositions.value.map((obj) => obj.taxRatePercentage);
	const sortedPositions = arrayTaxRatePositions.sort((a: any, b: any) => (a > b ? 1 : -1));
	const sumq = sortedPositions.reduce((partialSum, a) => partialSum + a, 0);
	const avg = sumq / sortedPositions.length;

	return avg / 2;
});

export async function loadActivePositions() {
	logger.info(`loadActivePositions for chain: ${chain.chainData?.path}`);
	if (!chain.chainData?.thegraph) {
		return [];
	}
	console.log("chain.chainData?.thegraph", chain.chainData?.thegraph);

	const res = await axios.post(chain.chainData?.thegraph, {
		query: `query MyQuery {
                        positions(where: {status: Active}, orderBy: taxRate, orderDirection: asc) {
                            id
                            lastTaxTime
                            owner
                            payout
                            share
                            harbDeposit
                            snatched
                            status
                            taxPaid
                            taxRate
                            totalSupplyEnd
                            totalSupplyInit
                        }
                    }`,
	});
	console.log("res", res.data);

	return res.data.data.positions as Position[];
}

function formatId(id: Hex) {
	const bytes = toBytes(id);
	const bigIntId = bytesToUint256(bytes);
	return bigIntId;
}

export async function loadMyClosedPositions(account: GetAccountReturnType) {
	logger.info(`loadMyClosedPositions for chain: ${chain.chainData?.path}`);
	if (!chain.chainData?.thegraph) {
		return [];
	}
	const res = await axios.post(chain.chainData?.thegraph, {
		query: `query MyQuery {
                    positions(where: {status: Closed, owner: "${account.address?.toLowerCase()}"}) {
                        id
                        lastTaxTime
                        owner
                        payout
                        share
                        harbDeposit
                        snatched
                        status
                        taxPaid
                        taxRate
                        totalSupplyEnd
                        totalSupplyInit
                    }
                }`,
	});
	if (res.data.errors?.length > 0) {
		console.error("todo nur laden, wenn eingeloggt");
		return [];
	}
	const positions: Position[] = res.data.data.positions;
	return positions;
}

export async function loadPositions() {
	loading.value = true;

	rawActivePositions.value = await loadActivePositions();
	//optimal wäre es: laden, wenn new Position meine Position geclosed hat
	const account = getAccount(config as any);

	if (account.address) {
		rawClosedPositoins.value = await loadMyClosedPositions(account);
	}
	loading.value = false;
}

let unwatch: WatchEventReturnType;
let unwatchPositionRemovedEvent: WatchEventReturnType;
let unwatchChainSwitch: WatchChainIdReturnType;
let unwatchAccountChanged: WatchAccountReturnType;
export function usePositions() {
	function watchEvent() {
		unwatch = watchContractEvent(config as any, {
			address: HarbContract.contractAddress,
			abi: HarbContract.abi,
			eventName: "PositionCreated",
			async onLogs(logs) {
				console.log("new Position", logs);
				await loadPositions();
				// await getMinStake();
			},
		});
	}

	function watchPositionRemoved() {
		unwatchPositionRemovedEvent = watchContractEvent(config as any, {
			address: HarbContract.contractAddress,
			abi: HarbContract.abi,
			eventName: "PositionRemoved",
			async onLogs(logs) {
				console.log("Position removed", logs);
				await loadPositions();
				// await getMinStake();
			},
		});
	}

	onMounted(async () => {
		//initial loading positions

		if (activePositions.value.length < 1 && loading.value === false) {
			loadPositions();
			// await getMinStake();
		}

		if (!unwatch) {
			watchEvent();
		}
		if (!unwatchPositionRemovedEvent) {
			watchPositionRemoved();
		}

		if (!unwatchChainSwitch) {
			unwatchChainSwitch = watchChainId(config as any, {
				async onChange(chainId) {
					await loadPositions();
				},
			});
		}

		if (!unwatchAccountChanged) {
			unwatchAccountChanged = watchAccount(config as any, {
				async onChange() {
					await loadPositions();
				},
			});
		}
	});

	onUnmounted(() => {
		// if (unwatch) {
		// 	unwatch();
		// }
		// if (unwatchPositionRemovedEvent) {
		// 	unwatchPositionRemovedEvent();
		// }
	});

	function createRandomPosition(amount: number = 1) {
		for (let index = 0; index < amount; index++) {
			const newPosition: Position = {
				creationTime: new Date(),
				id: "123",
				positionId: 123n,
				owner: "bla",
				lastTaxTime: new Date(),
				taxPaid: 100n,
				taxRate: randomInRange(0.01, 1),
				taxRateIndex: randomInRange(1, 30),
				taxRatePercentage: getRandomInt(1, 100),
				share: getRandomInt(0.001, 0.09),
				status: "active",
				totalSupplyEnd: undefined,
				totalSupplyInit: 1000000000000n,
				amount: 150,
				harbDeposit: getRandomBigInt(1000, 5000),
				iAmOwner: false,
			};
			rawActivePositions.value.push(newPosition);
		}
	}

	function randomInRange(min: number, max: number) {
		return Math.random() < 0.5 ? (1 - Math.random()) * (max - min) + min : Math.random() * (max - min) + min;
	}

	function getRandomInt(min: number, max: number) {
		const minCeiled = Math.ceil(min);
		const maxFloored = Math.floor(max);
		const randomNumber = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive

		return randomNumber;
	}

	function getRandomBigInt(min: number, max: number) {
		const randomNumber = getRandomInt(min, max);
		return BigInt(randomNumber) * 10n ** 18n;
	}

	return {
		activePositions,
		myActivePositions,
		myClosedPositions,
		tresholdValue,
		watchEvent,
		watchPositionRemoved,
		createRandomPosition,
	};
}
