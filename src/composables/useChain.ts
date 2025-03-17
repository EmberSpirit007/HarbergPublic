import { ref, reactive, computed } from "vue";
import { getChainId, watchChainId, getAccount, watchAccount } from "@wagmi/core";
import { config } from "@/wagmi";
import { setHarbContract } from "@/contracts/harb";
import { setStakeContract } from "@/contracts/stake";
import {chainsData} from "@/config"
import logger from "@/utils/logger";
const activeChain = ref()
let unwatch: any = null;



export const chainData = computed(() => {
    return  chainsData.find((obj) => obj.id === activeChain.value)
})

export function useChain() {

    
	// if (!unwatch) {
	// 	console.log("useChain function");
    //     const chain = getChainId(config as any)
    //     activeChain.value = chain
	// 	unwatch = watchChainId(config as any, {
	// 		async onChange(chainId) {
    //                 console.log("Chain changed", chainId);
    //                 activeChain.value = chainId
    //                 setHarbContract()
    //                 setStakeContract()
	// 		},
	// 	});
    // }

//    if (!unwatch) {
//         console.log("useWallet function");
   
//         unwatch = watchAccount(config as any, {
//             async onChange(data) {
//                    console.log("watchaccount-useChain", data);
                   
//                    if(!data.address) {
//                    } else if (activeChain.value !== data.chainId) {
//                     logger.info(`Chain changed!:`, data.chainId);
//                 }
//             },
//         });
//        }
   

	return reactive({ chainData });
}
