<script setup lang="ts">
import { watch } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';


  const router = useRouter()  //在选项式API中可通过this.$router访问。
  const route = useRoute()

  const GotoRoot =()=>{
    router.push('/') //router.push直接改变路由，而不是在路由后面追加
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const GotoHere = () => {
    router.push({
      name:'/routerExample', // 如果这里提供的是path，则不能用params
      params: {
        arg: '编程式导航'
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const GoBack = () => {
    router.go(-1) // 返回一条记录，与 router.back() 相同
  }

  // 要对同一个组件中参数的变化做出响应的话，可以简单地 watch $route 对象上的任意属性
  watch(()=>route.params.arg,(newArg,oldArg)=>{
    console.log(newArg,oldArg)
  })

  // 导航守卫：在导航之前执行
  onBeforeRouteUpdate(async (to,from)=>{
    console.log(to,from);

  })
</script>

<template>
  <h1>This is RouterExample.vue.</h1>
  Cur route: {{ route.fullPath }}, param:{{ $route.params.arg }} <br>
  <br>
  <RouterView></RouterView>
  <br>
  <RouterLink to="/">Go back</RouterLink><br>
  <RouterLink to="/RouterExample/what/children">AddChildren</RouterLink><br>
  <RouterLink :to="{name:'routerExample', params:{
    arg:'命名路由的使用'
  }}">使用命名路由</RouterLink>
  <button @click="GotoRoot">Also Go Back</button><br>
</template>
