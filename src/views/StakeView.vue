<template>
	<div>
		<div class="container2">
			<stake-holder></stake-holder>
		</div>
		<!-- <f-button @click="getGraphData">graphql test</f-button>
		<div v-for="position in positions" :key="position.id">
			{{ position }}
		</div> -->
	</div>
</template>

<script setup lang="ts">
import StakeHolder from "@/components/StakeHolder.vue";
import { onMounted } from "vue";
// todo interface positions

onMounted(async () => {});
</script>

<style lang="sass">
.stats
    display: flex
    *
        flex: 1 1 50%
.f-card
    &.inner-border
        padding: 0
.hold-inner
    display: flex
    flex-direction: column
    gap: 16px
</style>
