import { ref, onMounted, onUnmounted, reactive, computed } from "vue";
import axios from "axios";
import { useChain } from "./useChain";
import { watchBlocks, watchChainId } from "@wagmi/core";
import { config } from "@/wagmi";
import logger from "@/utils/logger";
import type { WatchBlocksReturnType } from "viem";

interface statsCollection {
	burnNextHourProjected: bigint;
	burnedLastDay: bigint;
	burnedLastWeek: bigint;
	id: string;
	lastUpdatedHour: number;
	mintNextHourProjected: bigint;
	mintedLastDay: bigint;
	mintedLastWeek: bigint;
	outstandingStake: bigint;
	harbTotalSupply: bigint;
	stakeTotalSupply: bigint;
	ringBufferPointer: number;
	totalBurned: bigint;
	totalMinted: bigint;
}

const rawStatsCollections = ref<Array<statsCollection>>([]);
const loading = ref(false);
const initialized = ref(false);
const chain = useChain();

export async function loadStatsCollection() {
	logger.info(`loadStatsCollection for chain: ${chain.chainData?.path}`);
	if (!chain.chainData?.thegraph) {
		return [];
	}

	const res = await axios.post(chain.chainData?.thegraph, {
		query: `query MyQuery {
            stats_collection {
              burnNextHourProjected
              burnedLastDay
              burnedLastWeek
              id
              lastUpdatedHour
              mintNextHourProjected
              mintedLastDay
              mintedLastWeek
              outstandingStake
              harbTotalSupply
              stakeTotalSupply
              ringBufferPointer
              totalBurned
              totalMinted
            }
          }`,
	});
	console.groupEnd();
	return res.data?.data?.stats_collection;
}

const profit7d = computed(() => {
	if (!statsCollection.value) {
		return 0n;
	}
	return (
		(BigInt(statsCollection.value?.mintedLastWeek) - BigInt(statsCollection.value?.burnedLastWeek)) /
		(BigInt(statsCollection.value?.totalMinted) - BigInt(statsCollection.value?.totalBurned))
	);
});
const nettoToken7d = computed(() => {
	if (!statsCollection.value) {
		return 0n;
	}

	return BigInt(statsCollection.value?.mintedLastWeek) - BigInt(statsCollection.value.burnedLastWeek);
});

const statsCollection = computed(() => {
	if (rawStatsCollections.value?.length > 0) {
		return rawStatsCollections.value[0];
	} else {
		return undefined;
	}
});


const outstandingStake = computed(() => {
	if (rawStatsCollections.value?.length > 0) {
		return BigInt(rawStatsCollections.value[0].outstandingStake);
	} else {
		return 0n;
	}
});

const harbTotalSupply = computed(() => {
	if (rawStatsCollections.value?.length > 0) {
		return BigInt(rawStatsCollections.value[0].harbTotalSupply);
	} else {
		return 0n;
	}
});

const stakeTotalSupply = computed(() => {
	if (rawStatsCollections.value?.length > 0) {
		return BigInt(rawStatsCollections.value[0].stakeTotalSupply);
	} else {
		return 0n;
	}
});

//Total Supply Change / 7d=mintedLastWeek−burnedLastWeek
const totalSupplyChange7d = computed(() => {
    if (rawStatsCollections.value?.length > 0) {
		return BigInt(rawStatsCollections.value[0].mintedLastWeek - rawStatsCollections.value[0].burnedLastWeek)
    } else {
        return 0n
    }
});


//totalsupply Change7d / harbtotalsupply 
const inflation7d = computed(() => {
    if (rawStatsCollections.value?.length > 0 && rawStatsCollections.value[0].harbTotalSupply > 0) {
    return BigInt(rawStatsCollections.value[0].mintedLastWeek - rawStatsCollections.value[0].burnedLastWeek)
    } else {
        return 0n
    }
});


export async function loadStats() {
	loading.value = true;

	rawStatsCollections.value = await loadStatsCollection();

	loading.value = false;
	initialized.value = true;
}

let unwatch: any = null;
let unwatchBlock: WatchBlocksReturnType;
const loadingWatchBlock = ref(false);
export function useStatCollection() {
	onMounted(async () => {
		//initial loading stats
		if (rawStatsCollections.value?.length === 0 && !loading.value) {
			await loadStats();
		}
	});
	if (!unwatch) {
		console.log("watchChain");

		//chain Switch reload stats for other chain
		unwatch = watchChainId(config as any, {
			async onChange(chainId) {
				await loadStats();
			},
		});

		// const unwatchBlock = watchBlocks(config as any, {
		//     async onBlock(block) {
		//         console.log('Block changed!', block)
		//         await loadStats();
		//     },
		// })
	}
	onUnmounted(() => {
		unwatch();
	});

	return reactive({
		profit7d,
		nettoToken7d,
        inflation7d,
		outstandingStake,
		harbTotalSupply,
		stakeTotalSupply,
        totalSupplyChange7d,
		initialized,
	});
}
