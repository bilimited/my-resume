<script setup lang="ts">
import { NScrollbar } from 'naive-ui';
import type { Resume } from '@/types/resume';
import ResumeText from '@/components/ResumeText.vue';
import { ref, watch } from 'vue';

const props = defineProps<{
  data:Resume
}>()

watch(props.data,(val)=>{
  console.log("Preview.prop changed");
  // data.value发生了改变
  data.value  = val

})

const data = ref<Resume>(props.data)
const focusItemId = ref('0')

const emit = defineEmits<
  {(e:'onresumechange',data:Resume):void}
>()

// input输入字符时触发
function on_item_change(content:string,id:string){

  for(const i in data.value.context){
    if (data.value.context[i].id === id){
      data.value.context[i].content = content
      //data.value.context[i] = { ...newitem }
    }
  }
  console.log('preview.emit -> design');

  emit('onresumechange',data.value)
}

</script>

<template>
  <NScrollbar>
    <div class="resume">
      <!-- key发生变化时item才会更新 -->
      <div v-for="item in data.context" :key="item.content">
        <ResumeText
        :item="item"
        :isfocus="focusItemId === item.id"
        @onchange="on_item_change"
        @onfocus="(()=>{focusItemId = item.id})()"
        />


      </div>
    </div>

  </NScrollbar>

</template>

<style lang="css" scoped>
.resume{
  width: 600px;
  aspect-ratio: 21/29.7;
  background-color: white;
  color: black;
  justify-self: center;
  margin-top: 50px;
  margin-bottom: 50px;
  padding: 30px;
}
</style>
