<template>
    <div class="header">
      <div class="header-left">
        <NButton v-if="path.includes('design')" @click="GoBack" style="margin-top: 4px;margin-right: 14px;" circle>
          <template #icon >
            <NIcon>
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
                <path d="M9 11l-4 4l4 4m-4-4h11a4 4 0 0 0 0-8h-1" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </NIcon>
          </template>
        </NButton>
        <!-- <span class="title">My-Resume</span> -->

        <nav>
          <ul>
            <input class="title" v-model="store.resume_name"/>
            <li @click="selectOption(CODE_EDITOR)" :class="{ active: path.includes('code') }">简历制作</li>
            <li @click="selectOption(STYLE_EDITOR)" :class="{ active: path.includes('style') }">样式编辑</li>
            <li @click="selectOption(THEME_EDITOR)" :class="{ active: path.includes('theme') }">主题编辑器</li>
          </ul>
        </nav>
      </div>


      <div v-if="userStore.islogin && store.resume_id != null" class="info">

        <div  v-if="!store.is_saved" style="height: 10px;width: 10px;background-color: orange;border-radius: 15px;margin-right: 10px;"></div>
        <span v-if="!store.is_saved">简历已变更请及时保存</span>
        <div  v-if="store.is_saved" style="height: 10px;width: 10px;background-color: greenyellow; border-radius: 15px;margin-right: 10px;"></div>
        <span v-if="store.is_saved">简历已保存</span>
        <NButton :bordered="false" class="btn" type="primary" @click="store.saveAndSync">保存</NButton>
        <NDropdown :options="exportOptions" @select="handleSelectExportOptions">
          <NButton :bordered="false" class="btn" type="primary">导出</NButton>
        </NDropdown>


        <NButton @click="console.log(store.resume_ast);printSyntaxTree(store.resume_ast)" :bordered="false" class="btn" type="primary">解析markdown</NButton>
      </div>

      <div v-if="!userStore.islogin" class="info">
        <NButton :bordered="false" class="btn" type="primary" @click="userStore.openLoginModal()">登录</NButton>
      </div>
    </div>
</template>

<script setup lang="ts">
import { NButton, NDropdown, NIcon, useMessage } from 'naive-ui';
import { computed, onMounted, ref } from 'vue';
import '@/assets/global.css'
import { useResumeSrcStore } from '@/stores/resume';
import { printSyntaxTree } from '@/markdownparser';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter()
const userStore = useUserStore()
window['$message'] = useMessage()

const HOME_PAGE = "home"
const CODE_EDITOR = "code";
const STYLE_EDITOR = "style";
const THEME_EDITOR = "theme";

const store = useResumeSrcStore()
const activeOption = ref(HOME_PAGE)

const path = computed(()=>{
  return router.currentRoute.value.path
})

onMounted(()=>{
  console.log(path.value);

})

const selectOption = (option: string) => {
  activeOption.value = option
  switch(option){
    case HOME_PAGE:{
      router.push({path:"/home"});
      break;
    }
    case CODE_EDITOR:{
      router.push({path:`/design/${store.resume_id}/code/`});
      break;
    }
    case STYLE_EDITOR:{
      router.push({path:`/design/${store.resume_id}/style/`});
      break;
    }
    case THEME_EDITOR:{
      router.push({path:`/design/${store.resume_id}/theme/`});
      break;
    }
  }
}

const exportOptions = [
  {
    label:"PNG",
    key:'png'
  },{
    label:"MD",
    key:'md'
  },{
    label:"PDF",
    key:'pdf'
  }
]

function handleSelectExportOptions(key:string){
  switch(key){
    case "png":{
      store.toImg();
      break;
    }
    case "md":{
      store.toMd();
      break;
    }
    case "pdf":{
      store.toPdf();
      break;
    }
  }
}

async function GoBack(){

  router.push("/profile")
  await store.saveAndSync()
  store.close()

}

</script>

<style scoped>

.btn {
  background-color: var(--theme-color);
  border: 0 0 0;
}

.btnhide{
  width: 0px;
}

.header {
  height: var(--header-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: var(--box-color);

  color: #fff;
  font-size: large;
  font-weight: bolder;
}

.header-left {
  display: flex;

}

.header-left nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  margin-left: 10px;
  margin-top: 7px;
}

.header-left nav ul li {
  margin-right: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.header-left nav ul li.active {
  color: var(--important-color);
  /* 激活状态的颜色 */
  font-weight: bolder;
}

.header span {
  position: relative;
  left: 0px;
}

.title {
  background-color: #0000;
  color: white;
  border: none;
  width: 160px;

  font-size: large;
  font-weight: bolder;
}

.header .info {
  margin-right: 20px;
  display: flex;
  align-items: center;
  font-size: small;
}

.header .info span {
  margin-right: 20px;
}

.header button {
  margin-left: 10px;
  padding: 5px 10px;
  color: #fff;
  border: none;
  cursor: pointer;
}
</style>
