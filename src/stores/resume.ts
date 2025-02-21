import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Heading, Root, Text } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'

import {directive} from 'micromark-extension-directive'
import {directiveFromMarkdown} from 'mdast-util-directive'

import type { RootContent } from 'mdast'
import { insertString, replaceString } from '@/utils/str'
import Service, { type UpdateResumeDto, type UploadResumeDto } from '@/views/api'
import { useResumeStyleStore } from './resumr_style'

import { ImgTool } from '@/utils/imageTool'

interface SelectionOffset {
  start:number,
  end:number
}

export interface ResumeMetaData {
  author:string
  photoid:number
  photox:number
  photoy:number
  photow:number
  photoh:number
}

export const useResumeSrcStore = defineStore('resumesrc', () => {

  const resumesrc = ref(``);

  const is_saved = ref(false);
  // 简历是否保存

  // Editor专用的数据源。当updateNode执行时，新数据首先同步到resumesrc_for_editor，按下enter/失去焦点时才会同步到resumesrc，以防止输入任何字符导致失焦。
  const resumesrc_for_editor = ref(resumesrc.value)
  const resume_id = ref<number|null>(null)
  const resume_name = ref<string|null>(null)
  const metadata = ref<ResumeMetaData>({
    author:"",
    photoid:673,
    photox:10,
    photoy:10,
    photow:0,
    photoh:0
  })
  const style = useResumeStyleStore();
  const scalesize = ref(1);

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

  async function saveAndSync(){

    saveChange();

    const thumbnail = await getThumbnail()

    const resume:UpdateResumeDto = {
      content:resumesrc_for_editor.value,
      theme: style.getStyleJson(),
      thumbnail,
      name:resume_name.value,
    }
    console.log(resume);

    if(resume_id.value === null){
      await Service.uploadResume(resume)
    }else{
      await Service.updateResume(resume)
    }

  }

  // 从云端获得简历。
  function download(id:number){
    Service.getResumeById(id,(res)=>{
      console.log("Resume from Server:",res);

      resume_id.value = id;
      resumesrc.value = res.content;
      resume_name.value = res.name;
      resumesrc_for_editor.value = res.content;
      is_saved.value = true
      // TODO: 同步Style等
      style.loadStyleJson(res.theme);
    });
  }

  // 在本地创建新简历。
  async function createNew(useTheme = null,useContent = null){
    close();
    resumesrc_for_editor.value = useContent ?? "";
    style.customCSS = useTheme ?? "";
    const thumbnail = await getThumbnail()
    // 此处使用useContent和useTheme初始化
    const emptyResume:UploadResumeDto = {
      content:resumesrc_for_editor.value,
      theme: style.getStyleJson(),
      thumbnail,
    }

    // 本地初始化


    // 远端初始化
    const id = await Service.uploadResume(emptyResume)


    saveChange()

    return id;
  }

  // 关闭当前简历。
  function close(){
    resume_id.value = null;
    saveChange()
  }

  watch(resumesrc_for_editor,()=>{
    is_saved.value = false;
  })

  async function toImg(){
    const s = scalesize.value;
    (await new ImgTool(1/s).load()).download(resume_name.value)
  }

  async function getThumbnail(){
    const s = scalesize.value;
    return (await new ImgTool(1/s).loadThumbNail()).data;
  }

  async function toPdf(){
    (await new ImgTool(1/scalesize.value).load()).downloadAsPdf(resume_name.value);
  }

  function toMd(){
    const url = window.URL;
    const blob = new Blob([resumesrc_for_editor.value]);
    const saveLink = document.createElement('a');
    saveLink.href = url.createObjectURL(blob);
    // 设置 download 属性
    saveLink.download = `${resume_name.value}.md`;
    saveLink.click();
  }

  // Init

  // if(last_edit_resume_id.value != null){
  //   console.log(last_edit_resume_id.value);

  //   download(last_edit_resume_id.value);
  // }

  return {
    resume_name,
    resumesrc,
    resumesrc_for_editor,
    resume_ast,
    selected_node,
    selected_node_blockType,
    selected_node_parent,
    last_selection: last_selected_offset,
    resume_id,
    is_saved,
    scalesize,
    metadata,

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

    saveAndSync,
    sync: download,
    createNew,
    close,
    toImg,
    toPdf,
    toMd,
    getThumbnail,
  }

})
