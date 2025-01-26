import { ref, reactive, computed } from "vue";
import { getChainId, watchChainId, getAccount } from "@wagmi/core";
import { config } from "@/wagmi";
import { setHarbContract } from "@/contracts/harb";
import { setStakeContract } from "@/contracts/stake";
import {chainsData} from "@/config"
const activeChain = ref()
let unwatch: any = null;


export const chainData = computed(() => {
    return  chainsData.find((obj) => obj.id === activeChain.value)
})

export function useChain() {

    
	if (!unwatch) {
		console.log("useChain function");
        const chain = getChainId(config as any)
        activeChain.value = chain
		unwatch = watchChainId(config as any, {
			async onChange(chainId) {
                    console.log("Chain changed", chainId);
                    activeChain.value = chainId
                    setHarbContract()
                    setStakeContract()
			},
		});
    }

	return reactive({ chainData });
}
