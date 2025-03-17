<template>
	<div class="f-tabs" ref="tabsRef">
		<div class="f-tabs__header" ref="headerRef">
			<div
				class="f-tab"
				ref="tabsRef1"
				:id="`f-tab-${tab.uid}`"
				v-for="tab in tabs"
				:key="tab.uid"
				@click="setActive(tab)"
			>
				<h5>{{ tab.label }}</h5>
			</div>
		</div>
		<div class="f-tabs__content">
			<slot ref="tabsTest"></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, h, computed, useSlots, provide, getCurrentInstance } from "vue";
defineOptions({
	inheritAttrs: false,
});
const props = defineProps({
	modelValue: {
		type: String,
		required: false,
		default: null,
	},
});

const emit = defineEmits(["update:modelValue"]);

const slots1 = useSlots();

const tabsRef = ref<HTMLElement>();
const tabsRef1 = ref<HTMLElement>();
const headerRef = ref<HTMLElement>();
const tabsArray = ref<Array<HTMLElement>>();
const tabsComponents = ref<Array<any>>();
const content = ref<any>();
const target = ref<any>();
const slots = ref<any>();
const value = ref<any>();
const tabsTest = ref<any>();
const tabs = ref<Array<any>>([]);
provide("value", value);
provide("addTab", (tab: any) => {
	tabs.value.push(tab);
});

provide("updateTab", (tab: any) => {
	let changedTabIndex = tabs.value.findIndex((obj) => obj.uid === tab.uid);
	if (changedTabIndex > -1) {
		tabs.value[changedTabIndex] = tab;
	}
});
// provide('addTab', tabs.value)

onMounted(() => {
	nextTick(() => {
        if(props.modelValue){
            const tab = tabs.value.find((obj) => obj.name === props.modelValue)
            setActive(tab);

        } else {
            setActive(tabs.value[0]);
        }
	});
});

function setActive(tab: any) {

	nextTick(() => {
		const tabElement: any = headerRef.value?.querySelector(`#f-tab-${tab.uid}`);
		var array = Array.prototype.slice.call(tabsRef.value?.children[0].children);

		array.forEach((element: HTMLElement) => {
			element.classList.remove("f-tab--active");
		});
		tabElement.classList.add("f-tab--active");
		value.value = tab.name;
		emit("update:modelValue", tab.name);
	});
}
</script>

<style lang="sass">
.f-tabs
    display: flex
    flex-direction: column
    width: 100%
    .f-tabs__header
        display: flex
        .f-tab, label
            cursor: pointer
        .f-tab
            padding: 0.6em 1em
            transition: background-color .2s,color .2s
            align-items: center
            justify-content: center
            font-weight: 400
            text-transform: uppercase
            font-size: 24px
            font-weight: bold
            border-width: 0 0 2px 0
            border-style: solid
            border-color: transparent
            flex: 1 1 auto
            text-align: center
            height: 50px
            border-bottom: 2px solid var(--color-light-grey)
            h5
                color: var(--color-tab-font)
                margin: 0
            &.f-tab--active
                border-bottom: 3px solid var(--color-tab-border--active)
                h5
                    color: var(--color-tab-border--active)
    .f-tabs__content
        padding: 16px 12px
        @media (min-width: 768px)
            padding: 16px 24px
</style>
