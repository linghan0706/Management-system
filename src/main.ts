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

// 检查是否在Netlify环境
const isNetlify = window.location.hostname.includes('netlify.app')

// 如果是Netlify环境，设置默认的访客信息
if (isNetlify && !localStorage.getItem('token')) {
  localStorage.setItem('token', 'visitor-token')
  localStorage.setItem('userInfo', JSON.stringify({
    name: '访客',
    avatar: '',
    roles: ['visitor']
  }))
}

const app = createApp(App)

app.use(ArcoVue)
app.use(ArcoVueIcon)
app.use(router)
app.use(store)

app.mount('#app')
