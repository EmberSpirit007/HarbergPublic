<template>
	
        <component :is="layoutComponent">
            <router-view />
        </component>
</template>

<script setup lang="ts">
import { RouterView, useRoute, useRouter } from "vue-router";
import type { LayoutName } from '@/types/router';


import DefaultLayout from '@/layouts/DefaultLayout.vue';
import NavbarLayout from '@/layouts/NavbarLayout.vue';

const layouts = {
  DefaultLayout,
  NavbarLayout
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