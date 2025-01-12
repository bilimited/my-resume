<script setup lang="ts">
import { NSplit } from 'naive-ui';
import '../assets/global.css'
import 'vditor/dist/index.css';
import MarkdownEditor from './MarkdownEditor.vue';
import ResumePreview from './ResumePreview.vue';
import { ref } from 'vue';
import type { Resume } from '@/types/resume';
import MarkdownParser from '@/markdownparser';
const resumeMd = ref('')
const resumeData = ref<Resume>({
  header:{
    author:"",
    avatar:"...",
    custom:{
      "姓名":"aaa",
    }
  },
  context:[
  ],
  meta:{
    theme:"...",

  }
})


const on_md_edit = (md:string) => {
  resumeMd.value = md
  console.log("Design: MD -> preview");
  resumeData.value.context = MarkdownParser.parse(md)
}

const on_resume_edit = (data:Resume) => {
  console.log("Design: preview -> MD");
  const md = MarkdownParser.unparse(data)
  resumeMd.value = md
}



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
        <MarkdownEditor :md="resumeMd" v-on:ontextchange="on_md_edit"></MarkdownEditor>
      </div>

    </template>

    <template #2>
      <div class="content-card">
        <ResumePreview :data="resumeData" v-on:onresumechange="on_resume_edit"></ResumePreview>

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
