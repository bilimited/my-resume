import { createRouter, createWebHistory } from 'vue-router'
//import { routes } from './example_routes'
import ResumeDesign from "@/views/ResumeDesign.vue";
import MarkdownEditor from '@/views/MarkdownEditor.vue';
import StyleDesign from '@/views/StyleDesign.vue';
import Vue3IconPicker from '@/components/IconPicker.vue';
import HomePage from '../views/HomePage.vue';
import { useUserStore } from '@/stores/user';

const router = createRouter({

  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      {
        path: '/', component: HomePage, name:'home'
      },
      {
        path: '/home', component: HomePage
      },
      {
        path:"/design", component: ResumeDesign, name:'design',
        children:[
          {
            path:'', redirect: 'design/code'
          },
          {
            path:"code",component: MarkdownEditor, name: 'code',
          },
          {
            path:"style",component: StyleDesign, name: 'style',
          }
        ]
      },
      {
        path:"/test", component:Vue3IconPicker , name:"test",
      }
  ],
})

const whitelist = [
  '/',
  '/home'
]

router.beforeEach((to,from,next)=>{

  const store = useUserStore()
  console.log("?",to.path);
  if(whitelist.indexOf(to.path)!=-1){
    next()
  }
  else if(to.path == '/login' || (!store.islogin && whitelist.indexOf(to.path) == -1)){
    store.openLoginModal()
    next({
      path:from.path
    })
  }else if(store.islogin){
    next()
  }
})

export default router
