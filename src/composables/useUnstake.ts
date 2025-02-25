import { ref, onMounted, onUnmounted, reactive, computed, type ComputedRef } from "vue";
import * as StakeContract from "@/contracts/stake";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/wagmi";
import { useContractToast } from "./useContractToast";
import { compactNumber, formatBigIntDivision } from "@/utils/helper";
import { decodeEventLog } from "viem";
import { useWallet } from "./useWallet";

const contractToast = useContractToast();
const wallet = useWallet();

enum StakeState {
	SignTransaction = "SignTransaction",
	Waiting = "Waiting",
	Unstakeable = "Unstakeable",
}

interface PositionRemovedArgs {
	lastTaxTime: number;
	positionId: bigint;
	harbergPayout: bigint;
}

export function useUnstake() {
	const loading = ref();
	const waiting = ref();

	const state: ComputedRef<StakeState> = computed(() => {
		if (loading.value) {
			return StakeState.SignTransaction;
		} else if (waiting.value) {
			return StakeState.Waiting;
		} else {
			return StakeState.Unstakeable;
		}
	});

	async function exitPosition(positionId: bigint) {
		try {
			console.log("positionId", positionId);

			loading.value = true;
			const hash = await StakeContract.exitPosition(positionId);
			console.log("hash", hash);
			loading.value = false;
			waiting.value = true;
			const data = await waitForTransactionReceipt(config as any, {
				hash: hash,
			});

			const topics: any = decodeEventLog({
				abi: StakeContract.StakeContract.abi,
				data: data.logs[2].data,
				topics: data.logs[2].topics,
			});

			const eventArgs: PositionRemovedArgs = topics.args;

			const amount = compactNumber(
				formatBigIntDivision(eventArgs.harbergPayout, 10n ** BigInt(wallet.balance.decimals))
			);
			contractToast.showSuccessToast(amount, "Success!", "You unstaked", "", "$KrAIken");

			waiting.value = false;
			wallet.loadBalance();
		} catch (error: any) {
			console.error("error", error);
			contractToast.showFailToast(error.name);
		} finally {
			loading.value = false;
			waiting.value = false;
		}
	}

	return reactive({ state, exitPosition });
}
