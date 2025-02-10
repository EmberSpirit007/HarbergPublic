<template>
	<div class="f-input" :class="classObject">
		<div class="f-input-label subheader2">
			<label v-if="props.label" :for="name">{{ props.label }}</label>
			<icon>
				<template v-slot:text v-if="slots.info">
					<slot name="info"></slot>
				</template>
			</icon>
		</div>
        <div class="f-input__wrapper" ref="inputWrapper" @click="setFocus">
            <input
                :disabled="props.disabled"
                :readonly="props.readonly"
                :type="props.type"
                :name="name"
                :id="name"
                @input="updateModelValue"
                :value="props.modelValue"
            />
            <div class="f-input--suffix" v-if="slots.suffix">
                <slot name="suffix" >test </slot>
            </div>
        </div>
        
        
		<div class="f-input--details" v-if="slots.details">
			<slot name="details"> </slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, useSlots, ref } from "vue";
import useClickOutside from "@/composables/useClickOutside"

import Icon from "@/components/icons/IconInfo.vue";
interface Props {
	size?: string;
	info?: string;
	label?: string;
	disabled?: boolean;
	modelValue?: any;
	type?: string;
    readonly?: boolean
}

const slots = useSlots();

const inputWrapper = ref();

const instance = getCurrentInstance();
const name = `f-input-${instance!.uid}`;

const props = withDefaults(defineProps<Props>(), {
	size: "normal",
	disabled: false,
    readonly: false,
	type: "string",
});

useClickOutside(inputWrapper, () => {
    removeFocus();
})

const emit = defineEmits(["update:modelValue"]);

function updateModelValue($event: any) {
	emit("update:modelValue", $event.target.value);
}

const classObject = computed(() => ({
	"f-input--normal": props.size === "normal",
	"f-input--big": props.size === "big",
	"f-input--disabled": props.disabled,
}));

function removeFocus(){
    const target = inputWrapper.value as HTMLElement
    target.classList.remove("f-input__wrapper--focused")
}

function setFocus(event:MouseEvent){
    console.log("setFocus");
    if(props.disabled){
        return
    }
    const target = inputWrapper.value as HTMLElement
    target.classList.add("f-input__wrapper--focused")
}
</script>
<style lang="sass">
.f-input
    display: flex
    flex-direction: column
    .info-icon
        position: static
        @media (min-width: 992px)
            position: relative
    .f-input-label
        display: flex
        align-items: center
        gap: 8px
    .f-input__wrapper
        display: flex
        border: 1px solid black
        border-radius: 12px
        width: 100%
        background-color: #2D2D2D
        &.f-input__wrapper--focused
            box-shadow: 0 0 0 1px black
        input
            border: 0
            border-radius: 12px
            padding: 8px 12px
            width: 100%
            background-color: #2D2D2D
            color: #FFFFFF
            outline: none
            &.f-input--big
                font-size: 18px
            &.f-input--normal
                font-size: 16px
    &.f-input--disabled
        input
            background-color: #202020
            color: #F0F0F0
    .f-input--suffix
        display: flex
        align-items: center
        margin-right: 10px
                
</style>
