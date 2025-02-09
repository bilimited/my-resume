<script setup lang="ts">
import { ref, computed } from 'vue'
import fontLibrary from './data/fonts'
import { NInput, NPagination } from 'naive-ui';

const iconPerPage = 12;
const curPage = ref(1)


defineEmits<{
  (e: 'onselect',glyph:string): void
}>()

//const filterText = ref("")
//const activeGlyph = ref("")
const allGlyphs = [].concat(
  fontLibrary.fontAwesome.variants.regular.icons,
  fontLibrary.fontAwesome.variants.solid.icons,
  fontLibrary.fontAwesome.variants.brands.icons
)

const filter = ref<string>("")

const allFilteredGlyphs = ref(allGlyphs.filter((v:string)=>{
    return v.toLowerCase().indexOf(filter.value.toLowerCase()) != -1
  }))

const glyphCount = computed<number>(()=>{
  return allFilteredGlyphs.value.length
})

// 获取当前一页显示的glyphs
const glyphs = computed<string[]>(() => {
  return allFilteredGlyphs.value.slice((curPage.value-1) * iconPerPage, (curPage.value) * iconPerPage)
})

const onInput = ()=>{
  allFilteredGlyphs.value = allGlyphs.filter((v:string)=>{
    return v.toLowerCase().indexOf(filter.value.toLowerCase()) != -1
  })
  curPage.value = 1
}



// const setActiveGlyph = glyph => {
//   activeGlyph.value = glyph
// }


const getGlyphName = glyph => glyph.replace(/f.. fa-/g, '').replace('-', ' ')



</script>

<template>
  <div class="icon-picker">
    <NInput style="margin-left: 20px;margin-top: 20px ; width: 80%;" placeholder="搜索" v-model:value="filter" @input="onInput">

    </NInput>
    <div class="glyph-container">
      <div v-for="glyph in glyphs" :key="glyph" @click="$emit('onselect',glyph)" class="glyph-button">
        <i :class="glyph.replace('far', 'fas') + ' fa-2x'" style="margin-top: 25px;color:#EEE;">
          <div class="icon-item-name">
            {{ getGlyphName(glyph) }}
          </div>
        </i>
      </div>

    </div>

    <div style="justify-self: center;margin-top: 20px;">
      <NPagination v-model:page="curPage" :page-count="Math.floor(glyphCount / iconPerPage)"></NPagination>
    </div>
  </div>




</template>

<style scoped>
.icon-picker {
  position: relative;
  background-color: rgb(51, 51, 51);
  border-radius: 15px;
  width: 500px;
  padding-bottom: 20px;
}

.glyph-container {
  display: flex;
  flex-wrap: wrap;
  width: 500px;


}

.glyph-button {
  text-align: center;
  width: 100px;
  height: 80px;

  margin: 10px;
}

.glyph-button:hover {
  text-align: center;
  width: 100px;
  height: 80px;
  background-color: rgba(92, 92, 92, 0.295);
  border-radius: 15px;
  margin: 10px;
}

.icon-item-name {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 13px;
  margin-top: 10px;
}
</style>
