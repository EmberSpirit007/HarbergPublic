import { ref, onMounted, onUnmounted, reactive, computed } from "vue";
import { type Ref } from "vue";
import { getBalance, watchAccount, watchChainId } from "@wagmi/core";
import { type WatchAccountReturnType, type GetAccountReturnType, type GetBalanceReturnType } from "@wagmi/core";
import { config } from "@/wagmi";
import { getAllowance, HarbContract, getNonce } from "@/contracts/harb";
import logger from "@/utils/logger";
import { setHarbContract } from "@/contracts/harb";
import { setStakeContract } from "@/contracts/stake";
import {chainsData} from "@/config"

const balance = ref<GetBalanceReturnType>({
    value: 0n,
    decimals: 0,
    symbol: "",
    formatted: ""
});
const account = ref<GetAccountReturnType>({
	address: undefined,
	addresses: undefined,
	chain: undefined,
	chainId: undefined,
	connector: undefined,
	isConnected: false,
	isConnecting: false,
	isDisconnected: true,
	isReconnecting: false,
	status: "disconnected",
});

export const chainData = computed(() => {
    return  chainsData.find((obj) => obj.id === account.value.chainId)
})

let unwatch: any = null;
let unwatchChain: any = null;
export function useWallet() {

	async function loadBalance() {
        logger.contract("loadBalance")
		if (account.value.address) {
            console.log("HarbContract",HarbContract );
            
			balance.value = await getBalance(config as any, {
				address: account.value.address,
				token: HarbContract.contractAddress,
			});
            console.log("balance.value", balance.value);
            
			return balance.value;
		} else {
			return 0n;
		}
	}

	if (!unwatch) {
		console.log("useWallet function");

		unwatch = watchAccount(config as any, {
			async onChange(data) {
                console.log("watchaccount-useWallet", data);
                
                if(!data.address) {
					logger.info(`disconnected`);
                    balance.value = {
                        value: 0n,
                        decimals: 0,
                        symbol: "",
                        formatted: ""
                    }
                } else if (account.value.address !== data.address || account.value.chainId !== data.chainId) {
					logger.info(`Account changed!:`, data.address);
					account.value = data;
					await loadBalance();
					await getAllowance();
					// await loadPositions();
					await getNonce();
                    setHarbContract()
                    setStakeContract()
				}
			},
		});
    }


    //funzt nicht mehr-> library Änderung?
    if(!unwatchChain){
        console.log("unwatchChain");

		unwatchChain = watchChainId(config as any, {
			async onChange(chainId) {
                console.log("chainId123", chainId);
                
					await loadBalance();
					await getAllowance();
					await getNonce();
				}
		});
    }

	return reactive({ balance, account, loadBalance });
}
