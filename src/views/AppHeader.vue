<template>
  <div class="app-header">
    <div class="header">
      <div class="header-left">
        <NButton style="margin-top: 4px;margin-right: 14px;" circle>

          <template #icon>
            <NIcon>
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
                <path d="M9 11l-4 4l4 4m-4-4h11a4 4 0 0 0 0-8h-1" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </NIcon>
          </template>

        </NButton>
        <span class="title">My-Resume</span>

        <nav>
          <ul>
            <li @click="selectOption('import')" :class="{ active: activeOption === 'import' }">导入文件</li>
            <li @click="selectOption('template')" :class="{ active: activeOption === 'template' }">简历模板</li>
            <li @click="selectOption('tutorials')" :class="{ active: activeOption === 'tutorials' }">使用教程</li>
            <li @click="selectOption('guide')" :class="{ active: activeOption === 'guide' }">开启引导</li>
            <li @click="selectOption('idPhoto')" :class="{ active: activeOption === 'idPhoto' }">证件照制作</li>
          </ul>
        </nav>
      </div>


      <div class="info">
        <span>简历已变更请及时保存</span>
        <span>累计导出 {{ 233 }} 份</span>
        <NButton :bordered="false" class="btn" type="primary">保存</NButton>
        <NButton :bordered="false" class="btn" type="primary">导出</NButton>
        <NButton :bordered="false" class="btn" type="primary">备用导出</NButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui';
import { ref } from 'vue';
import '../assets/global.css'


const activeOption = ref("import")

const selectOption = (option: string) => {
  activeOption.value = option
}
</script>

<style scoped>

.btn {
  background-color: var(--theme-color);
  border: 0 0 0;
}

.app-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

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
  margin-left: 40px;
  margin-top: 7px;
}

.header-left nav ul li {
  margin-right: 20px;
  cursor: pointer;
  font-weight: bold;

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
  font-size: x-large;
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
