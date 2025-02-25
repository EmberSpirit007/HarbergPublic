<template>
	<f-card :bg-color="bgcolor" :border-width="0" box-shadow="unset">
		<div class="info-popup">
			<div class="info-popup__header">
				<h6>{{ props.header }}</h6>
			</div>
			<div class="info-popup__body">
				<div>
					{{ props.subheader }}
				</div>
				<div v-if="props.value">
					<span class="number-big">{{ props.value }}</span
					>&nbsp;<span>{{ props.token }}</span>
				</div>
			</div>
			<div v-if="!props.value">
				<hr />
			</div>
			<div class="info-popup__body2" v-if="props.info" v-html="props.info"></div>
			<div class="info-popup__footer">
				<f-button light block small @click="closeToast">Okay</f-button>
			</div>
		</div>
		<!-- <div class="body">
			<h6 class="header">test{{ props.header }}</h6>
			<div class="subheader toast-header">test{{ props.subheader }}</div>
			<div class="amount-number">
				<div class="token-amount number-mobile">test{{ props.value }}</div>
				<div class="token-name">test{{ props.token }}</div>
			</div>
			<div class="info toast-body">test{{ props.info }}</div>
		</div> -->
	</f-card>
</template>
<script setup lang="ts">
import { getCurrentInstance, computed } from "vue";
import FButton from "@/components/fcomponents/FButton.vue";
import FCard from "@/components/fcomponents/FCard.vue";
import { useToast } from "vue-toastification";
import type { ToastID } from "vue-toastification/dist/types/types";

const props = defineProps({
	value: String,
	header: String,
	subheader: String,
	info: String,
	token: String,
	type: String,
});

const bgcolor = computed(() => {
	let color = "white";
	console.log("props.type");
	console.log(props.type);
	switch (props.type) {
		case "info":
			color = "#5f4884";
			break;
		case "error":
			color = "#8B0000";
			break;
		default:
			break;
	}
	return color;
});

// element.classList.add("toast-open");
const toast = useToast();

const instance = getCurrentInstance();
instance!.parent!.parent!.vnode!.el!.classList.add("toast-open");
const id = instance!.attrs["toast-id"] as ToastID;

console.log("instance", instance!.attrs["toast-id"]);

function closeToast() {
	instance!.parent!.parent!.vnode!.el!.classList.remove("toast-open");
	toast.dismiss(id);
}
</script>
<style lang="sass">
.info-popup
    width: 342px
    display: flex
    color: var(--color-white)
    flex-direction: column
    gap: 16px
    font-size: var(--font-body1)
    text-align: center
    hr
        border: 1px solid var(--color-grey)
    .info-popup__header
        h6
            margin: 0
            color: var(--color-white)
    .info-popup__body
        display: flex
        flex-direction: column
        gap: 8px

.Vue-Toastification__container
    &.toast-open
        background-color: rgb(15, 15, 15, 0.7)
        height: 100vh
        width: 100vw
        position: fixed
        left: 0
        bottom: 0
        z-index: 10
        @media (min-width: 992px)
            background-color: unset
        &.top-center
            @media (min-width: 600px)
                left: unset
                margin-left: unset
    .Vue-Toastification__toast
        box-shadow: unset
        &.modal-overlay
            background-color: unset
</style>
