import axios from 'axios'
import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { Message } from '@arco-design/web-vue'

// 创建axios实例
const request = axios.create({
  baseURL: '', // 暂时设置为空
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 获取token，可根据实际情况修改
    const token = localStorage.getItem('token')
    if (token) {
      // 设置token到请求头
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    console.error('请求错误', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回后端返回的响应数据
    return response.data
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response
      
      // 状态码处理
      if (status === 401) {
        // 未授权时清除token并跳转登录页
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        window.location.href = '/login'
        Message.error('登录已过期，请重新登录')
      } else if (status === 403) {
        Message.error('没有权限访问该资源')
      } else if (status === 404) {
        Message.error('请求的资源不存在')
      } else if (status >= 500) {
        Message.error('服务器异常，请稍后再试')
      } else {
        // 其他错误
        const responseData = error.response.data as any
        Message.error(responseData?.message || '操作失败')
      }
    } else {
      // 处理请求超时或网络错误
      if (error.message?.includes('timeout')) {
        Message.error('请求超时，请检查网络')
      } else {
        Message.error('网络错误，请检查网络连接')
      }
    }
    
    console.error('响应错误', error)
    return Promise.reject(error)
  }
)

export default request 