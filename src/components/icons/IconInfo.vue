<template>
	<tippy v-if="slots.text" theme="my-theme">
		<div class="info-icon">
			<svg :width="props.size" :height="props.size" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M6.2 6.26416C6.2 5.84995 6.53579 5.51416 6.95 5.51416C7.36421 5.51416 7.7 5.84995 7.7 6.26416V9.76416C7.7 10.1784 7.36421 10.5142 6.95 10.5142C6.53579 10.5142 6.2 10.1784 6.2 9.76416V6.26416Z"
				/>
				<path
					d="M7 3.01416C7.55228 3.01416 8 3.46188 8 4.01416C8 4.56644 7.55228 5.01416 7 5.01416C6.44772 5.01416 6 4.56644 6 4.01416C6 3.46188 6.44772 3.01416 7 3.01416Z"
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M14 7.01416C14 10.8802 10.866 14.0142 7 14.0142C3.13401 14.0142 0 10.8802 0 7.01416C0 3.14817 3.13401 0.0141602 7 0.0141602C10.866 0.0141602 14 3.14817 14 7.01416ZM1.5 7.01416C1.5 10.0517 3.96243 12.5142 7 12.5142C10.0376 12.5142 12.5 10.0517 12.5 7.01416C12.5 3.97659 10.0376 1.51416 7 1.51416C3.96243 1.51416 1.5 3.97659 1.5 7.01416Z"
				/>
			</svg>
		</div>
        <template #content>
			<slot name="text"></slot>

        </template>
	</tippy>
</template>

<script setup lang="ts">
import { useSlots, ref, onMounted } from "vue";
import { Tippy } from "vue-tippy";
import "tippy.js/dist/tippy.css"; // optional for styling
const slots = useSlots();

interface Props {
	size?: string;
}


const props = withDefaults(defineProps<Props>(), {
	size: "15px",
});

</script>

<style lang="sass">
.info-icon
    vertical-align: middle
    display: inline-flex
    position: relative
    svg
        path
            fill: var(--color-font)
.tippy-arrow
    color: rgba(15, 15, 15, 0.9) !important
.tippy-box[data-theme~='my-theme'] 
    background-color: rgba(15, 15, 15, 0.9) 
    height: fit-content
    color: white
    font-size: 12px
    max-width: 200px !important
    border-radius: var(--border-radius)
    // @media (min-width: 768px)
    //     max-width: 400px

</style>
