<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { NButton, NForm, NFormItem, NInput, NModal, type FormRules } from 'naive-ui';
import { ref, useTemplateRef } from 'vue';

const userStore = useUserStore()

type Mode = "login"|"registry"

interface ModelLogin {
  phone:string
  password:string
}

interface ModelRegistry{
  phone:string
  username:string
  reenteredPassword:string
  password:string
}

const modelLogin = ref<ModelLogin>({
  phone:null,
  password:null,
})

const ModelRegistry = ref<ModelRegistry>({
  phone:null,
  password:null,
  reenteredPassword:null,
  username:null
})

const loginRule:FormRules = {
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度需在6-16位之间', trigger: 'blur' }
  ]
}

const registryRule:FormRules = {
  ...loginRule,
  username:[
    {required:true,message:"请输入用户名", trigger: 'blur'}
  ],
  reenteredPassword:[
    {required:true,message:"请确认密码",trigger:'blur',},
    {
      validator(rule,value){
        return ModelRegistry.value.password === value
      },
      message: '两次密码输入不一致',
      trigger:'input'
    }
  ]
}

const mode = ref<Mode>("login")

const formRef = useTemplateRef('formRef')
const formRegistryRef = useTemplateRef('formRegRef')

function onClickLoginButton(){
  if(mode.value != 'login'){
    mode.value = 'login'
  }else{
    formRef.value.validate((err)=>{
      if(!err){
        console.log("SUCCESS");

      }else{
        console.log("FAIL");

      }
    })
  }
}

function onClickRegistryButton(){
  if(mode.value != 'registry'){
    mode.value = 'registry'
  }else{
    formRegistryRef.value.validate((err)=>{
      if(!err){
        console.log("SUCCESS");

      }else{
        console.log("FAIL");

      }
    })
  }
}

</script>

<template>
  <NModal  v-model:show="userStore.isLogModelOpen">
  <div class="login">
    <h1 v-if="mode=='login'">
      请先登录
    </h1>
    <h1 v-if="mode=='registry'">
      注册
    </h1>
    <NForm v-if="mode=='login'" style="text-align: start;" ref="formRef" :rules="loginRule" :model="modelLogin">
      <NFormItem label="电话号码" path="phone">
        <NInput v-model:value="modelLogin.phone" type="text" placeholder="电话号码" />
      </NFormItem>
      <NFormItem label="密码" path="password">
        <NInput v-model:value="modelLogin.password" type="password" placeholder="密码"/>
      </NFormItem>
    </NForm>

    <NForm v-if="mode=='registry'" style="text-align: start;" ref="formRegRef" :rules="registryRule" :model="ModelRegistry">
      <NFormItem label="昵称" path="username">
        <NInput v-model:value="ModelRegistry.username" type="text" placeholder="昵称" />
      </NFormItem>

      <NFormItem label="电话号码" path="phone">
        <NInput v-model:value="ModelRegistry.phone" type="text" placeholder="电话号码" />
      </NFormItem>
      <NFormItem label="密码" path="password">
        <NInput v-model:value="ModelRegistry.password" type="password" placeholder="密码"/>
      </NFormItem>
      <NFormItem label="确认密码" path="reenteredPassword" >
        <NInput
        :disabled="!ModelRegistry.password"
        v-model:value="ModelRegistry.reenteredPassword"
        type="password"
        placeholder="确认密码"
        />
      </NFormItem>
    </NForm>

    <div v-if="mode=='login'" class="btns">
      <NButton type="primary" @click="onClickLoginButton">登录</NButton>
      <NButton @click="onClickRegistryButton">去注册</NButton>
    </div>

    <div v-if="mode=='registry'" class="btns">
      <NButton @click="onClickLoginButton">去登录</NButton>
      <NButton type="primary" @click="onClickRegistryButton">注册</NButton>
    </div>

  </div>
  </NModal>

</template>

<style scoped>

.login{
  width: 400px;
  text-align: center;
  background-color: var(--box-color);
  border-radius: 25px;
  box-shadow: 0 25px 25px #0005;
  padding: 35px;

}

.login h1{
  font-family: 'sans';
  font-weight: bold;
  color: white;
}

.btns {
  padding-left: 30%;
  padding-right: 30%;
  display: flex;
  justify-content: space-between;
}



</style>
