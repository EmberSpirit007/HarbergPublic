<template>
	<div
		class="output-wrapper"
		:class="{
			'no-name': !props.name,
			'output--variant-1': props.variant === 1,
			'output--variant-2': props.variant === 2,
			'output--variant-3': props.variant === 3,
		}"
	>
		<div class="output-left">
			<div class="output-text">{{ props.name }}</div>
			<div class="output-price number-big">
				<slot name="price">
					{{ props.price }}
				</slot>
			</div>
		</div>
		<div class="output-right" v-if="slots.end">
			<slot name="end"></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useSlots } from "vue";
const props = defineProps({
	name: String,
	price: [String, Number],
	variant: {
		type: Number,
		required: false,
		default: 1,
	},
});

const slots = useSlots();
</script>

<style lang="sass">
.output-wrapper
    height: 100%
    display: flex
    flex-direction: row
    &.no-name
        gap: 0
        align-items: center
        justify-content: center
    &.output--variant-1
        padding: 16px
        border: 1px solid var(--color-grey)
        border-radius: var(--border-radius, 12px)
        background-color: var(--color-output-bg)
    &.output--variant-2
        border-bottom: 1px solid var(--color-grey)
        padding: 8px
    &.output--variant-3
        padding: 8px
    .output-left
        display: flex
        flex-direction: column
        gap: 8px
        text-align: left
        .output-text
            font-size: 14px
            font-weight: bold
    .output-right
        margin-left: auto
        align-self: center
</style>
