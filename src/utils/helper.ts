import { formatUnits } from 'viem'


export function getAddressShortName(address: string) {
	if (!address) {
		return "";
	}
	const addressBegin = address.substring(0, 6);
	const addressEnd = address.substring(address.length - 4, address.length);
	return addressBegin + "..." + addressEnd;
}

export function compactNumber(number: number) {
	return Intl.NumberFormat("en-US", {
		notation: "compact",
		// minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(number);
}

export function formatBigNumber(number: bigint, decimals: number, digits: number = 5) {
    let bigIntNumber = number;
    if(!bigIntNumber){
        bigIntNumber = BigInt(0)
    }
    const formattedNumber = Number(formatUnits(bigIntNumber, decimals))
    if(formattedNumber === 0){
        return "0"
    }
	return formattedNumber.toFixed(digits)
}



export function bigInt2Number(number: bigint, decimals: number) {
    let bigIntNumber = number;
    if(!bigIntNumber){
        bigIntNumber = BigInt(0)
    }
    const formattedNumber = Number(formatUnits(bigIntNumber, decimals))
	return formattedNumber
}

export function InsertCommaNumber(number: any) {
	if (!number) {
		return 0;
	}
	const formattedWithOptions = number.toLocaleString("en-US");
	return formattedWithOptions;
}

export function formatBigIntDivision(nominator: bigint, denominator: bigint, digits: number = 2) {
	if (!nominator) {
		return 0;
	}
	let display = nominator.toString();
	const decimal = (Number(denominator) / 10).toString().length;

	let [integer, fraction] = [display.slice(0, display.length - decimal), display.slice(display.length - decimal)];

	// output type number
	return Number(integer + "." + fraction);
}

