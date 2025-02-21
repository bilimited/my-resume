import globalConfig from "@/globalConfig";
import { defineStore } from "pinia";
import { computed, ref } from "vue";


export const useUserStore = defineStore('user',()=>{

  // 用于强行更新computed
  const __forceUpdate = ref(0)
  const refleshLoginState = () => {
    __forceUpdate.value++
  }

  const islogin = computed(()=>{
    if(globalConfig.OFFLINE){
      return true
    }
    if(__forceUpdate.value<-1){
      return false
    }
    return sessionStorage.getItem('auth') != null
  })

  const nextPathBeforeLogin = ref('/')

  const isLogModelOpen = ref(false)

  const openLoginModal = ()=>{
    console.log("Login.");

    isLogModelOpen.value = true
  }

  return {
    islogin,
    isLogModelOpen,
    nextPathBeforeLogin,
    openLoginModal,
    refleshLoginState
  }

})

