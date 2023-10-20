<script setup>
import { defineAsyncComponent } from 'vue';
import TapApp from './tap/TapApp.vue';
//import DesktopApp from './desktop/DesktopApp.vue';

const DesktopApp = defineAsyncComponent(
  () => import('./desktop/DesktopApp.vue')
);

console.log(window.outerWidth);
const appVariant = window.outerWidth > 1000 ? 'desktop' : 'tap';
</script>

<template>
  <TapApp v-if="appVariant === 'tap'" />
  <Suspense>
    <DesktopApp v-if="appVariant === 'desktop'" />
  </Suspense>
</template>