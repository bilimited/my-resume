import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// import 'highlight.js/styles/stackoverflow-dark.css'
// import hljs from 'highlight.js'
// import hljsVuePlugin from "@highlightjs/vue-plugin";
// import 'highlight.js/lib/common';

import App from './App.vue'
import router from './router'

// hljs.registerLanguage('md',markdown)
// hljs.registerLanguage('js',javascript)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
