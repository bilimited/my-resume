<script setup lang="ts">
import AppHeader from './views/AppHeader.vue';
import './assets/global.css'
//import VueExample from "./views/examples/VueExample.vue"

const themeOverrides = {
    common: {
      primaryColor: '#c5347d'
    }
}


</script>

<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <AppHeader></AppHeader>
    <RouterView class="router-view"></RouterView>

  </NConfigProvider>

</template>

<style scoped>

.router-view {
  width: 100%;
  margin-top: var(--header-height);
  margin-left: auto;
  margin-right: auto;
}


</style>
