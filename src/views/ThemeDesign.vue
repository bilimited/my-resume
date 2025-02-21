<script setup lang="ts">
import { useResumeStyleStore } from '@/stores/resumr_style';
import { NButton, NCollapse, NCollapseItem, NColorPicker, NDropdown, NInput, NScrollbar, } from 'naive-ui';
import { computed, } from 'vue';

const store = useResumeStyleStore();

const nameOfEle = {
  h1: '一级标题',
  h2: '二级标题',
  h3: '三级标题',
  h4: '四级标题',
  p: '段落',
  b: '粗体',
  i: '斜体',
  u: '下划线',
  // strong: '加粗',
  // em: '强调',
  // mark: '标记',
  // small: '小型',
  // s: '删除线',
  // sub: '下标',
  // sup: '上标',
  // blockquote: '引用',
  ol: '有序列表',
  ul: '无序列表',
  li: '列表项',
  // abbr: '缩写',
  // cite: '引用',
  code: '代码',
  // pre: '预格式化文本',
  hr: '水平线',
  // img: '图像',
  // table: '表格',
  // thead: '表头',
  // tbody: '表体',
  // tfoot: '表尾',
  // th: '表头单元格',
  // tr: '表格行',
  // td: '表格单元格',
  // caption: '表格标题',
  // form: '表单',
  // label: '标签',
  // input: '输入',
  // select: '选择',
  // option: '选项',
  // textarea: '文本区域',
  // button: '按钮',
  // fieldset: '字段集',
  // legend: '图例',
  a: '链接',
  // nav: '导航',
  // section: '区段',
  // article: '文章',
  // aside: '侧边栏',
  // header: '页眉',
  // footer: '页脚',
}

const nameOfProp = {
  width: '宽度',
  height: '高度',
  margin: '外边距',
  padding: '内边距',
  border: '边框',
  borderRadius: '圆角',
  backgroundColor: '背景颜色',
  background: '背景',
  color: '文本颜色',
  "字体": {
    fontSize: '字体大小',
    fontWeight: '字体粗细',
    fontStyle: '字体样式',
  },
  overflow: '溢出处理',
  display: '显示类型',
  position: '定位类型',
  "文本": {
    lineHeight: '行高',
    textAlign: '文本对齐',
    textDecoration: '文本装饰',
    textTransform: '文本转换',
    letterSpacing: '字母间距',
    wordSpacing: '单词间距',
    whiteSpace: '空白符处理',
  },
  "定位": {
    top: '上外边距',
    right: '右外边距',
    bottom: '下外边距',
    left: '左外边距',
  },
  "其他": {
    zIndex: '层叠顺序',
    opacity: '透明度',
    visibility: '可见性',
    cursor: '鼠标指针类型'
  }

}

const colorProp = [
  "color", "backgroundColor"
]

const eleOptions = computed(() => {
  const options = [];
  for (const i in nameOfEle) {
    options.push({
      'label': nameOfEle[i],
      'key': i,
    })
  }
  return options;
})

const propOptions = (props: Record<string, unknown>) => {
  const options = [];
  for (const i in props) {
    if (typeof props[i] === "object") {
      options.push({
        'label': i,
        'key': i,
        'children': propOptions(<Record<string, unknown>>props[i])
      })
    } else {
      options.push({
        'label': props[i],
        'key': i,
      })
    }

  }
  return options;
}

function onSelectEle(ele: string) {
  store.customCSS[ele] = {}
}

function onSelectProp(ele: string, prop: string) {
  store.customCSS[ele][prop] = ""
}

function updateVal(ele: string, label: string, value: string) {
  store.customCSS[ele][label] = value
}

</script>

<template>
  <div style="padding: 25px; height: 100%;">
    <h2 style="margin-bottom: 20px;">
      主题编辑器
    </h2>
    <NCollapse style="margin-bottom: 30px; height: 80%;">
      <NScrollbar>
        <template v-for="sty, i in store.customCSS" :key="i">
          <NCollapseItem :title="nameOfEle[i]">

            <template v-for="v, label in sty" :key="label">
              <template v-if="colorProp.indexOf(label) != -1">
                <label>{{ nameOfProp[label] || label }}</label>
                <NColorPicker v-model:value="v as string" @update:value="updateVal(i, label, v as string)">
                </NColorPicker>
              </template>
              <template v-else>
                <label>{{ nameOfProp[label] || label }}</label>
                <NInput v-model:value="v as string" @update:value="updateVal(i, label, v as string)"> </NInput>
              </template>
            </template>
            <NDropdown size="small" placement="right-end" :options="propOptions(nameOfProp)"
              @select="(prop) => { onSelectProp(i, prop) }">
              <NButton style="margin-top: 20px;">添加属性</NButton>
            </NDropdown>


          </NCollapseItem>
        </template>
      </NScrollbar>

    </NCollapse>

    <NDropdown placement="right" :options="eleOptions" @select="onSelectEle">
      <NButton>添加元素</NButton>
    </NDropdown>

  </div>


</template>

<style></style>
