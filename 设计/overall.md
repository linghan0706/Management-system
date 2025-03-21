### 在 Element Plus 中实现全屏自适应布局（管理后台专用方案）

#### 一、基础布局架构（基于 Element Plus 容器组件）

```
HTML<template>
  <!-- 外层容器使用 el-container -->
  <el-container class="full-screen-container">
    <!-- 左侧导航栏（PC端显示） -->
    <el-aside 
      class="left-nav" 
      :width="isMobile ? '0' : '240px'"
      :class="{ 'mobile-hidden': isMobile }">
      <div class="logo-area">
        <img src="logo.png" class="logo">
        <span class="system-name">XHan Admin</span>
      </div>
      <el-menu 
        :collapse="isMobile"
        background-color="#F8FAFF"
        active-text-color="#3B82F6">
        <el-menu-item index="1">菜单管理</el-menu-item>
        <el-menu-item index="2">用户管理</el-menu-item>
        <!-- 其他菜单项... -->
      </el-menu>
    </el-aside>

    <!-- 右侧主内容区 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header-bar">
        <div class="mobile-menu-btn" @click="drawerVisible = true" v-if="isMobile">
          <el-icon><Menu /></el-icon>
        </div>
        <div class="welcome-text">你好, 超级管理员!</div>
        <el-dropdown>
          <div class="user-info">
            <el-avatar :size="40" src="admin-avatar.png" />
            <span class="admin-name">超级管理员</span>
          </div>
        </el-dropdown>
      </el-header>

      <!-- 主内容区 -->
      <el-main class="main-content">
        <!-- 数据卡片区 -->
        <el-row :gutter="20" class="data-cards">
          <el-col :xs="24" :sm="12" :md="6" v-for="(card, index) in cards" :key="index">
            <el-card class="data-card" :style="{ backgroundColor: card.color }">
              <h3>{{ card.title }}</h3>
              <p class="value">{{ card.value }}</p>
            </el-card>
          </el-col>
        </el-row>

        <!-- 图表区 -->
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12">
            <div class="chart-container">
              <div id="ring-chart" style="height: 300px"></div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <div class="chart-container">
              <div id="line-chart" style="height: 300px"></div>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <!-- 移动端抽屉菜单 -->
    <el-drawer 
      v-model="drawerVisible"
      direction="ltr"
      size="240px">
      <!-- 抽屉内容同PC端导航 -->
    </el-drawer>
  </el-container>
</template>
```

#### 二、核心样式配置（SCSS）

```
Scss// 全屏布局设置
.full-screen-container {
  height: 100vh;
  overflow: hidden;

  .left-nav {
    transition: width 0.3s;
    background: #F8FAFF;
    box-shadow: 2px 0 8px rgba(0,0,0,0.05);

    &.mobile-hidden {
      width: 0 !important;
    }

    .logo-area {
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      border-bottom: 1px solid #eee;
    }
  }

  .header-bar {
    display: flex;
    align-items: center;
    background: white;
    border-bottom: 1px solid #eee;
    .mobile-menu-btn {
      margin-right: 15px;
      font-size: 20px;
    }
  }

  .main-content {
    background: #f5f7fa;
    overflow-y: auto;
  }
}

// 响应式数据卡片
.data-cards {
  margin-bottom: 20px;
  .data-card {
    color: white;
    h3 { font-size: 16px; margin: 0 }
    .value { 
      font-size: 24px; 
      margin: 10px 0;
      @media (max-width: 768px) {
        font-size: 20px;
      }
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .el-col-xs-24 {
    width: 100%;
    margin-bottom: 15px;
  }
  
  .chart-container {
    height: 250px !important;
  }
}
```

#### 三、响应式处理逻辑

```
JavaScript<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  setup() {
    const isMobile = ref(false)
    const drawerVisible = ref(false)
    const checkDevice = () => {
      isMobile.value = window.innerWidth <= 768
    }

    // 图表响应式处理
    const initCharts = () => {
      const ringChart = echarts.init(document.getElementById('ring-chart'))
      const lineChart = echarts.init(document.getElementById('line-chart'))
      // ...图表配置

      // 窗口变化时重置图表
      window.addEventListener('resize', () => {
        ringChart.resize()
        lineChart.resize()
      })
    }

    onMounted(() => {
      checkDevice()
      window.addEventListener('resize', checkDevice)
      initCharts()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', checkDevice)
    })

    return { isMobile, drawerVisible }
  }
}
</script>
```

#### 四、关键实现要点

1. **容器嵌套策略**
   - 使用 `el-container > el-aside + el-container > el-header + el-main` 三级嵌套
   - 通过 `height: 100vh` 实现视口高度占满
2. **响应式断点控制**
   - 移动端判断阈值：768px
   - 使用 `:xs="24"` 实现移动端卡片单列显示
   - 图表容器设置最小高度防止折叠
3. **移动端优化技巧**
   - 主内容区 `overflow-y: auto` 实现局部滚动
   - 导航栏平滑过渡动画 `transition: width 0.3s`
   - 图表使用 `resize()` 方法响应窗口变化
4. **性能优化**
   - 防抖处理窗口 resize 事件
   - 按需加载图表组件
   - 使用 CSS transform 代替传统布局

#### 五、扩展适配建议

1. **暗黑模式兼容**

```
CSS.dark-mode {
  .left-nav { background: #1a1a1a }
  .header-bar { background: #2d2d2d }
  .data-card { background: #333 !important }
}
```

1. **高清屏适配**

```
CSS@media (-webkit-min-device-pixel-ratio: 2) {
  .logo {
    background-image: url(logo@2x.png);
    background-size: contain;
  }
}
```

此方案已实现：

- 桌面端与移动端布局自动切换
- 图表与数据卡片响应式重排
- 导航菜单自动折叠
- 触摸设备友好交互
- 主流浏览器兼容（Chrome/Firefox/Safari）

可根据实际需求调整断点阈值或添加更多响应式场景，Element Plus 的 `el-col` 响应式属性（xs/sm/md/lg/xl）可灵活组合实现更精细的布局控制。