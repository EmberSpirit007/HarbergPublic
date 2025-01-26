<template>
	<section v-show="value === props.name" ref="tab" role="tabpanel" tabindex="-1">
		<slot></slot>
	</section>
</template>

<script setup lang="ts">
import { onMounted, onBeforeMount, getCurrentInstance, ref, computed, watch, inject } from "vue";
const instance = ref<any>();

const isActive = ref<any>(null);

const value = inject("value");
var updateTab: any = inject("updateTab");

defineExpose({
	isActive,
});

onBeforeMount(() => {});
onMounted(() => {
	instance.value = getCurrentInstance();

	var addTab: any = inject("addTab");
	addTab({
		uid: instance.value!.uid,
		name: props.name,
		label: props.label,
	});

	// resolved = {"test123": 123, "blub": "abc"}
});

// const test = computed(() => {
//     console.log(instance.value);

//     return instance.value?.parent
// })

//Props
const props = defineProps({
	label: {
		type: String,
		required: true,
		default: null,
	},
	name: {
		type: [String],
		required: true,
		default: null,
	},
});

watch(props, (newValue, oldValue) => {
	console.log("newValue", newValue);
	console.log("instance", instance.value);

	updateTab({
		uid: instance.value!.uid,
		name: props.name,
		label: props.label,
	});
});
</script>
