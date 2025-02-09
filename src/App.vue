<script setup lang="ts">
import AppHeader from './views/AppHeader.vue';
import { darkTheme, NConfigProvider, NModal } from 'naive-ui'
import './assets/global.css'
import { useUserStore } from './stores/user';
import UserLogin from './views/user/UserLogin.vue';

// const themeOverrides = {
//     common: {
//       primaryColor: '#c5347d'
//     }
// }

//const userStore = useUserStore()

</script>

<template>
  <NConfigProvider :theme="darkTheme">
    <UserLogin></UserLogin>
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
