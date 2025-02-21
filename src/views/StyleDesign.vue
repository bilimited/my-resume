<script setup lang="ts">
import { useResumeStyleStore } from '@/stores/resumr_style';
import { NInputNumber, NScrollbar, NSelect, NSlider, NSwitch } from 'naive-ui';
import { ref, watch } from 'vue';

const store = useResumeStyleStore();
type StyleKeys = keyof typeof store.styles;
const allfont = ref('');

watch(allfont,(val)=>{
  for(const i in store.styles){
    store.styles[i as StyleKeys].font = val
  }
})
</script>

<template>
  <div style="display: flex;">

    <!-- <NAnchor class="anchor" style="color: aliceblue;" show-rail>
      <NAnchorLink title="基础设置" href="#basic"></NAnchorLink>
      <NAnchorLink title="边距及字号" href="#margin-font-size"></NAnchorLink>
      <NAnchorLink title="调整字重" href="#adjust-weight"></NAnchorLink>
      <NAnchorLink title="调整颜色" href="#adjust-color"></NAnchorLink>
      <NAnchorLink title="CSS自定义" href="#custom-css"></NAnchorLink>
    </NAnchor> -->

    <div class="main">
      <NScrollbar>
        <div>
          <div id="basic"></div>
          <h2>基础设置</h2>
          <div class="basic-setting">
            <p>一级标题居中</p>
            <NSwitch v-model:value="store.isH1Centered"> </NSwitch>
          </div>

          <div class="basic-setting">
            <p>行距</p>
            <NSlider v-model:value="store.lineDistance" :step="0.01" :default-value="1" :max="3" :min="0.5"></NSlider>
            <!-- <NInputNumber  size="small"><template #suffix>px</template></NInputNumber> -->
          </div>



          <div id="margin-font-size"></div>
          <h2>调整边距及字号</h2>
          <div style="column-count: 4; margin-bottom: 8px;">
            <p>元素名称</p>
            <p>上边距</p>
            <p>下边距</p>
            <p>字号</p>
          </div>
          <div v-for="(ele, idx) of store.styles" :key="idx" style="column-count: 4; margin-bottom: 8px;">
            <span>{{ ele.name }}</span>
            <NInputNumber v-model:value="ele.margin_top" size="small"> <template #suffix>px</template></NInputNumber>
            <NInputNumber v-model:value="ele.margin_bottom" size="small"> <template #suffix>px</template></NInputNumber>
            <NInputNumber v-model:value="ele.font_size" size="small"> <template #suffix>px</template></NInputNumber>
          </div>

          <div id="adjust-weight"></div>
          <h2>调整字重及字体</h2>
          <div style="column-count: 2; margin-bottom: 8px;">
            <span>一键设置所有字体</span>
            <NSelect v-model:value="allfont" :options="store.fontOptions" size="small"> </NSelect>
          </div>


          <div style="column-count: 3; margin-bottom: 8px;">
            <p>元素名称</p>
            <p>字重</p>
            <p>字体</p>
          </div>
          <div v-for="(ele, idx) of store.styles" :key="idx" style="column-count: 3; margin-bottom: 8px;">
            <span>{{ ele.name }}</span>
            <NInputNumber v-model:value="ele.font_weight" size="small" max="800" min="300"> </NInputNumber>
            <NSelect v-model:value="ele.font" :options="store.fontOptions" size="small"> </NSelect>
          </div>
        </div>

      </NScrollbar>
    </div>

  </div>

</template>

<style scoped>
.main {
  color: white;
  margin: 30px;
  height: 80vh;
}

.basic-setting {
  column-count: 2;
  margin-right: 0px;
  margin-bottom: 10px;
}

h2 {
  margin-bottom: 10px;
  font-size: large;
  font-weight: 800;
}


p {
  font-weight: 600;
}
</style>
