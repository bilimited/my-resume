import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Heading, Root, Text } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'

import {directive} from 'micromark-extension-directive'
import {directiveFromMarkdown} from 'mdast-util-directive'

import type { RootContent } from 'mdast'
import { insertString, replaceString } from '@/utils/str'

interface SelectionOffset {
  start:number,
  end:number
}

export const useResumeSrcStore = defineStore('resumesrc', () => {

  const resumesrc = ref(`# 赵笑阳  全栈开发工程师
:icon{#far_fa-user}男 / 2003-11-17         :icon{#far_fa-envelope}1793678790@qq.com         :icon{#fab_fa-github}github.com/bilimited
:icon{#far_fa-address-book}16692229056            :icon{#fab_fa-git}gitee.com/bilimited

## :icon{#far_fa-user-circle} 教育背景

:flex[**河南大学 - 计算机与信息工程学院 - 计算机科学与技术** :div **2021-09-01 至 2025-07-01**]:flex[GPA: 4.0 / 专业TopN]

## :icon{#fab_fa-react}专业技能
- 编程语言：熟练掌握Java、Python、JavaScript、TypeScript，具备扎实的数据结构与算法基础，熟悉数组、链表、图、栈、队列及其相关算法。

- 后端开发：精通JavaEE技术栈，熟练使用Spring、SpringMVC、MyBatis、SpringBoot等框架，具备良好的后端开发能力。

- 前端开发：熟练掌握Vue框架，深入理解ES6和TypeScript类型机制，熟悉HTML5、CSS3等前端技术，能够独立完成前端页面开发。

- 设计模式与架构：深入理解常见设计模式（如观察者模式、单例模式等），了解软件开发的常用架构模式。

- 数据库：熟悉MySQL事务、锁、索引等机制，了解Redis及其持久化机制，具备数据库优化经验。

- 工具与系统：熟练使用Git进行版本控制，掌握Postman进行接口调试，熟悉Linux操作系统及常用命令。

- 计算机基础：熟悉计算机网络五层模型、计算机组成原理、操作系统等基础知识，深入理解HTTP、HTTPS、TCP、UDP等网络协议。

## :icon{#far_fa-star}奖项荣誉
- 中国大学生计算机设计大赛 - 全国三等奖（2023）

- 全国大学生智能技术应用大赛 - 全国二等奖（2023）

- 睿抗机器人开发者大赛 - 全国二等奖（2023）

- “挑战杯”中国大学生创业计划大赛 - 省级二等奖（2024）

- 中国国际大学生创新大赛（互联网+）- 省级一等奖（2024）

- 全国三维数字化创新设计大赛 - 全国三等奖（2024）

## :icon{#fab_fa-product-hunt}项目经历
**开源 - Web端简历制作工具**
技术栈：\`Vue\` \`Pinia\` \`Node.js\`
- 项目简介：开发了一款基于Web的简历制作工具，支持Markdown和所见即所得两种编辑模式，用户可将Markdown文本转换为PDF，或直接在预览界面实时编辑，数据实时同步。

- 项目难点：手动实现Markdown解析器，将Markdown语法解析为Vue组件，扩展了Markdown语法，提升了编辑器的用户体验。

**学校 - 前后端分离选课系统**\`全栈开发\`
技术栈：\`Vue\` \`SpringBoot\` \`MySQL\` \`Redis\`
- 项目简介：设计并开发了一套前后端分离的选课系统，支持用户登录注册、学生选课、教师课程管理等功能。

- 项目难点：使用JWT令牌技术实现用户认证，结合拦截器进行Token校验，利用Redis管理Token，解决了HTTP请求无状态的问题。

- 项目职责：担任项目组长，负责核心代码编写、接口文档撰写及团队协作，使用Git进行版本控制，并通过Apifox和Mock.js进行接口调试。

**学校 - 天气可视化系统**
技术栈：\`Python\` \`mayavi\` \`pandas\` \`numpy\` \`scipy\`
- 项目简介：基于Python开发的气象数据可视化系统，支持读取气象数据、插值处理、生成灰度图并自动输出视频，实现了局部地区气温和降水的动态可视化。
`)
  // Editor专用的数据源。当updateNode执行时，新数据首先同步到resumesrc_for_editor，按下enter/失去焦点时才会同步到resumesrc，以防止输入任何字符导致失焦。
  const resumesrc_for_editor = ref(resumesrc.value)

  // 获取语法树
  const resume_ast = computed(() =>{
    const AST = fromMarkdown(resumesrc.value,{
      extensions: [directive()],
      mdastExtensions: [directiveFromMarkdown()]
    })
    let isUnderH1 = false

    // 对语法树后处理
    for(const i of AST.children){
      if(i.type === 'heading'){
        if((<Heading>i).depth === 1){
          isUnderH1 = true
        }else{
          isUnderH1 = false
        }
      }else{
        (<RootContent>i).isUnderH1 = isUnderH1
      }
    }

    return AST
  } )

  // 当前鼠标指针位于的node
  const selected_node = ref<RootContent|Root|null>(null)
  // 当前鼠标指针元素到根节点的所有type
  const selected_node_blockType = ref<string[]>([])
  // 当前鼠标指向节点的父节点  史山，无需多言
  const selected_node_parent = ref<RootContent|Root|null>(null)

  const last_selected_offset = ref<SelectionOffset>(null)

  /**
   * 本方法用一种克苏鲁的方式实现了取消加粗/斜体，其他功能不要调用此方法！
   * @param offsetL 要删除的字符的偏移量
   */
  const cancelSelection = (offsetL = 0, offsetR = 0)=>{
    if(selected_node.value && selected_node.value.position){
      const raw = resumesrc_for_editor.value;
      let start = selected_node.value.position.start.offset;
      let end =   selected_node.value.position.end.offset;
      const text = raw.slice(start,end)
      if(start && end){

        start = start + offsetL;
        end = end + offsetR;
        resumesrc_for_editor.value = replaceString(raw,text,start,end);
      }

      saveChange()
    }
  }

  function updateNode(node: RootContent|Root, newText: string) {

    if (node.type === 'text' || node.type === 'inlineCode') {
      node = <Text>node;
      // 文本转义
      newText = newText.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')

      // 替换指定区域文本
      const offsetStart = node.position?.start.offset
      const offsetEnd = node.position?.end.offset
      const rawText = resumesrc.value

      if (offsetStart !== undefined && offsetEnd !== undefined) {

        const start = rawText.slice(0, offsetStart)
        const end = rawText.slice(offsetEnd)
        const result = start + newText + end


        resumesrc_for_editor.value = result

      } else {
        throw new Error('Invalid offset');
      }
    } else {
      console.error("Error:发生更改的AST节点不是TEXT")
    }
  }

  // 同步resumesrc和resumesrc_for_editor
  function saveChange() {
    resumesrc.value = resumesrc_for_editor.value
  }

  function insertLine(line:number,content:string = ''){
    const rawText = resumesrc.value
    const lines = rawText.split('\n')
    if (line < 0 || line > lines.length) {
      throw new Error('Invalid line number')
    }
    lines.splice(line, 0, content)
    resumesrc_for_editor.value = lines.join('\n')

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function insertTextAtSelection(s:string){
    const offset = getSelectionOffset();
    if(offset){
      console.log(offset);

      let text = resumesrc_for_editor.value;
      text = insertString(text,s,offset.start)
      resumesrc_for_editor.value = text
      saveChange()
    }
    resetSelection()
  }

  // 在缓存的选区插入文本。用来解决失焦问题
  function insertTextAtLastSelection(s:string){
    const offset = last_selected_offset.value;
    if(offset){
      console.log(offset);

      let text = resumesrc_for_editor.value;
      text = insertString(text,s,offset.start)
      resumesrc_for_editor.value = text
      saveChange()
    }
    resetSelection()
  }

  function getSelectionOffset(){
    const selection = window.getSelection()
    if(selection && selected_node.value && selected_node.value.position && selected_node.value.position.start.offset && selected_node.value.position.end.offset){
      const start = selection.anchorOffset>selection.focusOffset?selection.focusOffset:selection.anchorOffset;
      const end   = selection.anchorOffset<selection.focusOffset?selection.focusOffset:selection.anchorOffset;

      return {
        'start':selected_node.value.position.start.offset + start,
        'end':  selected_node.value.position.start.offset   + end
      }
    }
    return null
  }

  function resetSelection(){
    selected_node.value = null;
    selected_node_blockType.value = [];
    selected_node_parent.value = null
  }

  function boldSelection(){
    if(selected_node_blockType.value.includes('strong')){
      cancelSelection(-2,2);
    }else{
      const offset = getSelectionOffset();
      if(offset){
        let text = resumesrc_for_editor.value;
        text = insertString(text,'**',offset.start)
        text = insertString(text,'**',offset.end+2)
        resumesrc_for_editor.value = text
        saveChange()
      }
    }
    resetSelection()
  }

  function itSelection(){
    if(selected_node_blockType.value.includes('emphasis')){
      cancelSelection(-1,1)
    }else{
      const offset = getSelectionOffset();
      if(offset){
        let text = resumesrc_for_editor.value;
        text = insertString(text,'*',offset.start)
        text = insertString(text,'*',offset.end+1)
        resumesrc_for_editor.value = text
        saveChange()
      }
    }
    resetSelection()
  }

  function insertUnorderedList(){
    if(selected_node.value && selected_node.value.position){
      insertLine(selected_node.value.position.start.line,'- 请在此输入内容...')
      saveChange()
    }
  }

  function insertOrderedList(){
    if(selected_node.value && selected_node.value.position){
      insertLine(selected_node.value.position.start.line,'1. 请在此输入内容...')
      saveChange()
    }
  }

  function insertHeader(level:number){
    if(selected_node.value && selected_node.value.position){
      let h = ''
      for(let i = 0;i<level;i++){
        h+='#'
      }
      insertLine(selected_node.value.position.start.line,h+' 输入标题')
      saveChange()
    }
  }

  function insertIcon(glyph:string){
    insertTextAtLastSelection(`:icon{#${glyph.replace(' ','_')}}`)
  }

  function delCurElement(){
    const start = selected_node.value.position.start.offset;
    const end = selected_node.value.position.end.offset;
    if(start && end){
      let text = resumesrc_for_editor.value;
      text = text.slice(0,start) + text.slice(end,text.length)
      resumesrc_for_editor.value = text;
      saveChange()
    }
    selected_node.value = null
    selected_node_blockType.value = null
    selected_node_parent.value = null
  }

  return {
    resumesrc,
    resumesrc_for_editor,
    resume_ast,
    selected_node,
    selected_node_blockType,
    selected_node_parent,
    last_selection: last_selected_offset,
    getSelectionOffset,
    saveChange,
    updateNode,
    insertLine,
    boldSelection,
    itSelection,
    insertUnorderedList,
    insertOrderedList,
    insertHeader,
    insertIcon,
    delCurElement,
  }

})
