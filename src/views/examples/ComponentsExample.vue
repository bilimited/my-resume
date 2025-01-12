<script setup lang="ts">

// prop命名应该用camelCase模式，而在向子组件传递时应该用kebab-case模式
const props = defineProps({myProp:String})

// $emit不能在<script setup>中使用，但defineEmit会返回一个相同作用的函数
const emit = defineEmits(['myevent']) // 定义事件，事件可以向上抛给父组件

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const btnclick = () =>{
  emit('myevent')
}



</script>

<template>
  <div>

    <h1>Props Example</h1>
    The Prop is: {{ props.myProp }}
    <br>
    <!-- <slot>:父组件传递进来的内容会渲染在这里 -->
    The content is: <slot/>
    <br>
    <button @click="$emit('myevent')">Click to emit event</button>
  </div>

</template>
