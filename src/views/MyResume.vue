<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { ResumeEntity } from './api';
import Service from './api';
import { NButton, NCard, NDivider, NScrollbar, useDialog } from 'naive-ui';
import { useRouter } from 'vue-router';
import { useResumeSrcStore } from '@/stores/resume';

const resumes = ref<ResumeEntity[]>([]);
const store = useResumeSrcStore();
const router = useRouter()
const dialog = useDialog();

onMounted(async ()=>{
  const res:ResumeEntity[] = await Service.getAllResume();
  resumes.value = res;
})

async function onClickAdd(){
  const id = await store.createNew();
  router.push(`/design/${id}/code/`)
}

function onClickEdit(id:number){
  router.push(`/design/${id}/code/`)
}

function onClickDelete(id:number){
  dialog.warning({
    title:"确认删除？",
    content:"此操作不可撤销。",
    positiveText:"确认",
    negativeText:"取消",
    draggable:false,
    onPositiveClick:async ()=>{

      await Service.deleteResume(id);

      const res:ResumeEntity[] = await Service.getAllResume();
      resumes.value = res;
    }
  })
}

</script>

<template>
  <div class="content">
    <div style="display: flex; justify-content: space-between;">
      <h2 >我的简历</h2>
      <NButton type="primary" @click="onClickAdd">新建简历</NButton>
    </div>

    <NDivider></NDivider>
    <NScrollbar>
      <div v-for="r in resumes" :key="r.id">
      <NCard style="margin: 10px;">
        <div style="display: flex; flex-direction: row;">

          <img class="thumbnail" :src="r.thumbnail"/>
          <div style="margin-left: 10px; position: relative;">
            <h2> {{ r.name }} </h2>
            <p style="font-size: smaller;color: gray;"> #{{ r.id }} </p>
            创建日期：{{ r.createTime }}
            <br>
            更改日期：{{ r.updateTime }}
            <div style="display: flex; position: absolute; bottom: 3px;">
              <NButton type="primary" style="margin-right: 20px;" @click="onClickEdit(r.id)">编辑</NButton>
              <NButton @click="onClickDelete(r.id)">删除</NButton>
            </div>

          </div>

        </div>
      </NCard>

    </div>

    </NScrollbar>


  </div>

</template>

<style scoped>

.content {
  margin-top: 15vh;
  margin-left: 25px;
  padding: 30px;

  font-family: 'sans';
  color: white;
}

.content h2 {
  font-weight: 600;
}

.thumbnail {
  background-color: purple;
  width: 160px;
  height: 200px;
  border: none;
}

</style>
