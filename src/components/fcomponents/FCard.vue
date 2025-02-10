<template>
	<div class="f-card" ref="fCard" :style="computedStyles">
		<div v-if="props.title" class="f-card__title">
			<h5>
				{{ props.title }}
			</h5>
		</div>
		<div class="f-card__body">
            <slot></slot>
        </div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";

const fCard = ref();

interface Props {
	bgColor?: string;
	borderWidth?: number;
	boxShadow?: string;
	title?: string;
}

const props = withDefaults(defineProps<Props>(), {});

const computedStyles = computed(() => ({
	"border-width": props.borderWidth,
	"background-color": props.bgColor,
	"box-shadow": props.boxShadow,
}));

onMounted(() => {
	// if (props.bgcolor) {
	// 	fCard.value.style["background-color"] = props.bgcolor;
	// }
});
</script>

<style lang="sass">
.f-card
    border-radius: var(--card-border-radius)
    overflow: hidden
    height: 100%
    box-shadow: var(--color-card-box-shadow)
    background: var(--color-card-bg)
    color: var(--color-card-font)
    h6
        color: var(--color-card-font)
    .f-card__title
        border-bottom: 2px solid var(--color-based-blue)
        color: var(--color-based-blue)
        padding: 12px
    .f-card__body
        padding: 16px
</style>
