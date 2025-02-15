<template>
	<div class="slideout-overlay" :class="{ open: props.modelValue }" @click="showPanel = false"></div>
	<div :class="{ 'slideout-wrapper': true, open: props.modelValue }">
		<div class="slideout-panel">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { inject, watchEffect } from "vue";

const props = defineProps({
	modelValue: Boolean,
});

defineEmits(["update:modelValue"]);

const showPanel = inject("showPanel");
</script>

<style lang="sass">
@use 'sass:color'
.slideout-overlay
    position: fixed
    z-index: 100
    &.open
        height: 100%
        width: 100%
        background-color: rgb(15, 15, 15, 0.7)
.slideout-wrapper
    z-index: 100
    height: 100svh
    position: fixed
    display: flex
    background-color: var(--midnight-black, #0F0F0F)
    border-radius: 16px
    transition: margin-bottom 250ms ease 0s
    width: 100%
    margin-bottom: -100vh
    bottom: 0
    overflow: auto
    @media (min-width: 768px)
        margin-right: -400px
        transition: margin-right 250ms ease 0s
        width: auto
        right: -30px
        top: 0
    &.open
        margin-bottom: -82px
        @media (min-width: 768px)
            margin-right: 30px
    .slideout-panel
        width: 100%
        padding: 24px 24px 16px 24px
        overflow: scroll
        // height: calc( 100svh - 82px )
        display: flex
        flex-direction: column
        height: calc( 100vh - 80px)
        @media (min-width: 768px)
            width: 400px
            overflow: unset
            height: 100%
        .slideout-icon
            cursor: pointer
            &:hover, &:active, &:focus
                background-color: color.adjust(#2D2D2D, $lightness: 20%)
            svg
                font-size: 30px
</style>
