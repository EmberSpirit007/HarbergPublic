<template>
	<svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g clip-path="url(#clip0_2590_499)">
			<path
				ref="svgPath"
				d="M17.058 0.932576L1.74462 6.83727C0.699293 7.25659 0.705631 7.83977 1.55407 8.09947L5.48317 9.32593L6.83449 13.7733C7.01217 14.2637 6.92458 14.4583 7.43975 14.4583C7.83718 14.4583 8.01274 14.2765 8.2346 14.0608L10.1441 12.2041L14.1166 15.1392C14.8477 15.5426 15.3754 15.3336 15.5575 14.4606L18.1654 2.17133C18.4324 1.10065 17.7574 0.615059 17.058 0.932576Z"
				:fill="props.color"
			/>
			<path
				d="M7.45616 13.2757L6.16016 9.01067L16.1361 3.09253L8.76406 10.3509L7.45616 13.2757Z"
				:fill="(props.color === 'black' ? 'white' : 'black')"
			/>
		</g>
		<defs>
			<clipPath id="clip0_2590_499">
				<rect width="18.125" height="14.5" fill="white" transform="translate(0.9375 0.83667)" />
			</clipPath>
		</defs>
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
