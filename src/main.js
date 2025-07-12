import { createApp } from 'vue'
import App from '@/App.vue'

import '@/permission'
import router from '@/router'
import store from '@/store'
import TDesign from 'tdesign-vue-next'

import '@/style.css'
import '@/theme.css'
import 'tdesign-vue-next/es/style/index.css'
import 'virtual:windi.css'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(TDesign)
app.mount('#app')
