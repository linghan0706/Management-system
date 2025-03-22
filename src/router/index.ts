import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 路由配置
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'home', keepAlive: true }
      },
      {
        path: 'system',
        name: 'System',
        redirect: '/system/user',
        meta: { title: '系统管理', icon: 'settings' },
        children: [
          {
            path: 'user',
            name: 'User',
            component: () => import('@/views/system/user/user-list.vue'),
            meta: { title: '用户管理', icon: 'user', keepAlive: true }
          },
          {
            path: 'role',
            name: 'Role',
            component: () => import('@/views/system/role/role.vue'),
            meta: { title: '角色管理', icon: 'team', keepAlive: true }
          },
          {
            path: 'menu',
            name: 'Menu',
            component: () => import('@/views/system/menu/menu-list.vue'),
            meta: { title: '菜单管理', icon: 'menu', keepAlive: true }
          },
          {
            path: 'dept',
            name: 'Dept',
            component: () => import('@/views/system/dept/department.vue'),
            meta: { title: '部门管理', icon: 'apartment', keepAlive: true }
          },
          {
            path: 'config',
            name: 'Config',
            component: () => import('@/views/system/config/index.vue'),
            meta: { title: '系统设置', icon: 'setting', keepAlive: true },
            children: [
              {
                path: 'system-config',
                name: 'SystemConfig',
                component: () => import('@/views/system/config/system-config.vue'),
                meta: { title: '系统设置详情', icon: 'setting', keepAlive: true }
              }
            ]
          }
        ]
      },
      {
        path: 'monitor',
        name: 'Monitor',
        redirect: '/monitor/online',
        meta: { title: '系统监控', icon: 'computer' },
        children: [
          {
            path: 'online',
            name: 'Online',
            component: () => import('@/views/monitor/online/online-users.vue'),
            meta: { title: '在线用户', icon: 'user', keepAlive: true }
          },
          {
            path: 'job',
            name: 'Job',
            component: () => import('@/views/monitor/job/scheduled-task.vue'),
            meta: { title: '定时任务', icon: 'calendar', keepAlive: true }
          },
          {
            path: 'server',
            name: 'Server',
            component: () => import('@/views/monitor/server/server-info.vue'),
            meta: { title: '服务监控', icon: 'dashboard', keepAlive: true }
          },
          {
            path: 'log',
            name: 'Log',
            component: () => import('@/views/monitor/log/operation-log.vue'),
            meta: { title: '操作日志', icon: 'file-text', keepAlive: true }
          },
          {
            path: 'job-log',
            name: 'JobLog',
            component: () => import('@/views/monitor/job/job-log.vue'),
            meta: { title: '任务日志', icon: 'calendar-clock', keepAlive: true }
          }
        ]
      },
      {
        path: 'generator',
        name: 'Generator',
        redirect: '/generator/index',
        meta: { title: '代码生成器', icon: 'code' },
        children: [
          {
            path: 'index',
            name: 'GeneratorIndex',
            component: () => import('@/views/generator/index.vue'),
            meta: { title: '代码生成', icon: 'code', keepAlive: true }
          },
          {
            path: 'config',
            name: 'GeneratorConfig',
            component: () => import('@/views/generator/config.vue'),
            meta: { title: '生成配置', icon: 'setting', keepAlive: true, hidden: true }
          }
        ]
      }
      // 测试目录和代码生成器已恢复
    ]
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403.vue'),
    meta: { title: '403', requiresAuth: false }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - Lin Admin` : 'Lin Admin'
  
  // 简单的身份验证逻辑
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth !== false && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router