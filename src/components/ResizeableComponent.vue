<script setup lang="ts">
import { ref, useTemplateRef, onMounted } from 'vue';

// TODO: 像素尺寸转换为scale

const startX = ref(0);
const initialX = ref(0);

const div = useTemplateRef("handle")
const rootdiv = useTemplateRef("rootdiv")


onMounted(()=>{
  div.value.addEventListener('mousedown',startDrag);
})

function startDrag(e:MouseEvent) {
  e.preventDefault()
  // 记录初始位置
  startX.value = e.clientX
  initialX.value = e.clientX
}


</script>

<template>
  <div ref="rootdiv" style="position: relative;">
    <div>
      <slot/>
    </div>

    <div class="handle" ref="handle">

    </div>
  </div>

</template>

<style scoped>

.handle{
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background-color: aqua;
}

</style>
