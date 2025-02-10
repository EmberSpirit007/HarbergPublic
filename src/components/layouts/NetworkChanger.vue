<template>
	<div class="network-changer" v-click-outside="closeMenu">
		<div class="network-changer-inner" @click="showMenu = !showMenu">
			<icon-base></icon-base>
            <Icon v-if="showMenu" class="toggle-icon" icon="mdi:chevron-down"></Icon>
            <Icon v-else class="toggle-icon" icon="mdi:chevron-up"></Icon>
		</div>
		<Transition name="collapse-network">
			<div v-show="showMenu" class="network-changer--list">
				<div class="list-inner" ref="listInner">
					<div class="list--element" v-for="chain in chains" :key="chain.id">
						<template v-if="chain.id === activeChain">
							<icon-base></icon-base>
							<div>{{ chain.name }}</div>
							<div>Connected</div>
						</template>
						<template v-else>
							<icon-base></icon-base>
							<div>{{ chain.name }}</div>
							<f-button outlined dense @click="switchNetwork(chain)">Switch Network</f-button>
						</template>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import IconBase from "@/components/icons/IconBase.vue";
import { ref } from "vue";
import { useChains, useChainId, useSwitchChain } from "@wagmi/vue";
import {Icon} from "@iconify/vue";
import FButton from "@/components/fcomponents/FButton.vue";

const chains = useChains();
const activeChain = useChainId();
const { switchChain } = useSwitchChain();

const showMenu = ref<boolean>(false);
const listInner = ref();

function closeMenu() {
	if (showMenu.value) {
		console.log("tesat");
		showMenu.value = false;
	}
}

async function switchNetwork(chain: any) {
	console.log("chain", chain);
	switchChain({ chainId: chain.id });
}
</script>

<style lang="sass">
:root,[data-theme="default"]
    --color-network-changer: unset
    --color-network-changer-hovered: #060f18
    --color-network-changer-toggle-icon: white

[data-theme="dark"]
    --color-network-changer: var(--color-text-primary)
    --color-network-changer-hovered: var(--color-text-primary-hovered)
    --color-network-changer-toggle-icon: var(--color-bright-white)
.network-changer
    position: relative
    .network-changer-inner
        display: flex
        background-color: var(--color-network-changer)
        padding: 8px
        border-radius: 16px
        align-items: center
        gap: 8px
        &:hover, &:focus, &:active
            background-color: var(--color-network-changer-hovered)
            cursor: pointer
        .toggle-icon
            pointer-events: none
            path
                fill: var(--color-network-changer-toggle-icon)
    .network-changer--list
        margin-top: 8px
        position: absolute
        // padding: 8px
        color: var(--color-white)
        background-color: var(--color-text-primary)
        // bottom: calc(-100% - 8px)
        overflow: hidden
        right: 0
        width: 300px
        // height: 108px
        border-radius: 16px
        .list-inner
            padding: 8px 0px
            font-size: var(--font-body1)
            display: flex
            flex-direction: column
            gap: 0
            height: 100%
            .list--element
                display: flex
                align-items: center
                gap: 8px
                padding: 8px 16px
                :last-child
                    margin-left: auto
                .f-btn
                    padding: 6px  8px



.collapse-network-enter-active
    animation: collapse reverse 200ms ease

.collapse-network-leave-active
    animation: collapse 200ms ease

@keyframes collapse-network
    from
        max-height: 100%
        // bottom: calc(-108px - 8px)
        bottom: calc(-100% - 8px)
    to
        max-height: 0px
        bottom: -8px
</style>
