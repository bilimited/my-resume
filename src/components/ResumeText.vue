
<script setup lang="ts">
import type { ResumeItem } from '@/types/resume';
import { marked } from 'marked';
import { ref, watch } from 'vue';

  const props = defineProps<{
    item:ResumeItem,
    isfocus:boolean
  }>()
  defineEmits(['onchange','onfocus'])

  watch(props.item,(val)=>{
    console.log("resumetext.content changed");

    content.value = val.content
    id.value = val.id
  })


  const content = ref(props.item.content);
  const id = ref(props.item.id)

  // function handleBlur(){
  //   currectComponent.value = 'div';
  // }

  // function handleClick(){
  //   currectComponent.value = 'input';
  // }
</script>

<template>
  <!-- eslint-disable vue/no-v-text-v-html-on-component -->

  <!-- <component
    :is="currectComponent"
    v-model="content"
    v-html="marked(content)"
    @blur="handleBlur"
    @click="handleClick"
    @input="$emit('onchange', content)"
  /> -->
  <div v-if="!props.isfocus" v-html="marked(content)" @click="$emit('onfocus')">

  </div>
  <input v-if="props.isfocus" v-model="content" @input="$emit('onchange', content,id)"/>


</template>

<style lang="css" scoped>
  input {
    margin-left: 0px;
  }
</style>
