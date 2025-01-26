<template>
	<navbar></navbar>
    <slideout-panel v-model="showPanel">
        <connect-wallet></connect-wallet>
		<div class="mobile-settings" v-if="isMobile">
			<theme-toggle v-model="darkTheme"></theme-toggle>
		</div>
		<f-footer :dark="true"></f-footer>
    </slideout-panel>
	<main>
		<RouterView />
	</main>
    <footer>
		<f-footer :dark="darkTheme"></f-footer>
	</footer>
	<div class="mobile-navigation-bar" v-if="isMobile">
		<div class="mobile-navigation-tab" @click="router.push('/dashboard')">
			<div class="mobile-navigation-tab__icon">
				<icon-home />
			</div>
			<div class="mobile-navigation-tab__title">Dashboard</div>
		</div>
		<div class="mobile-navigation-tab" @click="router.push('/docs')">
			<div class="mobile-navigation-tab__icon">
				<icon-docs />
			</div>
			<div class="mobile-navigation-tab__title">Docs</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";

import Navbar from "@/components/layouts/Navbar.vue";
import SlideoutPanel from "@/components/layouts/SlideoutPanel.vue";
import ConnectWallet from "@/components/layouts/ConnectWallet.vue";
import ThemeToggle from "@/components/layouts/ThemeToggle.vue";
import FFooter from "@/components/layouts/FFooter.vue";
import { useMobile } from "@/composables/useMobile";
import { useDark } from "@/composables/useDark";
import IconHome from "@/components/icons/IconHome.vue";
import IconDocs from "@/components/icons/IconDocs.vue";
import { provide, ref } from "vue";
const isMobile = useMobile();
const { darkTheme } = useDark();
const showPanel = ref(false);

const router = useRouter();

provide("isMobile", isMobile);
provide("showPanel", showPanel);
</script>


<style lang="sass">
footer
    margin-top: auto
</style>