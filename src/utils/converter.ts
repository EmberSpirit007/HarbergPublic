/**
 * @notice Converts Harberg token assets to shares of the total staking pool.
 * @param assets Number of Harberg tokens to convert.
 * @param totalSupply Total supply of shares.
 * @param harbergTotalSupply Total supply of Harberg tokens.
 * @returns Number of shares corresponding to the input assets.
 */
export function assetsToShares(assets: bigint, totalSupply: bigint, harbergTotalSupply: bigint): bigint {
	return (assets * totalSupply) / harbergTotalSupply;
}

/**
 * @notice Converts shares of the total staking pool back to Harberg token assets.
 * @param shares Number of shares to convert.
 * @param totalSupply Total supply of shares.
 * @param harbergTotalSupply Total supply of Harberg tokens.
 * @returns The equivalent number of Harberg tokens for the given shares.
 */
export function sharesToAssets(shares: bigint, totalSupply: bigint, harbergTotalSupply: bigint): bigint {
	return (shares * harbergTotalSupply) / totalSupply;
}
