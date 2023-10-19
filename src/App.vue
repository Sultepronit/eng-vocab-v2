<script setup>
import TapApp from './tap/TapApp.vue';
import DesktopApp from './desktop/DesktopApp.vue';
console.log(window.outerWidth);
const appVariant = window.outerWidth > 1000 ? 'desktop' : 'tap';
</script>

<template>
  <TapApp v-if="appVariant === 'tap'" />
  <DesktopApp v-if="appVariant === 'desktop'" />
</template>