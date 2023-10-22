<script setup>
console.timeLog('tt', 'app setup!');
import TapApp from './tap/TapApp.vue';
import DesktopApp from './desktop/DesktopApp.vue';

const appVariant = window.outerWidth > 1000 ? 'desktop' : 'tap';
</script>

<template>
  <TapApp v-if="appVariant === 'tap'" />
  <DesktopApp v-if="appVariant === 'desktop'" />
</template>