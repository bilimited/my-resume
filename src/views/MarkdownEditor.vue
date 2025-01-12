<script setup lang="ts">

import { onMounted, reactive, ref, watch } from 'vue';
import { NTooltip } from 'naive-ui';

import type { Editor, EditorConfiguration,  } from "codemirror";
import Codemirror from "codemirror-editor-vue3";

// 引入css文件
import 'codemirror/lib/codemirror.css'
// placeholder
import "codemirror/addon/display/placeholder.js";

// 引入语言模式 可以从 codemirror/mode/ 下引入多个
import "codemirror/mode/markdown/markdown.js";
// import "codemirror/mode/go/go.js";
// placeholder
import "codemirror/addon/display/placeholder.js";
// 引入主题 可以从 codemirror/theme/ 下引入多个
import '@/assets/editor.css'


const cmOptions: EditorConfiguration = reactive({
  mode: "text/markdown",
  theme: "monokai", // Theme
  readOnly: false,
  // lineNumbers: true,
  // lineWiseCopyCut: true,
  // gutters: ["CodeMirror-lint-markers"],
  // lint: true,
})

const onReady = (cm: Editor) => {
  cm.refresh()
};

const formData = ref(`# h1
## h2
### h3
- daw
- 221
\`dwadwa\`
  `)

const props = defineProps<{
  md:string
}>()

const emit = defineEmits(['ontextchange'])


watch(() => props.md, (val) => {
  console.log("Editor: Prop changed");

  formData.value = val
})

watch(formData,(val)=>{
  emit("ontextchange",val)
})


onMounted(() => {
  emit('ontextchange',formData.value)
})

</script>

<template>
  <div>
    <div class="top-buttons">
      <NTooltip trigger="hover" style="background-color: white;color: black;">
        <template #trigger>
          <button id="bold">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
              <path
                d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79c0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79c0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"
                fill="currentColor"></path>
            </svg>
          </button>
        </template>
        加粗
      </NTooltip>

      <NTooltip trigger="hover" style="background-color: white;color: black;">
        <template #trigger>
          <button id="it">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
              <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" fill="currentColor"></path>
            </svg>
          </button>
        </template>
        斜体
      </NTooltip>

      <NTooltip trigger="hover" style="background-color: white;color: black;">
        <template #trigger>
          <button id="formatlist">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
              <path
                d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5s1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5S5.5 6.83 5.5 6S4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5s1.5-.68 1.5-1.5s-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"
                fill="currentColor"></path>
            </svg>
          </button>
        </template>
        无序列表
      </NTooltip>

      <NTooltip trigger="hover" style="background-color: white;color: black;">
        <template #trigger>
          <button id="numberedlist">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
              <path
                d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"
                fill="currentColor"></path>
            </svg>
          </button>
        </template>
        有序列表
      </NTooltip>

      <NTooltip trigger="hover" style="background-color: white;color: black;">
        <template #trigger>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
              <path
                d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
                fill="currentColor"></path>
            </svg>
          </button>
        </template>
        插入链接
      </NTooltip>

      <NTooltip trigger="hover" style="background-color: white;color: black;">
        <template #trigger>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
              <path
                d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14L6 17h12l-3.86-5.14z"
                fill="currentColor"></path>
            </svg>
          </button>
        </template>
        插入图片
      </NTooltip>
      <NTooltip trigger="hover" style="background-color: white;color: black;">
        <template #trigger>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
              <circle cx="15.5" cy="9.5" r="1.5" fill="currentColor"></circle>
              <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor"></circle>
              <path d="M12 18c2.28 0 4.22-1.66 5-4H7c.78 2.34 2.72 4 5 4z" fill="currentColor"></path>
              <path
                d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8z"
                fill="currentColor"></path>
            </svg>
          </button>
        </template>
        插入表情
      </NTooltip>
      <NTooltip trigger="hover" style="background-color: white;color: black;">
        <template #trigger>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 15l3 3l3-3"></path>
                <path d="M7 6v12"></path>
                <path d="M17 3a2 2 0 0 1 2 2v3a2 2 0 1 1-4 0V5a2 2 0 0 1 2-2z"></path>
                <circle cx="17" cy="16" r="2"></circle>
                <path d="M19 16v3a2 2 0 0 1-2 2h-1.5"></path>
              </g>
            </svg>
          </button>
        </template>
        开/关行号
      </NTooltip>
    </div>
    <Codemirror v-model:value="formData" :options="cmOptions" border placeholder="# h1" @ready="onReady"
      :height="500" style="border: 0px;" />
  </div>

</template>

<style lang="css" scoped>
.top-buttons {
  padding-top: 10px;
  padding-left: 30px;
  display: flex;
}

.top-buttons button {
  height: 30px;
  width: 30px;
  padding-top: 5px;
  color: white;
  background-color: #e6e6e600;
  border: #0000;
  border-radius: 5px;
}

.top-buttons button:hover {
  background-color: #ffffff36;
}

.ntooltip {
  background-color: white;
  color: #000;
}

.text-editor {
  display: flex;
  flex-direction: column;
}
</style>
