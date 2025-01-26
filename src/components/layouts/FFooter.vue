<template>
	<div class="footer" :style="{ color: (props.dark) ? 'white': 'black' }">
		<div class="footer-inner">
			<div class="footer-headline subheader2">Follow HARBERG Protocol</div>
			<div class="social-links">
				<social-button :dark="props.dark" type="discord" :href="discord"></social-button>
				<social-button :dark="props.dark" type="telegram" :href="telegram"></social-button>
				<social-button :dark="props.dark" type="twitter" :href="twitter"></social-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import socialButton from '@/components/socialButton.vue';

interface Props {
	dark?: boolean;
}

const discord = import.meta.env.VITE_DISCORD
const telegram = import.meta.env.VITE_TELEGRAM;
const twitter = import.meta.env.VITE_TWITTER;

const props = withDefaults(defineProps<Props>(), {});
</script>

<style lang="sass">
.footer
    height: auto
    background-color: var(--midnight-black)
    padding-bottom: 72px
    border-top: 0.5px solid
    @media (min-width: 992px)
        height: 150px
        min-height: 150px
        display: flex
        flex-direction: column
        justify-content: center
        padding-bottom: unset
        margin-top: auto
    .footer-inner
        padding: 24px 0
        font-size: 24px
        display: flex
        flex-direction: column
        gap: 16px
        align-items: center
        border-top: 1px solid #000
        @media (min-width: 992px)
            padding: 16px 0 24px 0
            justify-content: center
            border-top: unset
            background-color: transparent
        .footer-headline subheader2
            font-size: 16px
</style>
