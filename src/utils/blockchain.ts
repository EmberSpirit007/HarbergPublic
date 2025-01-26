import { type Address, type TypedDataDomain, type Hex, slice, hexToNumber, hexToBigInt, recoverAddress } from "viem";


export function createPermitObject(
	verifyingContract: Address,
	fromAddress: Address,
	spender: Address,
	nonce: BigInt,
	deadline: BigInt,
	value: BigInt,
	chain: number,
    domainName: string
) {
	const message = {
		owner: fromAddress,
		spender: spender,
		nonce: nonce,
		deadline: deadline,
		value: value,
	};
    

	const domainType = [
		{ name: "name", type: "string" },
		{ name: "version", type: "string" },
		{ name: "chainId", type: "uint256" },
		{ name: "verifyingContract", type: "address" },
	];

	const primaryType: "EIP712Domain" | "Permit" = "Permit";

	const types = {
		EIP712Domain: domainType,
		Permit: [
			{
				name: "owner",
				type: "address",
			},
			{
				name: "spender",
				type: "address",
			},
			{
				name: "value",
				type: "uint256",
			},
			{
				name: "nonce",
				type: "uint256",
			},
			{
				name: "deadline",
				type: "uint256",
			},
		],
	};

	const domain: TypedDataDomain | undefined = {
		name: domainName, 
		version: "1",
		chainId: chain,
		verifyingContract: verifyingContract,
	};

	return {
		types,
		message,
		domain,
		primaryType,
	};
}

export function getSignatureRSV2(sig: `0x${string}`) {
	// splits the signature to r, s, and v values.
	// const pureSig = sig.replace("0x", "");
	const [r, s, v] = [slice(sig, 0, 32), slice(sig, 32, 64), slice(sig, 64, 65)];
	return { r, s, v: Number(v) };
}

export function getSignatureRSV(signature: `0x${string}`) {
    const r = signature.slice(0, 66) as `0x${string}`;
    const s = `0x${signature.slice(66, 130)}` as `0x${string}`;
    const v = hexToBigInt(`0x${signature.slice(130, 132)}`);
    return { r, s, v };
  }