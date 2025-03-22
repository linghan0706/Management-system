<template>
  <div class="config-container">
    <a-card class="general-card">
      <template #title>系统设置</template>
      <div class="navigation-cards">
        <a-card class="nav-card" hoverable @click="navigateTo('user')">
          <template #cover>
            <div class="card-icon">
              <icon-user size="32" />
            </div>
          </template>
          <a-card-meta title="用户管理" />
        </a-card>
        
        <a-card class="nav-card" hoverable @click="navigateTo('role')">
          <template #cover>
            <div class="card-icon">
              <icon-team size="32" />
            </div>
          </template>
          <a-card-meta title="角色管理" />
        </a-card>
        
        <a-card class="nav-card" hoverable @click="navigateTo('menu')">
          <template #cover>
            <div class="card-icon">
              <icon-menu size="32" />
            </div>
          </template>
          <a-card-meta title="菜单管理" />
        </a-card>
        
        <a-card class="nav-card" hoverable @click="navigateTo('dept')">
          <template #cover>
            <div class="card-icon">
              <icon-apartment size="32" />
            </div>
          </template>
          <a-card-meta title="部门管理" />
        </a-card>
        
        <a-card class="nav-card" hoverable @click="navigateTo('config')">
          <template #cover>
            <div class="card-icon">
              <icon-settings size="32" />
            </div>
          </template>
          <a-card-meta title="系统设置" />
        </a-card>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { IconUser } from '@arco-design/web-vue/es/icon'
import { IconTeam } from '@arco-design/web-vue/es/icon/icon-team'
import { IconMenu, IconApartment, IconSettings } from '@arco-design/web-vue/es/icon'

const router = useRouter()

// 路由导航函数
const navigateTo = (path: string) => {
  // 如果点击的是系统设置卡片，直接跳转到系统设置详情页面
  if (path === 'config') {
    router.push('/system/config/system-config')
  } else {
    router.push(`/system/${path}`)
  }
}
</script>

<style scoped>
.config-container {
  padding: 16px;
}

.navigation-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 16px;
}

.nav-card {
  width: 200px;
  transition: all 0.3s;
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  background-color: var(--color-fill-2);
  color: var(--color-text-1);
}
</style>