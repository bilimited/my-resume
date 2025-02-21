<template>
  <div class="app-header">
    <DesignHeader v-if="store.resume_id != null"></DesignHeader>
    <div class="header" v-else>
        <div class="header-left">
          <nav>
          <ul>
            <li @click="router.push('/')" >My-Resume</li>
            <li @click="router.push('/profile')"  :class="{ active: path.includes('profile') }">我的简历</li>
            <li :class="{ active: false }">不知道放啥</li>
          </ul>
        </nav>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResumeSrcStore } from '@/stores/resume';
import DesignHeader from './DesignHeader.vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const store = useResumeSrcStore()
const router = useRouter()

const path = computed(()=>{
  return router.currentRoute.value.path
})

</script>

<style scoped>
.app-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

}

.header {
  height: var(--header-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: var(--box-color);

  color: #fff;
  font-size: large;
  font-weight: bolder;
}

.header-left {
  display: flex;

}

.header-left nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  margin-left: 10px;
  margin-top: 7px;
}

.header-left nav ul li {
  margin-right: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.header-left nav ul li.active {
  color: var(--important-color);
  /* 激活状态的颜色 */
  font-weight: bolder;
}

.header span {
  position: relative;
  left: 0px;
}

</style>
