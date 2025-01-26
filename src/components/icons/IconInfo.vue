<template>
	<div class="info-icon" :onmouseover="(e: any) => showInfoText(e)" :onmouseout="hideInfoText" v-if="slots.text">
		<div class="info-icon-text body2" ref="infoText"><slot name="text"></slot></div>
		<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
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
</template>

<script setup lang="ts">
import { useSlots, ref } from "vue";

const slots = useSlots();

const infoText = ref();
const minWidth = 200

function showInfoText(event: any) {
	// console.log("event", event);
	infoText.value!.style.position = "absolute";
	infoText.value!.style.display = "block";
	const infoBox = infoText.value.getBoundingClientRect();
	infoText.value!.style.top = event.layerY - infoBox.height - 20 + "px";
	if(minWidth + event.layerX > window.innerWidth){
        
    } else {
        infoText.value!.style.left = event.layerX + "px";
    }
    
    
    
}

function hideInfoText() {
	infoText.value!.style.display = "none";
}


</script>

<style lang="sass">
.info-icon
    vertical-align: middle
    display: inline-flex
    position: relative
    .info-icon-text
        z-index: 100
        background-color: black
        height: fit-content
        color: white
        font-size: 12px
        padding: 8px
        border-radius: var(--border-radius)
        max-width: 400px
        position: absolute
        bottom: 0px
        left: 15px
        display: none
        @media (min-width: 992px)
            min-width: 200px

    svg
        path
            fill: var(--color-font)
</style>
