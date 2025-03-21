import request from '../request'

// 定义登录表单数据接口
interface LoginData {
  username: string
  password: string
  rememberMe?: boolean
}

// 定义登录响应数据接口
interface LoginResponse {
  token: string
  userInfo: {
    name: string
    avatar: string
    roles: string[]
  }
}

// 模拟登录响应
const mockLoginResponse: LoginResponse = {
  token: 'demo-token',
  userInfo: {
    name: 'admin',
    avatar: '',
    roles: ['admin']
  }
}

/**
 * 用户登录
 * @param data 登录表单数据
 * @returns 登录结果
 */
export function login(data: LoginData): Promise<LoginResponse> {
  // 实际项目中这里会发送真实请求
  return new Promise((resolve, reject) => {
    // 模拟网络请求延迟
    setTimeout(() => {
      // 固定数据登录验证
      if (data.username === 'admin' && data.password === '123456') {
        resolve(mockLoginResponse)
      } else {
        // 登录失败
        reject(new Error('用户名或密码错误'))
      }
    }, 1000)
  })
}

/**
 * 用户登出
 */
export function logout(): Promise<any> {
  // 实际项目中这里会发送真实请求
  return new Promise((resolve) => {
    // 模拟网络请求延迟
    setTimeout(() => {
      resolve({ success: true })
    }, 500)
  })
}

/**
 * 获取用户信息
 */
export function getUserInfo(): Promise<any> {
  // 实际项目中这里会发送真实请求
  return request.get('/api/user/info')
}

/**
 * 修改密码
 * @param data 密码数据
 */
export function changePassword(data: any): Promise<any> {
  // 实际项目中这里会发送真实请求
  return request.post('/api/user/change-password', data)
} 