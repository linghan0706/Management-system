<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { logout } from '../../api/user'
import {
  IconHome,
  IconSettings,
  IconComputer,
  IconFolder,
  IconCode,
  IconUser,
  IconExport,
  IconDelete,
  IconMenu,
  IconMenuFold,
  IconMenuUnfold,
  IconSun,
  IconMoon,
  IconMoonFill,
  IconSunFill,
  IconNotification,
  IconExclamationCircleFill,
  IconMoreVertical,
  IconExperiment,
  IconTag as IconTeam,
  IconApps as IconApartment,
  IconCalendar,
  IconDashboard,
  IconFile as IconFileText,
  IconFile,
  IconPoweroff,
  IconRefresh,
  IconClose,
  IconMinus,
  IconRight,
  IconSearch,
  IconFullscreen,
  IconFullscreenExit
} from '@arco-design/web-vue/es/icon'

interface MenuItem {
  name: string
  path: string
  title: string
  icon?: string
  children?: MenuItem[]
}

const router = useRouter()
const route = useRoute()

// 响应式处理
const isMobile = ref(window.innerWidth < 768)
const collapsed = ref(isMobile.value)
const drawerVisible = ref(false)
const darkMode = ref(false)

// 清除缓存方法
const clearCache = () => {
  Message.info('正在清除缓存...')
  
  // 模拟清除缓存
  setTimeout(() => {
    Message.success('缓存清除成功')
  }, 1000)
}

// 监听窗口大小变化
const handleResize = () => {
  const oldIsMobile = isMobile.value
  isMobile.value = window.innerWidth < 768
  
  // 仅在状态变化时才修改collapsed
  if (oldIsMobile !== isMobile.value) {
    if (isMobile.value) {
      collapsed.value = true
    } else {
      // 桌面模式下默认展开
      collapsed.value = false
    }
  }
}

// 监听窗口调整
onMounted(() => {
  window.addEventListener('resize', handleResize)
  
  // 确保当路由为根路径时，重定向到dashboard
  if (route.path === '/') {
    router.push('/dashboard')
  }
  
  // 检查token和用户信息
  const token = localStorage.getItem('token')
  
  // 在Netlify环境中，如果没有token，可以设置一个默认的访客token
  const isNetlify = window.location.hostname.includes('netlify.app');
  if (!token && isNetlify) {
    // 为Netlify部署设置临时访客token
    localStorage.setItem('token', 'visitor-token');
    localStorage.setItem('userInfo', JSON.stringify({
      name: '访客',
      avatar: '',
      roles: ['visitor']
    }));
    return;
  }
  
  // 本地开发环境的原有逻辑
  if (!token) {
    window.location.href = '/login';
    return;
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// 菜单数据
const menuList = computed(() => {
  const routes = router.getRoutes()
  const layoutRoute = routes.find(route => route.name === 'Layout')
  
  if (!layoutRoute || !layoutRoute.children) return []
  
  return layoutRoute.children.map(item => {
    const menuItem = {
      name: item.name as string,
      path: item.path,
      title: item.meta?.title as string,
      icon: item.meta?.icon as string,
      children: [] as any[]
    }
    
    // 处理子菜单
    if (item.children && item.children.length > 0) {
      menuItem.children = item.children.filter(child => 
        !child.meta?.hidden
      ).map(child => ({
        name: child.name as string,
        path: `${item.path}/${child.path}`,
        title: child.meta?.title as string,
        icon: child.meta?.icon as string
      }))
    }
    
    return menuItem
  })
})

// 标签页控制
const tabs = ref([
  { key: 'dashboard', title: '首页', path: '/' }
])

// 当前激活的标签页
const activeTab = computed(() => {
  // 根据当前路由路径确定激活的标签
  const path = route.path
  if (path === '/') return 'dashboard'
  
  // 移除开头的斜杠并获取第一级路径
  const pathParts = path.startsWith('/') ? path.substring(1).split('/') : path.split('/')
  
  // 如果是二级路由，返回完整路径作为key
  if (pathParts.length > 1) {
    return pathParts.join('/')
  }
  
  return pathParts[0]
})

// 添加标签页
const addTab = (routePath: string, title: string) => {
  const key = routePath.startsWith('/') ? routePath.substring(1) : routePath
  const exists = tabs.value.some(item => item.key === key)
  if (!exists) {
    tabs.value.push({
      key,
      title,
      path: routePath
    })
  }
}

// 处理标签切换
const handleTabChange = (key: string) => {
  const tab = tabs.value.find(item => item.key === key)
  if (tab) {
    router.push(tab.path)
  }
}

// 处理标签删除
const handleTabDelete = (key: string) => {
  // 不允许删除首页标签
  if (key === 'dashboard') return
  
  const index = tabs.value.findIndex(item => item.key === key)
  if (index !== -1) {
    tabs.value.splice(index, 1)
    
    // 如果删除的是当前激活的标签，则切换到前一个标签
    if (key === activeTab.value) {
      const prevTab = tabs.value[index - 1] || tabs.value[0]
      router.push(prevTab.path)
    }
  }
}

// 关闭其他标签
const closeOtherTabs = () => {
  tabs.value = tabs.value.filter(item => 
    item.key === 'dashboard' || item.key === activeTab.value
  )
}

// 关闭所有标签
const closeAllTabs = () => {
  tabs.value = tabs.value.filter(item => item.key === 'dashboard')
  router.push('/')
}

// 刷新当前页面
const refreshCurrentPage = () => {
  const currentPath = route.path
  router.replace('/redirect' + currentPath)
}

// 当前激活的菜单
const activeMenu = computed(() => {
  const path = route.path
  // 确保首页路径能正确高亮
  if (path === '/' || path === '/dashboard') return 'item-Dashboard'
  
  // 移除开头的斜杠
  const trimmedPath = path.startsWith('/') ? path.substring(1) : path
  
  // 查找当前路径匹配的菜单项
  const findMatchingMenuKey = (items: any[]): string | null => {
    for (const item of items) {
      // 检查主菜单项
      if (item.path && (
        `/${item.path}` === path || 
        item.path === trimmedPath ||
        item.path === path
      )) {
        return `item-${item.name}`;
      }
      
      // 检查子菜单项
      if (item.children && item.children.length) {
        for (const child of item.children) {
          if (child.path && (
            child.path === trimmedPath ||
            `/${child.path}` === path ||
            child.path === path ||
            `${item.path}/${child.path.replace('/', '')}` === trimmedPath
          )) {
            return child.path.replace('/', '');
          }
        }
      }
    }
    return null;
  }
  
  const menuKey = findMatchingMenuKey(menuList.value);
  if (menuKey) {
    return menuKey;
  }
  
  // 兜底逻辑：如果是子菜单项，则返回完整路径作为key
  if (trimmedPath.includes('/')) {
    return trimmedPath;
  }
  
  // 如果是主菜单项，使用item-前缀和首字母大写的路径
  return `item-${trimmedPath.charAt(0).toUpperCase() + trimmedPath.slice(1)}`;
})

// 监听activeMenu变化，用于调试
watch(() => activeMenu.value, (newVal) => {
  console.log('当前激活菜单项:', newVal)
})

// 监听路由变化，打印调试信息
watch(() => route.path, (newPath) => {
  console.log('路由变化:', {
    path: newPath,
    activeMenu: activeMenu.value,
    menuList: menuList.value,
    selectedKeys: [activeMenu.value]
  });
}, { immediate: true })

// 处理菜单项点击
const handleMenuItemClick = (key: string) => {
  console.log('点击菜单项:', key);
  let path = key;
  
  // 如果key是以item-开头的格式，需要转换
  if (key.startsWith('item-')) {
    path = key.replace('item-', '').toLowerCase();
  }
  
  // 如果点击的是当前路径，不做处理
  if (path.toLowerCase() === route.path.substring(1).toLowerCase()) {
    console.log('已在当前路径:', path);
    return;
  }
  
  // 构建完整的路径
  const fullPath = path.startsWith('/') ? path : `/${path}`;
  console.log('导航到:', fullPath);
  
  // 查找对应菜单项的标题
  let title = getMenuTitle(path);
  
  // 添加标签页并导航
  addTab(fullPath, title || path);
  router.push(fullPath);
  
  // 如果在移动端，点击菜单项后关闭抽屉
  if (isMobile.value) {
    drawerVisible.value = false;
  }
}

// 根据路径获取菜单标题
const getMenuTitle = (path: string): string => {
  const simplePath = path.startsWith('/') ? path.substring(1) : path
  
  // 在菜单列表中查找匹配的菜单项
  const findInMenuList = (list: any[]): string => {
    for (const item of list) {
      // 检查主菜单项
      if (item.path && (
          item.path === simplePath || 
          item.path === `/${simplePath}` ||
          item.name.toLowerCase() === simplePath.toLowerCase()
      )) {
        return item.title || ''
      }
      
      // 检查子菜单项
      if (item.children && item.children.length) {
        const childMatch = findInMenuList(item.children)
        if (childMatch) return childMatch
      }
    }
    return ''
  }
  
  return findInMenuList(menuList.value)
}

// 切换侧边栏
const toggleSidebar = () => {
  if (isMobile.value) {
    drawerVisible.value = !drawerVisible.value
  } else {
    collapsed.value = !collapsed.value
  }
}

// 处理菜单折叠
const onCollapse = (value: boolean) => {
  if (!isMobile.value) {
    collapsed.value = value
  }
}

// 移动端抽屉控制
const toggleDrawer = () => {
  drawerVisible.value = !drawerVisible.value
}

// 切换主题
const toggleTheme = () => {
  darkMode.value = !darkMode.value
  // 这里可以添加切换主题的具体实现
}

// 展示设置抽屉
const showSettings = ref(false)

// 打开设置抽屉
const openSettings = () => {
  router.push('/system')
}

// 检查设备类型
const checkDevice = () => {
  if (isMobile.value) {
    collapsed.value = true
  }
}

// 获取用户信息
const getUserInfo = () => {
  try {
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      return JSON.parse(userInfoStr)
    }
    return null
  } catch (error) {
    console.error('获取用户信息失败', error)
    return null
  }
}

// 用户信息
const userInfo = ref(getUserInfo() || {
  name: '游客',
  avatar: '',
  roles: []
})

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  window.location.href = '/login'
}

// 组件挂载时检查登录状态
onMounted(() => {
  console.log('布局组件挂载完成')
  checkDevice()
  console.log('设备类型检查完成', { isMobile: isMobile.value, collapsed: collapsed.value })
  
  // 检查token和用户信息
  const token = localStorage.getItem('token')
  console.log('Token状态:', token ? '存在' : '不存在')
  if (!token) {
    console.log('未检测到登录状态，跳转到登录页')
    window.location.href = '/login'
    return
  }
  
  // 获取存储的用户信息
  const userInfoStr = localStorage.getItem('userInfo')
  console.log('用户信息状态:', userInfoStr ? '存在' : '不存在')
  if (userInfoStr) {
    try {
      const parsedUserInfo = JSON.parse(userInfoStr)
      userInfo.value = parsedUserInfo
      console.log('已加载用户信息:', parsedUserInfo)
    } catch (e) {
      console.error('解析用户信息失败:', e)
    }
  }
  
  console.log('路由信息:', { 
    currentRoute: route.path,
    routeName: route.name,
    routeMeta: route.meta,
    menuList: menuList.value
  })
})

// 当前页面路由名称
const currentRoute = computed(() => {
  return route.meta.title as string
})

// 全屏控制
const isFullscreen = ref(false)
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }
}

// 默认展开的子菜单
const openKeys = computed(() => {
  const path = route.path
  if (path === '/') return []
  
  // 移除开头的斜杠并分割路径
  const pathParts = path.startsWith('/') ? path.substring(1).split('/') : path.split('/')
  
  // 取第一级作为需要展开的子菜单
  if (pathParts.length > 0) {
    return [pathParts[0]]
  }
  
  return []
})

// 菜单样式
const menuStyle = computed(() => {
  return {
    width: collapsed.value ? '64px' : '220px',
    height: '100%'
  }
})

// 搜索功能
const onSearch = (value: string) => {
  if (!value) return
  
  // 在菜单中搜索匹配项
  const searchInMenu = (menus: MenuItem[], searchText: string): MenuItem | null => {
    for (const menu of menus) {
      // 匹配标题或路径
      if (menu.title?.toLowerCase().includes(searchText.toLowerCase()) || 
          menu.path?.toLowerCase().includes(searchText.toLowerCase())) {
        return menu
      }
      
      // 递归搜索子菜单
      if (menu.children?.length) {
        const result = searchInMenu(menu.children, searchText)
        if (result) return result
      }
    }
    return null
  }
  
  // 在路由菜单中搜索
  const result = searchInMenu(menuList.value, value)
  
  if (result) {
    // 找到匹配项，导航到对应页面
    const path = result.path.startsWith('/') ? result.path : `/${result.path}`
    router.push(path)
    
    // 如果在移动端，关闭抽屉
    if (isMobile.value) {
      drawerVisible.value = false
    }
    
    Message.success(`跳转到: ${result.title}`)
  } else {
    Message.warning('未找到匹配的菜单项')
  }
}

// 根据图标名获取对应的图标组件
const getIconComponent = (iconName: string | undefined) => {
  if (!iconName) return IconDashboard
  
  // 映射图标名称到组件
  const iconMap: Record<string, any> = {
    'dashboard': IconDashboard,
    'settings': IconSettings,
    'computer': IconComputer,
    'folder': IconFolder,
    'code': IconCode,
    'user': IconUser,
    'team': IconTeam,
    'apartment': IconApartment,
    'calendar': IconCalendar,
    'file': IconFile,
    'fileText': IconFileText,
    'experiment': IconExperiment,
    'menu': IconMenu,
    'notification': IconNotification
  }
  
  return iconMap[iconName] || IconDashboard
}

// 处理移动端菜单项点击
const handleMobileMenuItemClick = (key: string) => {
  // 调用相同的处理函数，保持逻辑一致
  handleMenuItemClick(key)
  // 关闭抽屉（此逻辑已包含在handleMenuItemClick中，这里保留是为了确保兼容性）
  drawerVisible.value = false
}

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - Lin Admin` : 'Lin Admin'
  
  // 简单的身份验证逻辑
  const token = localStorage.getItem('token')
  const isNetlify = window.location.hostname.includes('netlify.app');
  
  if (to.meta.requiresAuth !== false && !token && !isNetlify) {
    next('/login')
  } else {
    next()
  }
})
</script>

<template>
  <div class="layout" :class="{ 'layout-dark': darkMode }">
    <!-- 侧边栏 - 桌面模式 -->
    <div v-if="!isMobile" class="sidebar" :class="{ 'sidebar-collapse': collapsed }">
      <div class="logo-container">
        <div class="logo">
          <img src="@/assets/logo.png" alt="Logo" />
          <h1 v-if="!collapsed">Lin Admin</h1>
        </div>
      </div>
      <a-menu
        :collapsed="collapsed"
        :default-open-keys="openKeys"
        :selected-keys="[activeMenu]"
        accordion
        auto-open
        @collapse="onCollapse"
      >
        <!-- 动态生成的菜单 -->
        <template v-for="item in menuList" :key="item.name">
          <!-- 有子菜单的情况 -->
          <a-sub-menu v-if="item.children && item.children.length > 0" :key="`sub-${item.name}`">
            <template #icon>
              <component :is="getIconComponent(item.icon)" />
            </template>
            <template #title>{{ item.title }}</template>
            
            <!-- 渲染子菜单项 -->
            <a-menu-item 
              v-for="child in item.children" 
              :key="child.path.replace('/', '')"
              @click="handleMobileMenuItemClick(child.path)"
            >
              <template #icon>
                <component :is="getIconComponent(child.icon)" />
              </template>
              {{ child.title }}
            </a-menu-item>
          </a-sub-menu>
          
          <!-- 没有子菜单的情况 -->
          <a-menu-item 
            v-else 
            :key="`item-${item.name}`"
            @click="handleMenuItemClick(item.path)"
          >
            <template #icon>
              <component :is="getIconComponent(item.icon)" />
            </template>
            {{ item.title }}
          </a-menu-item>
        </template>
      </a-menu>
    </div>
    
    <!-- 移动端抽屉菜单 -->
    <a-drawer
      v-model:visible="drawerVisible"
      placement="left"
      :width="220"
      :header="false"
      :footer="false"
      :mask-closable="true"
      :body-style="{ padding: 0 }"
      class="mobile-sidebar-drawer"
    >
      <div class="logo-container">
        <div class="logo">
          <img v-if="false" src="@/assets/logo.png" alt="Logo" />
          <h1>Lin Admin</h1>
        </div>
      </div>
      <a-menu
        :default-open-keys="openKeys"
        :selected-keys="[activeMenu]"
        accordion
        auto-open
        @menu-item-click="handleMobileMenuItemClick"
      >
        <!-- 动态生成的菜单 -->
        <template v-for="item in menuList" :key="item.name">
          <!-- 有子菜单的情况 -->
          <a-sub-menu v-if="item.children && item.children.length > 0" :key="`sub-${item.name}`">
            <template #icon>
              <component :is="getIconComponent(item.icon)" />
            </template>
            <template #title>{{ item.title }}</template>
            
            <!-- 渲染子菜单项 -->
            <a-menu-item 
              v-for="child in item.children" 
              :key="child.path.replace('/', '')"
              @click="handleMobileMenuItemClick(child.path)"
            >
              <template #icon>
                <component :is="getIconComponent(child.icon)" />
              </template>
              {{ child.title }}
            </a-menu-item>
          </a-sub-menu>
          
          <!-- 没有子菜单的情况 -->
          <a-menu-item 
            v-else 
            :key="`item-${item.name}`"
            @click="handleMobileMenuItemClick(item.path)"
          >
            <template #icon>
              <component :is="getIconComponent(item.icon)" />
            </template>
            {{ item.title }}
          </a-menu-item>
        </template>
      </a-menu>
    </a-drawer>
    
    <!-- 内容区 -->
    <div class="main" :class="{'main-collapsed': !isMobile && collapsed, 'main-mobile': isMobile}">
      <!-- 顶部导航 -->
      <div class="header">
        <div class="header-left">
          <!-- 移动端汉堡菜单按钮 -->
          <a-button 
            v-if="isMobile" 
            class="menu-trigger" 
            type="text"
            @click="toggleSidebar"
          >
            <icon-menu />
          </a-button>
          
          <!-- Logo显示在移动端header中 -->
          <div v-if="isMobile" class="header-logo">
            <img src="@/assets/logo.png" alt="Logo" />
            <h1>Lin Admin</h1>
          </div>
        </div>
        
        <div class="header-center" v-if="!isMobile">
          <a-input-search
            placeholder="搜索菜单、功能..."
            allow-clear
            search-button
            @search="onSearch"
          >
            <template #prefix>
              <!-- 重复 -->
              <!-- <icon-search /> -->
            </template>
          </a-input-search>
        </div>
        
        <div class="header-right">
          <a-space>
            <!-- 全屏按钮 -->
            <a-button shape="circle" type="text" @click="toggleFullscreen">
              <icon-fullscreen-exit v-if="isFullscreen" />
              <icon-fullscreen v-else />
            </a-button>
            
            <!-- 主题切换 -->
            <a-button shape="circle" type="text" @click="toggleTheme">
              <icon-moon-fill v-if="darkMode" />
              <icon-sun-fill v-else />
            </a-button>
            
            <!-- 通知信息 -->
            <a-badge :count="5" dot>
              <a-button shape="circle" type="text">
                <icon-notification />
              </a-button>
            </a-badge>
            
            <!-- 用户头像和下拉菜单 -->
            <a-dropdown trigger="click" position="br">
              <div class="user-avatar">
                <a-avatar size="medium">{{ userInfo.name?.substring(0, 1) }}</a-avatar>
                <span class="username" v-if="!isMobile">{{ userInfo.name }}</span>
                <icon-down />
              </div>
              <template #content>
                <a-doption>
                  <template #icon><icon-user /></template>
                  个人中心
                </a-doption>
                <a-doption>
                  <template #icon><icon-settings /></template>
                  用户设置
                </a-doption>
                <a-divider style="margin: 4px 0" />
                <a-doption @click="handleLogout">
                  <template #icon><icon-poweroff /></template>
                  退出登录
                </a-doption>
              </template>
            </a-dropdown>
            
            <!-- 桌面模式折叠按钮 -->
            <a-button 
              v-if="!isMobile"
              class="collapse-btn" 
              type="text"
              size="medium"
              @click="toggleSidebar"
            >
              <icon-menu-fold v-if="!collapsed" />
              <icon-menu-unfold v-else />
            </a-button>
          </a-space>
        </div>
      </div>
      
      <!-- 主要内容区 -->
      <div class="main-content">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';

// 布局相关变量
$header-height: 60px;
$footer-height: 60px;
$sidebar-width: 220px;
$sidebar-collapsed-width: 64px;
$transition-duration: 0.3s;

.layout {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
  
  &-dark {
    background-color: var(--color-bg-1);
    color: var(--color-text-1);
  }
  
  .sidebar {
    height: 100%;
    overflow: hidden;
    transition: width 0.2s ease;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    z-index: 100;
    flex-shrink: 0;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: $sidebar-width;
    
    &-collapse {
      width: $sidebar-collapsed-width;
    }
    
    .logo-container {
      height: 64px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      
      .logo {
        display: flex;
        align-items: center;
        height: 32px;
        
        img {
          height: 40px;
          width: 40px;
          object-fit: contain;
          transition: all $transition-duration;
        }
        
        h1 {
          color: #000;
          font-size: 18px;
          font-weight: 600;
          white-space: nowrap;
          margin: 0;
          margin-left: 8px;
        }
      }
    }
    
    :deep(.arco-menu) {
      // 在折叠状态下确保图标居中
      &.arco-menu-collapsed {
        .arco-menu-item, .arco-menu-inline-header {
          padding: 5px !important;
          
          .arco-menu-item-inner, .arco-menu-inline-header-title {
            justify-content: center !important;
            padding: 0 !important;
            
            .arco-icon {
              margin-left: 11px !important;
              font-size: 20px;
            }
          }
        }
      }
      
      .arco-menu-selected {
        background-color: rgba(var(--primary-6), 0.08);
        border-right: none;
        
        .arco-menu-item-inner {
          font-weight: 500;
          color: rgb(var(--primary-6));
          
          span {
            color: rgb(var(--primary-6)) !important;
            font-weight: 500;
          }
          
          .arco-icon {
            color: rgb(var(--primary-6));
          }
        }
      }
      
      .arco-menu-item {
        margin: 4px 8px;
        border-radius: 4px;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        
        &:hover {
          background-color: rgba(var(--primary-6), 0.05);
          transform: translateX(4px);
          
          .arco-menu-item-inner {
            color: rgb(var(--primary-6));
            
            span {
              color: rgb(var(--primary-6));
            }
            
            .arco-icon {
              color: rgb(var(--primary-6));
            }
          }
        }
        
        &.arco-menu-selected {
          background-color: rgba(var(--primary-6), 0.08);
          border-right: none;
          position: relative;
          
          &::after {
            content: '';
            position: absolute;
            right: -8px;
            top: 0;
            bottom: 0;
            width: 4px;
            background-color: rgb(var(--primary-6));
            border-radius: 2px 0 0 2px;
          }
          
          .arco-menu-item-inner {
            justify-content: center;
            color: rgb(var(--primary-6));
            font-weight: 500;
            
            span, a {
              color: rgb(var(--primary-6)) !important;
              font-weight: 500;
            }
            
            .arco-icon {
              color: rgb(var(--primary-6));
            }
          }
        }
        
        &:active::after {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(var(--primary-6), 0.12);
          border-radius: 4px;
          animation: ripple 0.4s linear;
        }
        
        .arco-menu-item-inner {
          justify-content: center;
          transition: all 0.25s ease;
          
          .arco-icon {
            font-size: 18px;
            margin-right: 10px;
            transition: all 0.25s ease;
          }
          
          span, a {
            transition: all 0.25s ease;
          }
        }
      }
      
      /* 子菜单标题项选中样式 */
      .arco-menu-inline-header {
        &.arco-menu-selected {
          .arco-menu-inline-header-title {
            color: rgb(var(--primary-6));
            font-weight: 500;
            
            span, a {
              color: rgb(var(--primary-6)) !important;
              font-weight: 500;
            }
            
            .arco-icon {
              color: rgb(var(--primary-6));
            }
          }
        }
        
        &:hover {
          .arco-menu-inline-header-title {
            color: rgb(var(--primary-6));
            
            span, a {
              color: rgb(var(--primary-6));
            }
            
            .arco-icon {
              color: rgb(var(--primary-6));
            }
          }
        }
      }
      
      /* 确保所有文本元素都有过渡效果 */
      * {
        transition: color 0.3s ease;
      }
    }
  }
  
  .mobile-sidebar-drawer {
    :deep(.arco-drawer-body) {
      padding: 0;
    }
    
    .logo-container {
      height: 64px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-bottom: 1px solid var(--color-border);
      
      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        
        img {
          height: 40px;
          width: 40px;
          object-fit: contain;
          transition: all $transition-duration;
        }
        
        h1 {
          color: #000;
          font-size: 18px;
          font-weight: 600;
          white-space: nowrap;
          margin: 0;
          margin-left: 8px;
        }
      }
    }
    
    :deep(.arco-menu) {
      // 移动端折叠菜单图标居中样式
      &.arco-menu-collapsed {
        .arco-menu-item, .arco-menu-inline-header {
          padding: 0 !important;
          
          .arco-menu-item-inner, .arco-menu-inline-header-title {
            justify-content: center !important;
            padding: 0 !important;
            
            .arco-icon {
              margin-right: 0 !important;
              font-size: 20px;
            }
          }
        }
      }
      
      .arco-menu-selected {
        background-color: rgba(var(--primary-6), 0.08);
        border-right: none;
        
        .arco-menu-item-inner {
          font-weight: 500;
          color: rgb(var(--primary-6));
          justify-content: center;
          
          span, a {
            color: rgb(var(--primary-6)) !important;
            font-weight: 500;
          }
          
          .arco-icon {
            color: rgb(var(--primary-6));
          }
        }
      }
      
      .arco-menu-item {
        text-align: center;
        margin: 4px 8px;
        border-radius: 4px;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        
        &:hover {
          background-color: rgba(var(--primary-6), 0.05);
          transform: translateX(4px);
        }
        
        &.arco-menu-selected {
          background-color: rgba(var(--primary-6), 0.08);
          border-right: none;
          position: relative;
          
          &::after {
            content: '';
            position: absolute;
            right: -8px;
            top: 0;
            bottom: 0;
            width: 4px;
            background-color: rgb(var(--primary-6));
            border-radius: 2px 0 0 2px;
          }
          
          .arco-menu-item-inner {
            justify-content: center;
            color: rgb(var(--primary-6));
            font-weight: 500;
            
            span, a {
              color: rgb(var(--primary-6)) !important;
              font-weight: 500;
            }
            
            .arco-icon {
              color: rgb(var(--primary-6));
            }
          }
        }
        
        &:active::after {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(var(--primary-6), 0.12);
          border-radius: 4px;
          animation: ripple 0.4s linear;
        }
        
        .arco-menu-item-inner {
          justify-content: center;
          
          .arco-icon {
            font-size: 18px;
            margin-right: 10px;
            transition: all 0.25s ease;
          }
        }
      }
      
      .arco-menu-inline-header {
        text-align: center;
        margin: 4px 8px;
        border-radius: 4px;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        
        &:hover {
          background-color: rgba(var(--primary-6), 0.08);
          transform: translateX(4px);
        }
        
        &.arco-menu-selected {
          background-color: rgba(var(--primary-6), 0.08);
          
          .arco-menu-inline-header-title {
            color: rgb(var(--primary-6));
            font-weight: 500;
            justify-content: center;
            
            span, a {
              color: rgb(var(--primary-6)) !important;
              font-weight: 500;
            }
            
            .arco-icon {
              color: rgb(var(--primary-6));
              font-size: 18px;
            }
          }
        }
        
        .arco-menu-inline-header-title {
          justify-content: center;
          
          .arco-icon {
            font-size: 18px;
            margin-right: 10px;
            transition: all 0.25s ease;
          }
        }
      }
    }
  }
  
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all $transition-duration;
    position: absolute;
    left: $sidebar-width;
    right: 0;
    top: 0;
    bottom: 0;
    
    &.main-collapsed {
      left: $sidebar-collapsed-width;
    }
    
    &.main-mobile {
      left: 0;
      width: 100%;
    }
    
    .header {
      height: $header-height;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      background-color: #fff;
      z-index: 99;
      
      .header-left {
        display: flex;
        align-items: center;
        flex: 1;
        
        .menu-trigger {
          margin-right: 12px;
        }
        
        .header-logo {
          display: flex;
          align-items: center;
          
          img {
            height: 32px;
            width: 32px;
            object-fit: contain;
            margin-right: 8px;
          }
          
          h1 {
            color: #000;
            font-size: 16px;
            font-weight: 600;
            white-space: nowrap;
            margin: 0;
          }
        }
      }
      
      .header-center {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 2;
        
        :deep(.arco-input-search) {
          width: 400px;
        }
      }
      
      .header-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex: 1;
        
        .user-avatar {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 0 4px;
          
          .username {
            margin: 0 8px;
          }
        }
        
        .collapse-btn {
          margin-left: 8px;
        }
      }
    }
    
    .main-content {
      flex: 1;
      padding: 16px;
      overflow: auto;
      background-color: var(--color-bg-2);
      height: calc(100% - #{$header-height});
      box-sizing: border-box;
      width: 100%;
      margin: 0 auto;
      max-width: 1600px;
    }
  }
}

// 移动端适配样式
@media (max-width: 767px) {
  .layout {
    .sidebar {
      position: fixed;
      left: -$sidebar-width;
      transition: left 0.3s ease;
      
      &.sidebar-visible {
        left: 0;
      }
    }
    
    .main {
      width: 100%;
      left: 0;
    }
    
    .header {
      padding: 0 12px;
      
      .header-left {
        flex: 1;
        
        .header-logo {
          img {
            height: 24px;
            width: 24px;
          }
          h1 {
            font-size: 14px;
          }
        }
      }
      
      .header-right {
        flex: 0;
        
        .user-avatar {
          .username {
            display: none;
          }
        }
        
        .collapse-btn {
          display: none;
        }
      }
    }
    
    .main-content {
      padding: 12px;
    }
  }
}
</style>