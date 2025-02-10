<template>
	<template v-if="status === 'disconnected'">
		<f-button class="connect-button--disconnected">Connect</f-button>
	</template>
	<template v-else-if="status === 'connected'">
		<f-button class="connect-button connect-button--connected">
			<img :src="getBlocky(address!)" alt="avatar" />
			<div>{{ getAddressShortName(address!) }}</div>
		</f-button>
	</template>
	<template v-else>
		<f-button class="connect-button--loading">loading</f-button>
	</template>
</template>

<script setup lang="ts">
import FButton from "@/components/fcomponents/FButton.vue";
import { getAddressShortName } from "@/utils/helper";
import { useAccount } from "@wagmi/vue";
import { getBlocky } from "@/utils/blockies";

const { address, status } = useAccount();
</script>

<style lang="sass">
:root,[data-theme="default"]
    --color-connect-button--disconnected: var(--color-primary)
    --font-color-connect-button--disconnected: var(--color-bright-white)
    --color-connect-button--connected: unset
    --font-color-connect-button--connected: var(--color-bright-white)
    --color-connect-button-border--connected: var(--color-grey)
    --color-connect-button-hovered--connected: #060f18

[data-theme="dark"]
    --color-connect-button--disconnected: var(--color-based-blue)
    --font-color-connect-button--disconnected: var(--color-bright-white)
    --color-connect-button--connected: var(--color-midnight-black)
    --font-color-connect-button--connected: var(--color-bright-white)
    --color-connect-button-border--connected: var(--color-very-light-grey)
    --color-connect-button-hovered--connected: var(--color-midnight-black-hovered)

.f-btn
    &.connect-button
        padding: 8px
        align-items: center
        gap: 12px
    &.connect-button--disconnected
        // background-color: var(--color-midnight-black)
        background-color: var(--color-connect-button--disconnected)
        color: var(--font-color-connect-button--disconnected)
    &.connect-button--connected
        background-color: var(--color-connect-button--connected)
        border: 1px solid var(--color-connect-button-border--connected)
        color: var(--font-color-connect-button--connected)
        &:hover, &:focus, &:active
            background-color: var(--color-connect-button-hovered--connected)
            cursor: pointer
</style>
