<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { NModal, NScrollbar,NTooltip } from 'naive-ui';
import { ref } from 'vue';
import { useResumeSrcStore } from '@/stores/resume';
import MdAstNode from '@/components/MdAstNode.vue';
import type { RootContent } from 'mdast';
import IconPicker from '@/components/IconPicker.vue';


// const focusItemId = ref('0')
const store = useResumeSrcStore()

const insertHeaderLevel = ref(1)

const showIconPicker = ref(false)
const onPickGlyph = (glyph)=>{
  console.log("Picked",glyph);
  store.insertIcon(glyph)
  showIconPicker.value = false
}

const onClickIconPicker = ()=>{
  store.last_selection = store.getSelectionOffset()
  console.log(store.last_selection);

  showIconPicker.value = true
}

const scalesize = ref(1)

const scalestep = 0.15

const scaleUp = ()=>{
  console.log("scale:",scalesize.value);

  scalesize.value += scalestep
}

const scaleDown = ()=>{
  console.log("scale:",scalesize.value);
  if(scalesize.value-scalestep<0){
    return
  }
  scalesize.value -= scalestep
}

</script>

<template>
    <NModal v-model:show="showIconPicker">
      <IconPicker @onselect="onPickGlyph"></IconPicker>
    </NModal>

    <div class="scale-buttons">
      <button @click="scaleUp">+</button>
      <button @click="scaleDown">-</button>
    </div>

    <div class="top-buttons">
      <NTooltip trigger="hover" placement="bottom">
        <template #trigger>
          <button id="header" @click="()=>{store.insertHeader(insertHeaderLevel)}">

            <svg v-if="insertHeaderLevel == 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 18v-8l-2 2"></path><path d="M4 6v12"></path><path d="M12 6v12"></path><path d="M11 18h2"></path><path d="M3 18h2"></path><path d="M4 12h8"></path><path d="M3 6h2"></path><path d="M11 6h2"></path></g></svg>
            <svg v-if="insertHeaderLevel == 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 12a2 2 0 1 1 4 0c0 .591-.417 1.318-.816 1.858L17 18.001h4"></path><path d="M4 6v12"></path><path d="M12 6v12"></path><path d="M11 18h2"></path><path d="M3 18h2"></path><path d="M4 12h8"></path><path d="M3 6h2"></path><path d="M11 6h2"></path></g></svg>
            <svg v-if="insertHeaderLevel == 3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14a2 2 0 1 0-2-2"></path><path d="M17 16a2 2 0 1 0 2-2"></path><path d="M4 6v12"></path><path d="M12 6v12"></path><path d="M11 18h2"></path><path d="M3 18h2"></path><path d="M4 12h8"></path><path d="M3 6h2"></path><path d="M11 6h2"></path></g></svg>
            <svg v-if="insertHeaderLevel == 4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 18v-8l-4 6h5"></path><path d="M4 6v12"></path><path d="M12 6v12"></path><path d="M11 18h2"></path><path d="M3 18h2"></path><path d="M4 12h8"></path><path d="M3 6h2"></path><path d="M11 6h2"></path></g></svg>
          </button>
        </template>
        <button @click="insertHeaderLevel = 1" class="tooltipbutton"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 18v-8l-2 2"></path><path d="M4 6v12"></path><path d="M12 6v12"></path><path d="M11 18h2"></path><path d="M3 18h2"></path><path d="M4 12h8"></path><path d="M3 6h2"></path><path d="M11 6h2"></path></g></svg></button>
        <button @click="insertHeaderLevel = 2" class="tooltipbutton"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 12a2 2 0 1 1 4 0c0 .591-.417 1.318-.816 1.858L17 18.001h4"></path><path d="M4 6v12"></path><path d="M12 6v12"></path><path d="M11 18h2"></path><path d="M3 18h2"></path><path d="M4 12h8"></path><path d="M3 6h2"></path><path d="M11 6h2"></path></g></svg></button>
        <button @click="insertHeaderLevel = 3" class="tooltipbutton"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14a2 2 0 1 0-2-2"></path><path d="M17 16a2 2 0 1 0 2-2"></path><path d="M4 6v12"></path><path d="M12 6v12"></path><path d="M11 18h2"></path><path d="M3 18h2"></path><path d="M4 12h8"></path><path d="M3 6h2"></path><path d="M11 6h2"></path></g></svg></button>
        <button @click="insertHeaderLevel = 4" class="tooltipbutton"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 18v-8l-4 6h5"></path><path d="M4 6v12"></path><path d="M12 6v12"></path><path d="M11 18h2"></path><path d="M3 18h2"></path><path d="M4 12h8"></path><path d="M3 6h2"></path><path d="M11 6h2"></path></g></svg></button>
      </NTooltip>

      <NTooltip trigger="hover" style="background-color: white;color: black;">
        <template #trigger>
          <button id="bold" @click="store.boldSelection">
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
          <button id="it" @click="store.itSelection">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
              <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" fill="currentColor"></path>
            </svg>
          </button>
        </template>
        斜体
      </NTooltip>

      <NTooltip trigger="hover" style="background-color: white;color: black;">
        <template #trigger>
          <button id="formatlist" @click="store.insertUnorderedList">
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
          <button id="numberedlist" @click="store.insertOrderedList">
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
          <button @click="onClickIconPicker">
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
        插入图标
      </NTooltip>
      <NTooltip trigger="hover" style="background-color: white;color: black;">
        <template #trigger>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M20 3H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h4v2h8v-2h4c1.1 0 2-.9 2-2V5a2 2 0 0 0-2-2zm0 14H4V5h16v12z" fill="currentColor"></path><path d="M6 8.25h8v1.5H6zm10.5 1.5H18v-1.5h-1.5V7H15v4h1.5zm-6.5 2.5h8v1.5h-8zM7.5 15H9v-4H7.5v1.25H6v1.5h1.5z" fill="currentColor"></path></svg>
          </button>
        </template>
        样式设置
      </NTooltip>
  </div>
  <NScrollbar>
    <div class="resume">
      <MdAstNode :node="store.resume_ast" :parent="null" :blocktype="[]"></MdAstNode>
    </div>

    <!-- <VuePapers :margin-between="2" :padding-top="2" :padding-bottom="2" >
      <MdAstNode :node="<ExtendedRootContent><unknown>store.resume_ast" :parent="null"></MdAstNode>
    </VuePapers> -->
  </NScrollbar>


</template>

<style lang="css" scoped>

.scale-buttons {
  position: absolute;
  display: flex;
  flex-direction: column;

  right: 30px;
  top: 30px;
}

.scale-buttons button {
  margin-bottom: 10px;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  border: none;
  background-color: var(--brighter-box-color);
  color: white;
  font-size: large;
  box-shadow: -0px 2px 18px #00000065;
  z-index: 10;
}

.resume{
  font-size: 13px;
  font-family: 'sans' sans-serif;

  width: 710px;
  aspect-ratio: 21/29.7;
  background-color: white;
  color: rgb(24, 24, 24);
  justify-self: center;
  margin-top: 50px;
  margin-bottom: 50px;
  padding: 30px;

  transform: scale(v-bind("scalesize"));
  transition: transform 0.2s;
}

.top-buttons {
  top:15px;
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  width: min-content;
  background-color: var(--brighter-box-color);
  border-radius: 8px;
  box-shadow: -0px 2px 18px #00000065;
  z-index: 10;

  justify-self: center;
  justify-content: center;
  padding: 4px 10px 4px 10px;
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

.tooltipbutton {
  height: 30px;
  width: 30px;
  padding-top: 5px;
  color: white;
  background-color: #e6e6e600;
  border: #0000;
  border-radius: 5px;
}

.tooltipbutton:hover {
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
