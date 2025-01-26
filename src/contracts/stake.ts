import { ref } from "vue";
import { config } from "@/wagmi";
import { readContract, writeContract, getChainId } from "@wagmi/core";
import StakeJson from "@/assets/contracts/stake.json";
import { type Abi, type Address } from "viem";
import {getChain} from "@/config"
import logger from "@/utils/logger";

const TAX_FLOOR_DURATION = 60 * 60 * 24 * 3;
interface Contract {
	abi: Abi;
	contractAddress: Address;
}


export const minStake = ref();
export const totalSupply = ref(0n);
export const outstandingSupply = ref(0n)


export let StakeContract = getStakeJson()

function getStakeJson(){
    const chainId = getChainId(config as any);
    console.log("chainId", chainId);

    const chain = getChain(chainId)
    
    return {abi: StakeJson, contractAddress: chain?.stake} as Contract;
}

export function setStakeContract(){
    logger.contract("setStakeContract")
    StakeContract = getStakeJson();
}


export async function snatchService(
	assets: BigInt,
	receiver: Address,
	taxRate: Number,
	positionsToSnatch: Array<BigInt>
) {
    console.log("StakeContract", StakeContract);
    
	const result = await writeContract(config as any, {
		abi: StakeContract.abi,
		address: StakeContract.contractAddress,
		functionName: "snatch",
		args: [assets, receiver, taxRate, positionsToSnatch],
	});
	return result;
}

export async function exitPosition(positionId: bigint): Promise<any> {
	const result = await writeContract(config as any, {
		abi: StakeContract.abi,
		address: StakeContract.contractAddress,
		functionName: "exitPosition",
		args: [positionId],
	});

	return result;
}

//changeTax
export async function changeTax(positionId: bigint, taxRate: number): Promise<any> {
	const result = await writeContract(config as any, {
		abi: StakeContract.abi,
		address: StakeContract.contractAddress,
		functionName: "changeTax",
		args: [positionId, taxRate],
	});

	return result;
}

/**
 * snatch/stake with permit
 */
export async function permitAndSnatch(
	assets: BigInt,
	receiver: Address,
	taxRate: number,
	positionsToSnatch: Array<BigInt>,
	deadline: BigInt,
	v: any,
	r: any,
	s: any
) {
    console.log("permitAndSnatch", assets, receiver, taxRate, positionsToSnatch, deadline, v, r, s);

	const result = await writeContract(config as any, {
		abi: StakeContract.abi,
		address: StakeContract.contractAddress,
		functionName: "permitAndSnatch",
		args: [assets, receiver, taxRate, positionsToSnatch, deadline, v, r, s],
	});
	return result;
}

export async function getTotalSupply() {
    logger.contract("getTotalSupply")
    await setStakeContract();
	const result = await readContract(config as any, {
		abi: StakeContract.abi,
		address: StakeContract.contractAddress,
		functionName: "totalSupply",
		args: [],
	});
    console.log("result", result);
    
	totalSupply.value =  result as bigint;
	return result;
}

export async function getOutstandingSupply() {
    logger.contract("getOutstandingSupply")
    
	const result = await readContract(config as any, {
		abi: StakeContract.abi,
		address: StakeContract.contractAddress,
		functionName: "outstandingStake",
		args: [],
	});
    
	outstandingSupply.value =  result as bigint;
	return result;
}

export async function getTaxDue(positionID: bigint) {
    logger.contract("getTaxDue")
	const result = await readContract(config as any, {
		abi: StakeContract.abi,
		address: StakeContract.contractAddress,
		functionName: "taxDue",
		args: [positionID, TAX_FLOOR_DURATION],
	});
	return result as bigint;
}



