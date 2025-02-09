import { defineStore } from "pinia";
import { computed, ref } from "vue";


export const useUserStore = defineStore('user',()=>{

  const islogin = computed(()=>{
    return false
  })

  const isLogModelOpen = ref(false)

  const openLoginModal = ()=>{
    console.log("Login.");

    isLogModelOpen.value = true
  }

  return {
    islogin,
    isLogModelOpen,
    openLoginModal
  }

})

