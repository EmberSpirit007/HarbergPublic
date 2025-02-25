<template>
	<div class="connect-wallet-wrapper">
		<template v-if="status === 'connected'">
			<div class="connected-header">
				<div class="connected-header-avatar">
					<img :src="getBlocky(address!)" alt="avatar" />
				</div>
				<div class="connected-header-address" :title="address">
					{{ getAddressShortName(address!) }}
				</div>
				<div class="connected-header-logout" @click="() => disconnect()">
					<img src="@/assets/logout.svg" alt="Logout" />
				</div>
			</div>
			<h6 class="connected-tokens-headline">Your Tokens</h6>
			<div class="connected-tokens">
				<f-output name="$KrAIken" :price="harbAmount" :variant="3">
					<template #end>
						<f-button size="small" dense
							><a :href="chain.chainData?.uniswap" target="_blank">Buy</a></f-button
						>
					</template>
				</f-output>
				<f-output name="Staked $KrAIken" :price="compactNumber(stakedAmount)" :variant="3">
					<template #end>
						<f-button size="small" dense @click="stakeLink">Stake</f-button>
					</template>
				</f-output>
			</div>
		</template>
		<template v-else-if="status === 'disconnected'">
			<h6 class="connect-wallet-headline low-mid-text">Connect your wallet</h6>
			<div class="connectors-wrapper">
				<div
					class="connectors-element card"
					:class="[[connector.id]]"
					v-for="connector in connectors"
					:key="connector.id"
					@click="connectWallet(connector, chainId)"
				>
					<div class="connector-icon">
						<img :src="loadConnectorImage(connector)" :alt="`${connector.name} Logo`" />
					</div>
					<div class="connector-name">
						{{ connector.name }}
					</div>
				</div>
			</div>
			<div>Are you coming from Binance, Bybit, Kucoin or any other crypto exchange?</div>
			<div><u>Follow these instructions first.</u></div>
		</template>
		<template v-else>
			<div>loading</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { getCurrentInstance, computed } from "vue";
import { useRouter } from "vue-router";
import { getAddressShortName, compactNumber, formatBigIntDivision } from "@/utils/helper";
import { getBlocky } from "@/utils/blockies";
import FButton from "@/components/fcomponents/FButton.vue";
import FOutput from "@/components/fcomponents/FOutput.vue";

// import { usePositions } from "@/composables/usePositions";
// import { useWallet } from "@/composables/useWallet";
import { usePositions } from "@/composables/usePositions";
import { useWallet } from "@/composables/useWallet";
import { useChain } from "@/composables/useChain";

import {
	useAccount,
	useDisconnect,
	useConnect,
	useChainId,
	useBalance,
	type CreateConnectorFn,
	type Connector,
} from "@wagmi/vue";

const { address, status } = useAccount();
const { disconnect } = useDisconnect();
const { connectors, connect, error } = useConnect();
const router = useRouter();
const chainId = useChainId();
const { myActivePositions } = usePositions();
const wallet = useWallet();
const chain = useChain();
function loadConnectorImage(connector: Connector) {
	if (connector.icon) {
		return connector.icon;
	} else {
		return `./img/connectors/${connector.name}.svg`;
	}
}
// const goerliKey = import.meta.env.VITE_GOERLI_KEY;

const harbAmount = computed(() => {
	if (wallet.balance?.value) {
		return compactNumber(formatBigIntDivision(wallet.balance?.value, 10n ** BigInt(wallet.balance.decimals)));
	} else {
		return "0";
	}
});

const stakedAmount = computed(() =>
	myActivePositions.value.reduce(function (a, b) {
		return a + b.amount;
	}, 0)
);

const instance = getCurrentInstance();

// const connectors = computed(() => {
// 	console.log();
// 	return wallet.connectors.filter((obj) => obj.id !== "injected");
// });

// async function disconnect() {
// 	console.log("disconnectWallet");
// 	try {
// 		await wallet.disconnectWallet();
// 		instance.parent.emit("update:modelValue", false);
// 	} catch (error) {
// 		console.log("error", error);
// 	}
// }

// function badgeClick(token) {
// 	var tokenData = tokenStore.getToken(token.contractAddress);
// 	if (tokenStore.memeToken.contractAddress === token.contractAddress) {
// 		//buy
// 		window.open(
// 			`https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=${token.contractAddress}&chain=goerli`,
// 			"_blank"
// 		);
// 	} else {
// 		router.push({ name: "home" });
// 		instance.parent.emit("update:modelValue", false);
// 	}
// }

function closeModal() {
	instance!.parent!.emit("update:modelValue", false);
}

// //special case for metaMask, but I think that is the most used wallet
async function connectWallet(connector: CreateConnectorFn | Connector, chainId: any) {
	console.log("connector", connector);
	console.log("connector", connector.name);
	connect({ connector, chainId });
	closeModal();
}

function stakeLink() {
	router.push("/dashboard#stake");
	closeModal();
}
</script>

<style lang="sass">
@use 'sass:color'
.connect-wallet-wrapper
    display: flex
    flex-direction: column
    gap: 24px
    color: white
    .connect-wallet-headline
        text-align: left
    .connectors-wrapper
        display: flex
        flex-direction: column
        gap: 8px
        .connectors-element
            display: flex
            padding: 12px
            border: 1px solid rgba(152, 161, 192, 0.24)
            background-color: white
            color: var(--midnight-black, #0F0F0F)
            &:hover, &:active, &:focus
                background-color: color.adjust(white, $lightness: -20%)
                cursor: pointer
            .connector-icon
                border-radius: 12px
                width: 40px
                overflow: hidden
                height: 40px
                img
                    width: 40px
            .connector-name
                padding: 0 8px
                align-self: center
                font-size: 16px
                @media (min-width: 768px)
                    font-size: 18px





    .connected-header
        display: flex
        gap: 16px
        align-items: center
        .connected-header-avatar
            img
                border-radius: 8px
        .connected-header-logout
            margin-left: auto
            &:hover, &:active, &:focus
                cursor: pointer
            svg
                font-size: 25px

    .connected-tokens-headline
        text-align: left
    .connected-tokens
        display: flex
        flex-direction: column
        gap: 16px
        margin-bottom: 24px
        .connected-token
            display: flex
            gap: 16px
            align-items: center
            .connected-token-button
                margin-left: auto
                .bloodline-badge
                    padding: 4px 16px
                    color: black
                    font-size: 14px
                    &:hover, &:active, &:focus
                        cursor: pointer
                        background-color: var(--grey-light)
</style>
