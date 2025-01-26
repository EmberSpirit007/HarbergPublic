import { ref, onMounted, onUnmounted, reactive, computed, type ComputedRef } from "vue";
import * as StakeContract from "@/contracts/stake";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/wagmi";
import { compactNumber, formatBigIntDivision } from "@/utils/helper";
import { useContractToast } from "./useContractToast";

const contractToast = useContractToast();

enum State {
	SignTransaction = "SignTransaction",
	Waiting = "Waiting",
	Action = "Action",
}

export const taxRates = [
    { index: 0,year: 1, daily: 0.00274 },
    { index: 1, year: 3, daily: 0.00822 },
    { index: 2, year: 5, daily: 0.0137 },
    { index: 3, year: 8, daily: 0.02192 },
    { index: 4, year: 12, daily: 0.03288 },
    { index: 5, year: 18, daily: 0.04932 },
    { index: 6, year: 24, daily: 0.06575 },
    { index: 7, year: 30, daily: 0.08219 },
    { index: 8, year: 40, daily: 0.10959 },
    { index: 9, year: 50, daily: 0.13699 },
    { index: 10, year: 60, daily: 0.16438 },
    { index: 11, year: 80, daily: 0.21918 },
    { index: 12, year: 100, daily: 0.27397 },
    { index: 13, year: 130, daily: 0.35616 },
    { index: 14, year: 180, daily: 0.49315 },
    { index: 15, year: 250, daily: 0.68493 },
    { index: 16, year: 320, daily: 0.87671 },
    { index: 17, year: 420, daily: 1.15068 },
    { index: 18, year: 540, daily: 1.47945 },
    { index: 19, year: 700, daily: 1.91781 },
    { index: 20, year: 920, daily: 2.52055 },
    { index: 21, year: 1200, daily: 3.28767 },
    { index: 22, year: 1600, daily: 4.38356 },
    { index: 23, year: 2000, daily: 5.47945 },
    { index: 24, year: 2600, daily: 7.12329 },
    { index: 25, year: 3400, daily: 9.31507 },
    { index: 26, year: 4400, daily: 12.05479 },
    { index: 27, year: 5700, daily: 15.61644 },
    { index: 28, year: 7500, daily: 20.54795 },
    { index: 29, year: 9700, daily: 26.57534 },
];

export function useAdjustTaxRate() {
	const loading = ref();
	const waiting = ref();
	

	const state: ComputedRef<State> = computed(() => {
		if (loading.value) {
			return State.SignTransaction;
		} else if (waiting.value) {
			return State.Waiting;
		} else {
			return State.Action;
		}
	});

	async function changeTax(positionId: bigint, taxRate: number) {
		try {
			console.log("changeTax", { positionId, taxRate });

			loading.value = true;
            const index = taxRates.findIndex((obj) => obj.year === taxRate)
			const hash = await StakeContract.changeTax(positionId, index);
			console.log("hash", hash);
			loading.value = false;
			waiting.value = true;
			const data = await waitForTransactionReceipt(config as any, {
				hash: hash,
			});

			contractToast.showSuccessToast(
				taxRate.toString(),
				"Success!",
				"You adjusted your position tax to",
				"",
				"%"
			);
			waiting.value = false;
		} catch (error: any) {
			console.error("error", error);
			console.log(JSON.stringify(error, (_, v) => (typeof v === "bigint" ? v.toString() : v)));

			contractToast.showFailToast(error.shortMessage);
		} finally {
			loading.value = false;
			waiting.value = false;
		}
	}

	return reactive({ state, taxRates, changeTax });
}
