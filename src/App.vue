<template>
	
        <component :is="layoutComponent">
            <router-view />
        </component>
</template>

<script setup lang="ts">
import { RouterView, useRoute, useRouter } from "vue-router";
import type { LayoutName } from '@/types/router';


const layouts = {
  DefaultLayout: defineAsyncComponent(() => import('@/layouts/DefaultLayout.vue')),
  NavbarLayout: defineAsyncComponent(() => import('@/layouts/NavbarLayout.vue')),
};
import { computed, defineAsyncComponent, provide, ref } from "vue";

const route = useRoute();
const router = useRouter();


const layoutComponent = computed(() => {
  const layoutName: LayoutName = route.meta.layout ?? 'DefaultLayout';
  return layouts[layoutName]; // Jetzt kennt TypeScript den Typ!
});

</script>


<style lang="sass">
footer
    margin-top: auto
</style>