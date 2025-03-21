// Mock数据模块
import Mock from 'mockjs'

// 设置延迟
Mock.setup({
  timeout: '200-600'
})

// 用户相关
Mock.mock(/\/api\/user\/login/, 'post', () => {
  return {
    code: 200,
    data: {
      token: 'admin-token',
      userInfo: {
        id: 1,
        username: 'admin',
        name: '系统管理员',
        avatar: '',
        roles: ['admin']
      }
    },
    message: '登录成功'
  }
})

Mock.mock(/\/api\/user\/info/, 'get', () => {
  return {
    code: 200,
    data: {
      id: 1,
      username: 'admin',
      name: '系统管理员',
      avatar: '',
      roles: ['admin'],
      permissions: ['*']
    },
    message: '获取用户信息成功'
  }
})

Mock.mock(/\/api\/user\/logout/, 'post', () => {
  return {
    code: 200,
    data: null,
    message: '退出登录成功'
  }
})

// 仪表盘数据
Mock.mock(/\/api\/dashboard\/statistics/, 'get', () => {
  return {
    code: 200,
    data: {
      users: {
        total: Mock.Random.integer(10000, 15000),
        increase: Mock.Random.integer(5, 20),
        newUsers: Mock.Random.integer(1000, 2000)
      },
      activeUsers: {
        total: Mock.Random.integer(3000, 5000),
        increase: Mock.Random.integer(5, 15),
        ratio: Mock.Random.integer(10, 20)
      },
      orders: {
        total: Mock.Random.integer(8000, 10000),
        increase: Mock.Random.integer(8, 20),
        newOrders: Mock.Random.integer(10, 30)
      },
      revenue: {
        total: Mock.Random.integer(200000, 300000),
        increase: Mock.Random.integer(-10, 10),
        yesterday: Mock.Random.integer(20000, 40000)
      }
    },
    message: '获取统计数据成功'
  }
})

export default Mock 