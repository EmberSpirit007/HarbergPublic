<template>
	<div class="f-collapse">
		<div class="f-collapse-wrapper" :class="{loading: props.loading}">
            <template v-if="loading">
                <f-loader></f-loader>
            </template>
            <div class="f-collapse-inner">
			<slot name="header"></slot>
			<!-- <img class="toggle-collapse" src="../assets/expand-less.svg?url" alt="expand less" /> -->
			<Icon v-if="isShow" class="toggle-collapse" icon="mdi:chevron-down" @click="openClose"></Icon>
                <Icon v-else icon="mdi:chevron-up" class="toggle-collapse" @click="openClose"></Icon>
			<!-- <img
				class="toggle-collapse"
				src="../assets/expand-more.svg?url"
				alt="expand more"
				v-else
				
			/> -->
		</div>
		<Transition name="collapse">
			<div v-if="isShow" class="collapsableDiv">
				<slot></slot>
			</div>
		</Transition>
        </div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {Icon} from "@iconify/vue";
import FLoader from "@/components/fcomponents/FLoader.vue";

const emit = defineEmits(["collapse:opened", "collapse:closed"]);

const props = defineProps<{
	loading?: boolean;
}>();

const isShow = ref(false);
const openClose = () => {
	isShow.value = !isShow.value;
    if(isShow.value){
        emit("collapse:opened")
    } else{
        emit("collapse:closed")
    }
};
</script>
<style lang="sass">
.f-collapse
    border-radius: var(--border-radius)
    border: 1px solid var(--color-collapse-border)
    background-color: var(--color-collapse-bg)
    .f-collapse-wrapper
        padding: 8px 16px
        &.loading
            opacity: 0.5
            position: relative
            pointer-events: none
            .cube
                position: absolute
                left: 50%
                top: 50%
                transform: translate(-50%, -50%)
        .f-collapse-inner
            display: flex
            position: relative
            align-items: center
            .toggle-collapse
                font-size: 25px
                align-self: flex-start
                g
                    path
                        fill: var(--color-expand-icon)
                &:hover, &:active, &:focus
                    cursor: pointer
        .collapsableDiv
            color: var(--color-collapse-font)

        .collapse-enter-active
            animation: collapse reverse 500ms ease

        .collapse-leave-active
            animation: collapse 500ms ease

        @keyframes collapse
            from
                max-height: 200px
                overflow: hidden

            to
                max-height: 0px
                overflow: hidden
  

</style>
