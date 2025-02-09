import { defineStore } from "pinia";
import { ref } from "vue";

type SupportedElements = "h1"|"h2"|"h3"|"span"|"ol"|"ul"|"b"

interface ElementStyle {
  name:string,
  margin_top:number
  margin_bottom:number
  font_size:number
  font_weight:number
  font:string[]|string
  // color
  // underline?:boolean
}

export const useResumeStyleStore = defineStore('resume-store',()=>{

  const styles = ref<Record<SupportedElements,ElementStyle>>({
    h1:{
      name:"一级标题",
      margin_top:0,
      margin_bottom:0,
      font_size:25,
      font_weight:400,
      font:"sans"
    },
    h2:{
      name:"二级标题",
      margin_top:0,
      margin_bottom:3,
      font_size:14,
      font_weight:700,
      font:"sans"
    },
    h3:{
      name:"三级标题",
      margin_top:0,
      margin_bottom:0,
      font_size:13,
      font_weight:500,
      font:"sans"
    },
    span:{
      name:"正文",
      margin_top:0,
      margin_bottom:0,
      font_size:13,
      font_weight:400,
      font:"sans"
    },
    ol:{
      name:"有序列表",
      margin_top:0,
      margin_bottom:0,
      font_size:13,
      font_weight:400,
      font:"sans"
    },
    ul:{
      name:"无序列表",
      margin_top:0,
      margin_bottom:0,
      font_size:13,
      font_weight:400,
      font:"sans"
    },
    b:{
      name:"粗体",
      margin_top:0,
      margin_bottom:0,
      font_size:13,
      font_weight:700,
      font:"sans"
    }
  })

  const fontOptions = ref([
    {
      label:"思源黑体",
      value:"sans"
    },
    {
      label:"微软雅黑",
      value:"Microsoft YaHei"
    },
    {
      label:"楷体",
      value:"KaiTi",
    },
    {
      label:"consolas",
      value:"consolas"
    }
  ])

  const isH1Centered = ref(true)
  const themeColor = ref("")
  const lineDistance = ref(1.5)
  const customCSS = ref("")

  const page = ref({
    margin_left_right: 0,
    margin_top_down:0
  })

  return {
    styles,
    isH1Centered,
    themeColor,
    page,
    lineDistance,
    customCSS,
    fontOptions
  }

})
