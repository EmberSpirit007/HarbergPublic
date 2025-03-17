import { ref, onMounted, onUnmounted, reactive, computed } from "vue";
import { type ComputedRef } from "vue";
import { config } from "@/wagmi";
import { AbiEncodingArrayLengthMismatchError, type WatchEventReturnType } from "viem";
import axios from "axios";
import { getAccount, watchContractEvent, readContract, waitForTransactionReceipt, watchAccount } from "@wagmi/core";
import { type WatchAccountReturnType } from "@wagmi/core";
import * as HarbContract from "@/contracts/harb";
// import HarbJson from "@/assets/contracts/harb.json";
import { type Abi, type Address } from "viem";
import { useWallet } from "./useWallet";
import { compactNumber, formatBigIntDivision } from "@/utils/helper";

const wallet = useWallet();

const loading = ref(false);
const waiting = ref(false);
const ubiDue = HarbContract.ubiDue;
let unwatch: WatchAccountReturnType;

enum ClaimState {
	NothingToClaim = "NothingToClaim",
	StakeAble = "StakeAble",
	SignTransaction = "SignTransaction",
	Waiting = "Waiting",
	NotEnoughApproval = "NotEnoughApproval",
}

export function useClaim() {

    const state: ComputedRef<ClaimState> = computed(() => {
		if (loading.value) {
			return ClaimState.SignTransaction;
		} else if (ubiDue.value === 0n) {
			return ClaimState.NothingToClaim;
		} else if (waiting.value) {
			return ClaimState.Waiting;
		} else {
			return ClaimState.StakeAble;
		}
	});

	async function claimUbi() {
		try {
			const address = wallet.account.address!;

			loading.value = true;
			const hash = await HarbContract.claimUbi(address);
			console.log("hash", hash);
			loading.value = false;
			waiting.value = true;
			const data = await waitForTransactionReceipt(config as any, {
				hash: hash,
			});
			console.log("data.logs", data.logs);
            
		} catch (error) {
			console.error("error", error);
		} finally {
			loading.value = false;
			waiting.value = false;
		}
	}

	onMounted(async () => {});

	if (!unwatch) {
		console.log("useClaim function");

		unwatch = watchAccount(config as any, {
			async onChange(data) {
                console.log("watchAccount", data);
                
				if (data.address) {
                    await HarbContract.setHarbContract();
                    
				}
			},
		});
	}
	return reactive({ claimUbi, ubiDue, state });
}
