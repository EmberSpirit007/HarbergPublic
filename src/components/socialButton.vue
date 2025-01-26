<template>
	<a :href="props.href" target="_blank">
		<div
			class="social-badge"
			:style="{ color: color, 'border-color': color }"
			:class="{ 'social-badge--dark': props.dark }"
		>
			<div class="social-badge-icon">
				<component :color="color" :is="img" />
			</div>
		</div>
	</a>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from "vue";

interface Props {
	type?: string;
	dark?: boolean;
	href?: string;
}

const props = withDefaults(defineProps<Props>(), {});

const color = computed(() => (props.dark ? "white" : "black"));

const img = computed(() => {
	let img;
	switch (props.type) {
		case "discord":
			img = defineAsyncComponent(() => import(`../components/icons/IconDiscord.vue`));
			break;
		case "twitter":
			img = defineAsyncComponent(() => import(`../components/icons/IconTwitter.vue`));
			break;
		case "telegram":
			img = defineAsyncComponent(() => import(`../components/icons/IconTelegram.vue`));
			break;

		default:
			break;
	}

	return img;
});
</script>
<style lang="sass">
.social-badge
    border-radius: 14px
    display: flex
    border: 1px solid var(--color-social-border)
    padding: 6px 20px
    align-items: center
    flex: 0 1 0
    color: black
    &:hover,&:active,&:focus
        background-color: var(--color-white-hovered)
        cursor: pointer
    &.social-badge--dark
        &:hover, &:active, &:focus
            background-color: var(--color-black-hovered)
    //     font-size: 0
</style>
