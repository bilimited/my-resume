import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// import 'highlight.js/styles/stackoverflow-dark.css'
// import hljs from 'highlight.js'
// import hljsVuePlugin from "@highlightjs/vue-plugin";
// import 'highlight.js/lib/common';

import App from './App.vue'
import router from './router'

import VueDragResize from 'vue-drag-resize'

declare module 'mdast' {
  interface Node {
    isUnderH1?:boolean,
    blockType?:keyof RootContentMap[]
  }
}


const app = createApp(App)

app.component('vue-drag-resize', VueDragResize)

app.use(createPinia())
app.use(router)

app.mount('#app')
