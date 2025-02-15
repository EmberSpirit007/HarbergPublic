<!-- src/layouts/NavbarLayout.vue -->
<template>
	<navbar></navbar>
	<slideout-panel v-model="showPanel">
		<connect-wallet></connect-wallet>
		<!-- <f-footer :dark="true"></f-footer> -->
	</slideout-panel>
	<div class="navbar-layout">
		<main>
			<slot></slot>
		</main>
	</div>
	<!-- <footer>
		<f-footer :dark="darkTheme"></f-footer>
	</footer> -->
	<div class="mobile-navigation-bar" v-if="isMobile">
		<div class="mobile-navigation-tab" @click="router.push('/')">
			<div class="mobile-navigation-tab__icon">
				<icon-home />
			</div>
			<div class="mobile-navigation-tab__title">Stake</div>
		</div>
		<div class="mobile-navigation-tab" @click="openDocs">
			<div class="mobile-navigation-tab__icon">
				<icon-docs />
			</div>
			<div class="mobile-navigation-tab__title">Docs</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import Navbar from "@/components/layouts/Navbar.vue";
import SlideoutPanel from "@/components/layouts/SlideoutPanel.vue";
import ConnectWallet from "@/components/layouts/ConnectWallet.vue";
import ThemeToggle from "@/components/layouts/ThemeToggle.vue";
import FFooter from "@/components/layouts/FFooter.vue";
import { useMobile } from "@/composables/useMobile";
import { useDark } from "@/composables/useDark";
import IconHome from "@/components/icons/IconHome.vue";
import IconDocs from "@/components/icons/IconDocs.vue";
import { ref, provide } from "vue";
import {useRouter } from "vue-router"
const showPanel = ref(false);
const { darkTheme } = useDark();

const router = useRouter()

const isMobile = useMobile();
provide("isMobile", isMobile);
provide("showPanel", showPanel);

function openDocs(){
    window.open("https://emberspirit007.github.io/KraikenLanding/#/docs/Introduction")
}
</script>

<style lang="sass">
.navbar-layout
    padding-top: 100px

.mobile-navigation-bar
    height: 72px
    z-index: 1
    width: 100%
    padding: 16px 48px
    box-shadow: 0px -4px 6px 0px rgba(0, 0, 0, 0.25)
    background: var(--midnight-black, #0F0F0F)
    bottom: -1px
    position: fixed
    display: flex
    align-items: center
    .mobile-navigation-tab
        font-size: 40px
        cursor: pointer
        flex: 1 1 50%
        text-align: center
        color: white
        -webkit-tap-highlight-color: transparent
        .mobile-navigation-tab__icon
            svg
                width: 20px
                height: 20px
                path
                    fill: white
        .mobile-navigation-tab__title
            font-size: 12px
</style>