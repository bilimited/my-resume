<script setup lang="ts">
import AppHeader from './views/headers/AppHeader.vue';
import { darkTheme, NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui'
import './assets/global.css'
import UserLogin from './views/login/UserLogin.vue';
import { onUnmounted } from 'vue';

// const themeOverrides = {
//     common: {
//       primaryColor: '#c5347d'
//     }
// }

//const userStore = useUserStore()

onUnmounted(() => {
  console.log("寄了！");

})

</script>

<template>
  <NConfigProvider :theme="darkTheme">
    <NDialogProvider>
      <NMessageProvider>
        <UserLogin></UserLogin>
        <AppHeader></AppHeader>
        <RouterView class="router-view"></RouterView>
      </NMessageProvider>
    </NDialogProvider>
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
