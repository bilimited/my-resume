import ComponentsExample from "@/views/examples/ComponentsExample.vue";
import RouterExample from "@/views/examples/RouterExample.vue";
import ResumeDesign from "@/views/ResumeDesign.vue";
//import VueExample from "@/views/examples/VueExample.vue";

export const routes = [
  {
    path: '/', component: ResumeDesign, name:'home'
  },
  {
    // 动态字段以冒号开始
    // 示范： /routerExample/hahaha
    path: '/routerExample/:arg',component:RouterExample, name:'routerExample',
    // 嵌套路由 children的component将被渲染到RouterExample的<RouterView>内
    children:[
      {
        path:'',
        component:ComponentsExample
      },
      {
        // 注意，以 / 开头的嵌套路径将被视为根路径
        path:'children',
        component: RouterExample,
      }
    ]
  }

]
