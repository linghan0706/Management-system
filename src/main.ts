import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// UI框架
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'

// 图标
import ArcoVueIcon from '@arco-design/web-vue/es/icon'

// 自定义样式
import './assets/styles/index.scss'

// Mock数据
import './mock'

const app = createApp(App)

app.use(ArcoVue)
app.use(ArcoVueIcon)
app.use(router)
app.use(store)

app.mount('#app')
