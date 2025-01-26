<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		width="20px"
		height="18px"
		viewBox="0 0 19 18"
		version="1.1"
	>
		<g id="surface1">
			<path
				ref="svgPath"
				d="M 14.945312 0 L 17.859375 0 L 11.464844 7.636719 L 18.9375 18 L 13.070312 18 L 8.480469 11.703125 L 3.222656 18 L 0.308594 18 L 7.085938 9.832031 L -0.0703125 0 L 5.941406 0 L 10.089844 5.753906 Z M 13.925781 16.207031 L 15.542969 16.207031 L 5.09375 1.726562 L 3.355469 1.726562 Z M 13.925781 16.207031 "
				:fill="props.color"
			/>
		</g>
	</svg>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";

const svgPath = ref();

interface Props {
	color?: string;
}

const props = withDefaults(defineProps<Props>(), {});

</script>
