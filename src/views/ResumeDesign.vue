<script setup lang="ts">
import { NSplit } from 'naive-ui';
import '../assets/global.css'
import 'vditor/dist/index.css';
//import MarkdownEditor from './MarkdownEditor.vue';
import ResumePreview from './ResumePreview.vue';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useResumeSrcStore } from '@/stores/resume';

const route = useRoute();
const store = useResumeSrcStore()
onMounted(()=>{
    store.sync(Number(route.params.id))
})

</script>

<template>
  <div style="width: 100%;">
    <NSplit style="
    /** 非常逆天 但是显示效果完美 */
    height: calc(100vh - var(--header-height) - 20px);
    margin: 0 auto;
    " :resize-trigger-size="3">
    <template #1>
      <div class="content-card">
        <RouterView></RouterView>
        <!-- <MarkdownEditor></MarkdownEditor> -->
      </div>

    </template>

    <template #2>
      <div class="content-card">
        <ResumePreview></ResumePreview>

      </div>

    </template>

    <!-- 中间那个杆杆 -->
    <template #resize-trigger>
      <div
        :style="{
          height: '100%',
          backgroundColor: 'var(--theme-color)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '8px',
        }"
      >
      </div>

    </template>
  </NSplit>
  </div>


</template>

<style scoped>

.content-card {
  position: relative;
  margin: 10px;
  height: 100%;
  background-color: var(--box-color);
  border-radius: 5px;
}

.md-editor {
  height: 100%;
  color: aliceblue;
}

</style>
