<template>
	<button class="f-btn" :class="classObject" :style="styleObject">
		<slot></slot>
	</button>
</template>

<script setup lang="ts">
interface Props {
	size?: string;
	dense?: boolean;
	disabled?: boolean;
	invert?: boolean;
	block?: boolean;
	outlined?: boolean;
	bgColor?: string;
	light?: boolean;
	dark?: boolean;
}

import { computed } from "vue";

const props = withDefaults(defineProps<Props>(), {
	size: "medium",
});

const classObject = computed(() => ({
	"f-btn--tiny": props.size === "tiny",
	"f-btn--small": props.size === "small",
	"f-btn--medium": props.size === "medium",
	"f-btn--large": props.size === "large",
	"f-btn--dense": props.dense,
	"f-btn--disabled": props.disabled,
	"f-btn--invert": props.invert,
	"f-btn--block": props.block,
	"f-btn--outlined": props.outlined,
	"f-btn--light": props.light,
	"f-btn--dark": props.dark,
}));

const styleObject = computed(() => {
	const returnObject: any = {};
	if (props.bgColor) {
		returnObject["background-color"] = props.bgColor;
	}
	return returnObject;
});
</script>

<style lang="sass">
@use 'sass:color'
.f-btn
    padding: var(--btn-padding, 16px 32px)
    gap: 8px
    border-radius: var(--border-radius, 12px)
    border: none
    display: inline-flex
    text-decoration: none
    background-color: var(--color-button-bg)
    color: var(--color-button-font, white)
    letter-spacing: 0.15px
    transition: color .25s
    transition: background-color .25s
    justify-content: center
    font-weight: bold
    font-size: var(--font-size-button-medium)
    &.f-btn--tiny
        font-size: 13px
        letter-spacing: 0.46px
        padding: 4px 16px
    &.f-btn--small
        font-size: var(--font-size-button-small)
        letter-spacing: 0.46px
    &.f-btn--large
        font-size: var(--font-size-button-large)
    &.f-btn--disabled
        background-color: var(--color-bg-disabled, #D6D6D6)
        color: var(--color-disabled, #A1A3A7)
        &:hover,&:focus,&:active
            background-color: var(--color-bg-disabled, #D6D6D6)
            color: var(--color-disabled, #A1A3A7)
            cursor: not-allowed
    &.f-btn--dense
        padding: var(--btn-dense-padding, 8px 16px)
    &.f-btn--invert
        background-color: var(--btn-color, white)
        color: var(--color-button-bg)
        border: 2px solid var(--color-button-bg)
        &:hover,&:focus,&:active
            background-color: color.adjust(white, $lightness: -20%)
    &.f-btn--light
        background-color: var(--color-white, white)
        color: var(--color-secondary)
        border: 2px solid var(--color-white)
        &:hover,&:focus,&:active
            background-color: color.adjust(white, $lightness: -20%)
            border: 2px solid var(--color-white)
    &.f-btn--block
        display: flex
        flex: 1 0 auto
        min-width: 100%
    &.f-btn--outlined
        background-color: transparent
        color: var(--color-button-bg)
        border: 1px solid var(--color-button-border--outlined)

        &:hover,&:focus,&:active
            cursor: pointer
            background-color: var(--color)
    &:hover,&:focus,&:active
        cursor: pointer
        background-color: #5f4884
</style>
