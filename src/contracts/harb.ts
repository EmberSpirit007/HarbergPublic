import { ref, onMounted, onUnmounted, reactive, computed, watch } from "vue";
import { config } from "@/wagmi";
import { type WatchEventReturnType } from "viem";
import {
	getAccount,
	watchContractEvent,
	readContract,
	writeContract,
	waitForTransactionReceipt,
	type WaitForTransactionReceiptParameters,
    getChainId
} from "@wagmi/core";
// import { HarbContract } from "@/contracts/harb";
import HarbJson from "@/assets/contracts/harb.json";
import { type Abi, type Address } from "viem";
import { StakeContract } from "@/contracts/stake";
import {getChain} from "@/config"
import logger from "@/utils/logger";
// const chain1 = useChain();
// console.log("chain1", chain1);


interface Contract {
	abi: Abi;
	contractAddress: Address;
}

export const allowance = ref();
export const nonce = ref();
export const name = ref();
export const ubiDue = ref();
export const totalSupply = ref(0n);

// export const HarbContract = await getHarbJson()
export let HarbContract = getHarbJson();

function getHarbJson(){
    console.log("getHarbJson");
    
    const chainId = getChainId(config as any);
    console.log("chainId", chainId);
    
    const chain = getChain(chainId)
    
    return {abi: HarbJson, contractAddress: chain?.harb} as Contract;
}

export function setHarbContract(){
    console.log("setHarbContract");
    
    HarbContract = getHarbJson();
}

// watch(chainData, async (newQuestion, oldQuestion) => {
//     console.log("log harb update");
    
// });


export async function getAllowance() {
    logger.contract("getAllowance");
    
	const account = getAccount(config as any);
	if (!account.address) {
		return 0n;
	}
	const result = await readContract(config as any, {
		abi: HarbContract.abi,
		address: HarbContract.contractAddress,
		functionName: "allowance",
		args: [account.address, StakeContract.contractAddress],
	});
	allowance.value = result;
	return result;
}

export async function getMinStake() {
    logger.contract("getMinStake");
    
	const result: bigint = await readContract(config as any, {
		abi: HarbContract.abi,
		address: HarbContract.contractAddress,
		functionName: "minStake",
		args: [],
	}) as bigint;
	allowance.value = result;
	return result;
}

export async function getNonce() {
    logger.contract("getNonce");

	const account = getAccount(config as any);
	if (!account.address) {
		return 0n;
	}
    console.log("HarbContract.contractAddress", HarbContract.contractAddress);
    
	const result = await readContract(config as any, {
		abi: HarbContract.abi,
		address: HarbContract.contractAddress,
		functionName: "nonces",
		args: [account.address],
	});
	nonce.value = result;
    
	return result;
}

export async function getName() {
    logger.contract("getName");

    
	const result = await readContract(config as any, {
		abi: HarbContract.abi,
		address: HarbContract.contractAddress,
		functionName: "name",
		args: [],
	});
	name.value = result;
    
	return result as string;
}


export async function approve(amount: bigint): Promise<any> {
	const account = getAccount(config as any);
	if (!account.address) {
		throw new Error("no address found");
	}
	const result = await writeContract(config as any, {
		abi: HarbContract.abi,
		address: HarbContract.contractAddress,
		functionName: "approve",
		args: [StakeContract.contractAddress, amount],
	});
	console.log("result", result);
	const transactionReceipt = waitForTransactionReceipt(config as any, {
		hash: result,
	});
	console.log("transactionReceipt", transactionReceipt);

	return transactionReceipt;
}

//claim
export async function claimUbi(address: Address): Promise<any> {
	const result = await writeContract(config as any, {
		abi: HarbContract.abi,
		address: HarbContract.contractAddress,
		functionName: "claimUbi",
		args: [address],
	});

	return result;
}


export async function getTotalSupply() {
    logger.contract("getTotalSupply");

    
	const result = await readContract(config as any, {
		abi: HarbContract.abi,
		address: HarbContract.contractAddress,
		functionName: "totalSupply",
		args: [],
	});
	totalSupply.value = result as bigint;
	return result;
}
