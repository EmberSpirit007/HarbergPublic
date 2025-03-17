<template>
	<header>
		<div class="navbar">
			<div class="navbar-inner navigation-font">
				<div class="navbar-left" @click="router.push('/')">
                <div class="navbar-title">
					<span>K</span>
					<span class="big-spacing">r</span>
					<span class="small-spacing">A</span>
					<span class="big-spacing">I</span>
					<span>ken</span>
				</div>
			</div>
				<div class="navbar-center"></div>
				<div class="navbar-end">
					<nav v-if="!isMobile">
						<RouterLink v-for="navbarRoute in navbarRoutes" :key="navbarRoute.name" :to="navbarRoute.path">
							{{ navbarRoute.title }}
						</RouterLink>
                        <a href="https://emberspirit007.github.io/KraikenLanding/#/docs/Introduction" target="_blank">Docs</a>
					</nav>
					<template v-if="!isMobile">
						<div class="vertical-line"></div>
						<network-changer></network-changer>
						<div class="vertical-line"></div>
					</template>
					<connect-button @click="showPanel = true" v-if="!isMobile"></connect-button>
					<icon-login @click="showPanel = true" v-else-if="isMobile && !address"></icon-login>
					<img
						@click="showPanel = true"
						v-else-if="isMobile && address"
						:src="getBlocky(address)"
						alt="avatar"
					/>
				</div>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { getBlocky } from "@/utils/blockies";
import { RouterLink, useRouter } from "vue-router";
import IconLogin from "@/components/icons/IconLogin.vue";
import ThemeToggle from "@/components/layouts/ThemeToggle.vue";
import NetworkChanger from "@/components/layouts/NetworkChanger.vue";
import ConnectButton from "@/components/layouts/ConnectButton.vue";
import { computed, inject, ref } from "vue";
import { useAccount } from "@wagmi/vue";
import { useDark } from "@/composables/useDark";
const {darkTheme} = useDark();
const {address} = useAccount();
const router = useRouter();


const showPanel = inject<boolean>("showPanel", false);
const isMobile = inject<boolean>("isMobile", false);

const dark1 = ref(false)
const routes = router.getRoutes();
const navbarRoutes = routes.flatMap((obj) => {
	if (obj.meta.group === "navbar") {
		return { title: obj.meta.title, name: obj.name, path: obj.path };
	} else {
		return [];
	}
});
</script>

<style lang="sass">
header
    z-index: 10
    position: fixed
    width: 100%
    .navbar
        height: 80px
        z-index: 3
        box-sizing: border-box
        transform: translate3d(0,0,0)
        background-color: var(--color-navbar-bg)
        transition: transform .3s ease,visibility 0s .3s linear
        border-bottom: 1px solid var(--color-navbar-border)
        .navbar-inner, .navbar-end, .navbar-center, .navbar-text
            align-items: center
        .navbar-inner
            display: flex
            padding: 16px 24px
            box-sizing: border-box
            height: 100%
            align-items: center
            @media (min-width: 768px)
                padding: 16px 24px
            .navbar-icon
                margin-right: 16px
                img
                    height: 50px
                    width: 50px
                    @media (min-width: 768px)
                        height: 56px
                        width: 56px

            .navbar-text
                font-size: 25px
                letter-spacing: 0.138em
                font-family: "Play-Bold"
                font-weight: bold

                @media (min-width: 768px)
                    font-size: 40px
                a
                    text-decoration: none
                    color: white
            .navbar-left
                display: flex
                gap: 8px
                letter-spacing: 3.6px
                align-items: center
                font-size: 32px
                font-weight: 400
                &:hover, &:active, &:focus
                    cursor: pointer
                .navbar-title
                    font-family: 'Audiowide', sans-serif
                    *>div
                        font-family: 'Audiowide', sans-serif
                    @media (min-width: 768px)
                        display: block
                    .big-spacing
                        letter-spacing: 5.76px
                    .small-spacing
                        letter-spacing: 1.8px
            .navbar-center
                display: flex
                margin-left: auto
            .navbar-end
                display: flex
                margin-left: auto
                height: 100%
                nav
                    display: flex
                    gap: 50px
                    a
                        &.router-link-active
                            border-bottom: 2px solid var(--color-based-blue)

                .navbar-navigation
                    display: flex
                    align-items: center
                    gap: 48px
                    .navbar-navigation-link
                        display: flex
                        gap: 8px
                        border-bottom: 2px solid transparent
                        &.active
                            border-bottom: 2px solid white
                        &:active, &:hover, &:focus
                            cursor: pointer
                        .icon
                            img
                                width: 20px
                                height: 20px



                .login-icon
                    color: var(--color-navbar-font)
                    padding: 8px
                    font-size: 25px
                    border-radius: 8px
                    width: 44px
                    height: 44px
                    display: flex
                    justify-content: center
                    align-items: center
                img
                    width: 32px
                    height: 32px
                    border-radius: 8px
                .login-icon-desktop
                    display: flex
                    padding: 8px
                    align-items: center
                    gap: 16px
                    border-radius: 16px
                    background: var(--Background-grey, #2D2D2D)
                    &:hover,&:active,&:focus
                        cursor: pointer
                    img
                        width: 32px
                        height: 32px

.vertical-line
    width: 1px
    background-color: var(--color-border-main)
    height: 100%
    margin: 0 32px
</style>
