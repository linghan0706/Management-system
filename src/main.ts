import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// UI框架
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'

// 图标
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import { IconTeam, IconApartment } from './components/icons'

// 自定义样式
import './assets/styles/index.scss'

// Mock数据
import './mock'

console.log('应用初始化开始...')

// 检测是否在Netlify环境中
const isNetlify = window.location.hostname.includes('netlify.app')
console.log('是否Netlify环境:', isNetlify)

// 如果是Netlify环境，设置默认访客身份
if (isNetlify && !localStorage.getItem('token')) {
  console.log('在Netlify环境中设置访客身份')
  localStorage.setItem('token', 'visitor-token')
  localStorage.setItem('userInfo', JSON.stringify({
    name: '访客',
    avatar: '',
    roles: ['visitor']
  }))
}

// 添加全局错误处理
window.onerror = function(message, source, lineno, colno, error) {
  console.error('全局错误:', { message, source, lineno, colno, error })
  return false
}

// 避免初始化过程中的路由错误
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM加载完成')
})

console.log('创建Vue应用实例')
const app = createApp(App)

console.log('注册全局组件和插件')
app.use(ArcoVue)
app.use(ArcoVueIcon)
app.use(router)
app.use(store)

// 注册自定义图标组件
app.component('IconTeam', IconTeam)
app.component('IconApartment', IconApartment)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err)
  console.error('错误信息:', info)
}

console.log('挂载应用')
app.mount('#app')
console.log('应用挂载完成')
