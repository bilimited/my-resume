<script setup lang="ts">

import { reactive, ref } from 'vue';

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
import { useResumeSrcStore } from '@/stores/resume';


const cmOptions: EditorConfiguration = reactive({
  mode: "text/markdown",
  theme: "monokai", // Theme
  readOnly: false,
  scrollbarStyle: 'null',
  lineWrapping: true
})

const onReady = (cm: Editor) => {
  cm.refresh()
};

const isFocus = ref(false)


// 仅应当在操作来自Editor时执行。
const onChange = () => {
  if(isFocus.value){
    store.resumesrc = store.resumesrc_for_editor
  }


}

const onFocus = () => {
  isFocus.value = true
}

const onBlur = () => {
  isFocus.value = false
}


const store = useResumeSrcStore()

</script>

<template>
  <div style="height: 100%;">

      <Codemirror v-model:value="store.resumesrc_for_editor" :options="cmOptions" border placeholder="# h1" @ready="onReady"
      height="100%" style="border: 0px;" v-on:change = "onChange" v-on:focus="onFocus" v-on:blur="onBlur"/>


  </div>

</template>

<style lang="css" scoped>

</style>
