import { ref, onMounted, onUnmounted, reactive, computed } from "vue";
import { type ComputedRef } from "vue";
import { config } from "@/wagmi";
import { AbiEncodingArrayLengthMismatchError, type WatchEventReturnType, decodeEventLog, type Hex } from "viem";
import axios from "axios";
import {
	getAccount,
	watchContractEvent,
	readContract,
	signTypedData,
	waitForTransactionReceipt,
	watchAccount,
	verifyTypedData,
} from "@wagmi/core";
import { HarbContract } from "@/contracts/harb";
import { type Abi, type Address } from "viem";
import { StakeContract, minStake, snatchService, permitAndSnatch } from "@/contracts/stake";
import { getNonce, nonce, getName } from "@/contracts/harb";
import { useWallet } from "@/composables/useWallet";
import { createPermitObject, getSignatureRSV } from "@/utils/blockchain";
import { formatBigIntDivision, compactNumber } from "@/utils/helper";
import { useToast } from "vue-toastification";
import { taxRates } from "@/composables/useAdjustTaxRates";
import { useContractToast } from "./useContractToast";
const wallet = useWallet();
const toast = useToast();
const contractToast = useContractToast();

enum StakeState {
	NoBalance = "NoBalance",
	StakeAble = "StakeAble",
	SignTransaction = "SignTransaction",
	Waiting = "Waiting",
	NotEnoughApproval = "NotEnoughApproval",
}

interface PositionCreatedEvent {
	eventName: undefined;
	args: PositionCreatedArgs;
}

interface PositionCreatedArgs {
	creationTime: number;
	owner: Hex;
	harbergDeposit: bigint;
	positionId: bigint;
	share: bigint;
	taxRate: number;
}

// const state = ref<StakeState>(StakeState.NoBalance);

export function useStake() {
	const stakingAmountRaw = ref();
	const loading = ref(false);
	const waiting = ref(false);

	onMounted(async () => {});

	const state: ComputedRef<StakeState> = computed(() => {
		const balance = wallet.balance.value;
		if (loading.value) {
			return StakeState.SignTransaction;
		} else if (minStake.value > balance || stakingAmount.value > balance) {
			return StakeState.NoBalance;
		} else if (waiting.value) {
			return StakeState.Waiting;
		} else {
			return StakeState.StakeAble;
		}
	});

	const stakingAmount = computed({
		// getter
		get() {
			return stakingAmountRaw.value || minStake.value;
		},
		// setter
		set(newValue) {
			stakingAmountRaw.value = newValue;
		},
	});

	const stakingAmountNumber = computed({
		// getter
		get() {
			return formatBigIntDivision(stakingAmount.value, 10n ** 18n);
		},
		// setter
		set(newValue) {
			stakingAmount.value = BigInt(newValue * 10 ** 18);
		},
	});

	// const stakingAmountNumber = computed(() => return staking)

	async function snatch(stakingAmount: BigInt, taxRate: number) {
		console.log("snatch", { stakingAmount, taxRate });
		const account = getAccount(config as any);
		const taxRateObj = taxRates.find((obj) => obj.year === taxRate);

		try {
			const assets: BigInt = stakingAmount;
			const receiver = wallet.account.address!;
			console.log("receiver", receiver);

			// await snatchService(assets, receiver, taxRate, []);
			// assets: BigInt, receiver: Address, taxRate: Number, positionsToSnatch: Array<BigInt>
			const deadline = BigInt(Date.now()) / 1000n + 1200n;

			const name = await getName();

			const { types, message, domain, primaryType } = createPermitObject(
				HarbContract.contractAddress,
				account.address!,
				StakeContract.contractAddress,
				nonce.value,
				deadline,
				assets,
				account.chainId!,
				name
			);
			console.log("resultPermitObject", { types, message, domain, primaryType });

			const signature = await signTypedData(config as any, {
				domain: domain as any,
				message: message,
				primaryType: primaryType,
				types: types,
			});

			console.log("signature", {
				domain: domain as any,
				message: message,
				primaryType: primaryType,
				types: types,
			});

			const { r, s, v } = getSignatureRSV(signature);
			loading.value = true;

			const hash = await permitAndSnatch(assets, account.address!, taxRateObj?.index!, [], deadline, v, r, s);
			console.log("hash", hash);
			loading.value = false;
			waiting.value = true;
			const data = await waitForTransactionReceipt(config as any, {
				hash: hash,
			});

			const topics: any = decodeEventLog({
				abi: StakeContract.abi,
				data: data.logs[3].data,
				topics: data.logs[3].topics,
			});
			const eventArgs: PositionCreatedArgs = topics.args;

			const amount = compactNumber(
				formatBigIntDivision(eventArgs.harbergDeposit, 10n ** BigInt(wallet.balance.decimals))
			);
			contractToast.showSuccessToast(
				amount,
				"Success!",
				"You Staked",
				"Check your positions on the<br /> Staker Dashboard",
				"$HARB"
			);

			waiting.value = false;
			await getNonce();
		} catch (error: any) {
			console.error("error", error);
			console.log(JSON.parse(JSON.stringify(error)));
			contractToast.showFailToast(error.name);
		} finally {
			loading.value = false;
			waiting.value = false;
		}
	}

	return reactive({ stakingAmount, stakingAmountNumber, state, snatch });
}
