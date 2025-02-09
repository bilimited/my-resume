<script setup lang="ts">
import { useResumeSrcStore } from '@/stores/resume';
import hashIt from 'hash-it';
import type { Parent, Root, RootContent } from 'mdast';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useResumeStyleStore } from '@/stores/resumr_style';
import type { TextDirective } from 'mdast-util-directive';

const props = defineProps<
  {
    node:RootContent|Root,
    parent:RootContent|Root|null,
    blocktype:string[]|null
  }
>()

// 包含所有父级元素的type，用于判断
const blockType = computed<string[]>(()=>{
  if(props.blocktype){
    return [...props.blocktype,props.node.type]
  }else{
    return [props.node.type]
  }
})

const store = useResumeSrcStore()
const stylestore = useResumeStyleStore()
const textContent = ref(('value' in props.node)?props.node.value:'')
const content = useTemplateRef('content')

const isMouseOn = ref(false)
const isFocus = ref(false)

const noChild = computed(()=>{
  return !('children' in props.node)
})

const textdirective2Element = (node:Parent&TextDirective) => {
  switch(node.name){
    case 'div':
    case 'flex':{
      return 'div'
    }
    case 'icon':{
      return 'i'
    }
  }
}

const elementType = computed(()=>{
  switch(props.node.type){
    case "heading":{
      if('depth' in props.node){
        return 'h' + props.node.depth
      }else{
        return 'h1'
      }
    }
    case "text":{
      return 'span'
    }
    case "list":{
      if('ordered' in props.node && props.node.ordered){
        return 'ol'
      }else{
        return 'ul'
      }
    }
    case 'listItem':{
      return 'li'
    }
    case 'strong':{
      return 'b'
    }
    case 'paragraph':{
      return 'p'
    }
    case 'code':{
      return 'code'
    }
    case 'inlineCode':{
      return 'code'
    }
    case 'emphasis':{
      return 'i'
    }
    case 'textDirective':{
      return textdirective2Element(props.node)
    }
  }
  return 'div'
})

function getClass() {
  const node = props.node
  const cls:unknown = {
    centered: node.isUnderH1,
    astnode: true,
    nochild: noChild.value
  }
  if(node.type === 'textDirective'){
    cls['tdflex'] = (node.name === 'flex')

    if (node.name === 'icon'){
      cls[node.attributes.id.replace('_',' ')] = true
    }


  }
  return cls
}

// KeyDown 比 Input 有更高的优先级。 如果在keydown里执行了ev.preventDefault()，则input事件不会发出。
function handleKeyDown(event: KeyboardEvent) {
  console.log(event);
  if(event.key === 'Enter') {
    if(props.parent && props.parent.type === 'heading' && props.node.position) {
      event.preventDefault()
      console.log("prevent");

      store.insertLine(props.node.position.start.line,"请在此输入文字...");
      store.saveChange()
    }

  }

  if (event.key === '<' || event.key === '>' || event.key === '&') {
    event.preventDefault(); // 阻止默认行为

    // 获取当前选区
    const selection = window.getSelection();
    if (selection) {
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : document.createRange();

      // 插入原始字符
      range.deleteContents();
      range.insertNode(document.createTextNode(event.key));

      // 移动光标到插入位置之后
      range.setStart(range.endContainer, range.endOffset);
      selection.removeAllRanges();
      selection.addRange(range);

      //saveInnerHtml()
      store.updateNode(props.node,content.value?.innerHTML??'')
    }else{
      console.log("Selection == null...?");

    }

  }
  // 默认行为
}

function textInput(payload:Event){
  if('inputType' in payload){
    // const html = content.value?.innerHTML??''
    // textContent.value = html

    // textContent不会立即更改，以防发生Html转义
    store.updateNode(props.node,content.value?.innerHTML??'')
  }
}

watch(textContent,(val)=>{
  // console.log(val);
  try{

    store.updateNode(props.node,val)
  }catch(e:unknown){
    console.log(props.node);
    console.error(e)
  }

})

function getNodeKey(node:RootContent){
  return hashIt(node)
}

function onFocus(){
  isFocus.value = true
  store.selected_node = props.node
  store.selected_node_blockType = blockType.value
  store.selected_node_parent = props.parent
}

function onBlur(){
  isFocus.value = false
  console.log("Blur.");
  store.saveChange()
}

function onMouseover(){
  isMouseOn.value = true
}


function onMouseleave(){
  isMouseOn.value = false
}

function deleteThis(){
  onFocus()
  store.delCurElement()
}

const isTextElement = computed(()=>props.node.type==='text' || props.node.type==='inlineCode')



</script>

<template>
  <component :is="elementType" :class="getClass()" @mouseover="onMouseover" @mouseleave="onMouseleave">
    <template v-if="'children' in props.node">
      <MdAstNode  v-for="node in props.node.children" :node="node" :parent="props.node"  :key="getNodeKey(node)" :blocktype="blockType"></MdAstNode>
    </template><span ref="content" v-if="isTextElement" @keydown="handleKeyDown" @input="textInput" @blur="onBlur" @focus="onFocus" contenteditable>  {{ textContent }}</span>

    <button @click="deleteThis" class="del-button" v-show="isMouseOn && noChild">
    </button>
  </component>

</template>

<style lang="css" scoped>



.del-button {
  position: absolute;
  width: 15px;
  height: 15px;
  border-radius: 20px;
  top: -10px;
  left: -10px;
  border: none;
  background-color: red;
  transition:all 0.2s;    /* 悬停动画效果 */
}

.del-button::before {
  content: '×';
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 精确居中 */
}


.astnode {
  position: relative;

}


.nochild {
  border: none;
}

.nochild:hover {
  border: 1px solid #84bdff;
  border-radius: 3px;
}

i:hover {
  border: 1px solid;
}

span {
   white-space: pre-wrap;  /* 没有这个会发生可怕的事 */
   color: rgb(61, 61, 61);
   line-height: v-bind("stylestore.lineDistance");
   margin-top: v-bind("stylestore.styles.span.margin_top+'px'");
   margin-bottom: v-bind("stylestore.styles.span.margin_bottom+'px'");
   font-size: v-bind("stylestore.styles.span.font_size+'px'");
   font-weight: v-bind("stylestore.styles.span.font_weight");
   font-family: v-bind("stylestore.styles.span.font");
}

span:not(:focus) {
  border: none;
}

span:focus {
  outline: none;
  border: none;
  /* border: 1px solid #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); */
}

h1 {
  justify-self: v-bind("stylestore.isH1Centered?'center':'start'");
  margin-top: v-bind("stylestore.styles.h1.margin_top+'px'");
  margin-bottom: v-bind("stylestore.styles.h1.margin_bottom+'px'");
}

h1 span{
  font-size: v-bind("stylestore.styles.h1.font_size+'px'");
  font-weight: v-bind("stylestore.styles.h1.font_weight");
  font-family: v-bind("stylestore.styles.h1.font");
}

.centered {
  justify-content: v-bind("stylestore.isH1Centered?'center':'start'");
  justify-self: v-bind("stylestore.isH1Centered?'center':'start'");
}

h2 {
  border-bottom: 2px solid black; /* 下划线的厚度和颜色 */
  padding-bottom: 0; /* 调整下划线的位置 */
  margin-top: v-bind("stylestore.styles.h2.margin_top+'px'");
  margin-bottom: v-bind("stylestore.styles.h2.margin_bottom+'px'"); /* 调整下划线的位置 */
}

h2 span {
  font-size: v-bind("stylestore.styles.h2.font_size+'px'");
  font-weight: v-bind("stylestore.styles.h2.font_weight");
  font-family: v-bind("stylestore.styles.h2.font");
}

h3 {
  border-bottom: 1px solid black; /* 下划线的厚度和颜色 */
  padding-bottom: 0; /* 调整下划线的位置 */
  margin-top: v-bind("stylestore.styles.h3.margin_top+'px'");
  margin-bottom: v-bind("stylestore.styles.h3.margin_bottom+'px'"); /* 调整下划线的位置 */
}

h3 span {
  font-size: v-bind("stylestore.styles.h3.font_size+'px'");
  font-weight: v-bind("stylestore.styles.h3.font_weight");
  font-family: v-bind("stylestore.styles.h3.font");
}

ol{
  margin-top: v-bind("stylestore.styles.ol.margin_top+'px'");
  margin-bottom: v-bind("stylestore.styles.ol.margin_bottom+'px'"); /* 调整下划线的位置 */
}

ol span{
  font-size: v-bind("stylestore.styles.ol.font_size+'px'");
  font-weight: v-bind("stylestore.styles.ol.font_weight");
  font-family: v-bind("stylestore.styles.ol.font");
}

ul{
  margin-top: v-bind("stylestore.styles.ul.margin_top+'px'");
  margin-bottom: v-bind("stylestore.styles.ul.margin_bottom+'px'"); /* 调整下划线的位置 */
}

ul span{
  font-size: v-bind("stylestore.styles.ul.font_size+'px'");
  font-weight: v-bind("stylestore.styles.ul.font_weight");
  font-family: v-bind("stylestore.styles.ul.font");
}

b span{
  font-weight: v-bind("stylestore.styles.b.font_weight");
  font-family: v-bind("stylestore.styles.b.font");
  color: rgb(44, 44, 44);
}

code {
  margin: 5px;
  padding: 1px;
  border-radius: 3px;
  background-color: rgb(237, 249, 254);
}

code span {
  color: rgb(0, 171, 244);
}

.tdflex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 10px;
}



</style>
