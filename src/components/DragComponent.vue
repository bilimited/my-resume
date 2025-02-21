<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';

const props = defineProps<{
  x:number,
  y:number,
}>()

const emits = defineEmits<{
  (e:'onmove',x:number, y:number):void
}>()

const _x = ref(props.x);
const _y = ref(props.y);

const startX = ref(0);
const startY = ref(0);
const initialX = ref(0);
const initialY = ref(0);

const div = useTemplateRef("container")



onMounted(()=>{
  div.value.addEventListener('mousedown',startDrag);
})

function startDrag(e:MouseEvent) {
  e.preventDefault()
  // 记录初始位置
  startX.value = e.clientX
  startY.value = e.clientY
  // this.initialX = item.x
  // this.initialY = item.y
  initialX.value = _x.value;
  initialY.value = _y.value;

  // 添加事件监听
  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDrag)
}

function drag(e:MouseEvent){

  const dx = e.clientX - startX.value;
  const dy = e.clientY - startY.value;

  _x.value = initialX.value + dx;
  _y.value = initialY.value + dy;

  emits('onmove',_x.value,_y.value);
}

function stopDrag(){
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)
}

</script>

<template>
  <div  :style="{
      position: 'absolute',
      top:0,
      left:0,
      transform: `translate(${_x}px, ${_y}px)`
    }"  ref="container">
  <slot/>

  </div>
</template>

<style scoped>

</style>
