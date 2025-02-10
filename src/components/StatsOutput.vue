<template>
	<div class="stats-output" :styles="styles">
		<f-card>
			<h6>{{ props.headline }}</h6>
			<f-output :name="props.name" :price="props.price">
				<template #price>
					<slot name="price"></slot>
				</template>
			</f-output>
		</f-card>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FCard from "@/components/fcomponents/FCard.vue"
import FOutput from "@/components/fcomponents/FOutput.vue"
interface Props {
	name?: string;
	headline: string;
	price: string | number;
	width?: number;
}

interface Styles {
	width?: string;
}

const props = withDefaults(defineProps<Props>(), {});

const styles = computed(() => {
	const returnObject: Styles = {};
	if (props.width) {
		returnObject.width = `${props.width}px`;
	}
	return returnObject;
});
</script>

<style lang="sass">
.stats-output
    .f-card
        background-color: var(--color-secondary)
        h6
            margin: 0
            font-size: 16px
            letter-spacing: 0.15px
            font-weight: 300
        .f-card__body
            display: flex
            flex-direction: column
            gap: 8px
            padding: 8px
            height: 100%
        .token-price-wrapper
            padding: 8px 16px
</style>
