import { ref, onMounted, onUnmounted, reactive, computed } from "vue";
import { type Ref } from "vue";
import { getBalance, watchAccount, watchChainId } from "@wagmi/core";
import { type WatchAccountReturnType, type GetAccountReturnType, type GetBalanceReturnType } from "@wagmi/core";
import { config } from "@/wagmi";
import { type Address, type Chain } from "viem";
import { getAllowance, HarbContract, getNonce } from "@/contracts/harb";
import { loadPositions } from "@/composables/usePositions";
import logger from "@/utils/logger";

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

			return balance.value;
		} else {
			return 0n;
		}
	}

	if (!unwatch) {
		console.log("useWallet function");

		unwatch = watchAccount(config as any, {
			async onChange(data) {
                if(!data.address) {
					logger.info(`disconnected`);
                    balance.value = {
                        value: 0n,
                        decimals: 0,
                        symbol: "",
                        formatted: ""
                    }
                } else if (account.value.address !== data.address) {
					logger.info(`Account changed!:`, data.address);
					account.value = data;
					await loadBalance();
					await getAllowance();
					// await loadPositions();
					await getNonce();
				}
			},
		});
    }

    if(!unwatchChain){
        console.log("unwatchChain");

		unwatchChain = watchChainId(config as any, {
			async onChange(chainId) {
					await loadBalance();
					await getAllowance();
					await getNonce();
				}
		});
    }

	return reactive({ balance, account, loadBalance });
}
