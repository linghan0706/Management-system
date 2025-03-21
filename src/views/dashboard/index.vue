<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { 
  IconUser, 
  IconFire, 
  IconFile, 
  IconDashboard as IconWallet, 
  IconRefresh,
  IconUp as IconArrowRise,
  IconDown as IconArrowFall,
  IconSave,
  IconGithub,
  IconCheckCircleFill,
  IconClockCircle,
  IconRight,
  IconMinus,
  IconInfoCircleFill,
  IconExclamationCircleFill,
  IconMoreVertical
} from '@arco-design/web-vue/es/icon'

// 时间范围
const timeRange = ref('today')

// 统计数据
const statisticsData = ref([
  {
    title: '总用户数',
    value: 12580,
    trend: 15,
    detail: '本月新增1204人',
    icon: 'icon-user',
    type: 'blue'
  },
  {
    title: '活跃用户',
    value: 3120,
    trend: 8,
    detail: '同比增长12%',
    icon: 'icon-fire',
    type: 'green'
  },
  {
    title: '订单总量',
    value: 8965,
    trend: 12,
    detail: '今日新增23单',
    icon: 'icon-file',
    type: 'orange'
  },
  {
    title: '营收总额',
    value: 269800,
    trend: 5,
    detail: '昨日收入¥32,400',
    icon: 'icon-wallet',
    type: 'red'
  }
])

// 系统动态数据
const activityData = ref([
  {
    user: '张三',
    action: '创建了新的订单 #12345',
    time: '10分钟前',
    icon: 'icon-file',
    color: '#165DFF'
  },
  {
    user: '系统',
    action: '执行了数据备份任务',
    time: '30分钟前',
    icon: 'icon-save',
    color: '#00B42A'
  },
  {
    user: '李四',
    action: '更新了用户资料',
    time: '1小时前',
    icon: 'icon-user',
    color: '#F7BA1E'
  }
])

// 图表实例
let charts = {
  userGrowth: null as echarts.ECharts | null,
  source: null as echarts.ECharts | null,
  sales: null as echarts.ECharts | null,
  order: null as echarts.ECharts | null
}

// 初始化图表
onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  disposeCharts()
})

// 处理窗口大小变化
const handleResize = () => {
  for (const key in charts) {
    if (charts[key as keyof typeof charts]) {
      charts[key as keyof typeof charts]?.resize()
    }
  }
}

// 销毁图表实例
const disposeCharts = () => {
  for (const key in charts) {
    if (charts[key as keyof typeof charts]) {
      charts[key as keyof typeof charts]?.dispose()
    }
  }
}

// 获取图标组件
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'icon-user': IconUser,
    'icon-fire': IconFire,
    'icon-file': IconFile,
    'icon-wallet': IconWallet,
    'icon-save': IconSave,
    'icon-github': IconGithub,
    'icon-check-circle-fill': IconCheckCircleFill,
    'icon-clock-circle': IconClockCircle,
    'icon-right': IconRight,
    'icon-minus': IconMinus,
    'icon-info-circle-fill': IconInfoCircleFill,
    'icon-exclamation-circle-fill': IconExclamationCircleFill,
    'icon-more-vertical': IconMoreVertical,
    'icon-arrow-rise': IconArrowRise,
    'icon-arrow-fall': IconArrowFall,
    'icon-refresh': IconRefresh
  }

  return iconMap[iconName] || null
}

// 初始化所有图表
const initCharts = () => {
  // 用户增长趋势图
  const userGrowthChart = document.getElementById('userGrowthChart')
  if (userGrowthChart) {
    charts.userGrowth = echarts.init(userGrowthChart)
    charts.userGrowth.setOption({
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
        areaStyle: {}
      }]
    })
  }
  
  // 访问来源分布图
  const sourceChart = document.getElementById('sourceChart')
  if (sourceChart) {
    charts.source = echarts.init(sourceChart)
    charts.source.setOption({
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [{
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '搜索引擎' },
          { value: 735, name: '直接访问' },
          { value: 580, name: '邮件营销' },
          { value: 484, name: '联盟广告' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    })
  }
  
  // 销售额趋势图
  const salesChart = document.getElementById('salesChart')
  if (salesChart) {
    charts.sales = echarts.init(salesChart)
    charts.sales.setOption({
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }]
    })
  }
  
  // 订单统计图
  const orderChart = document.getElementById('orderChart')
  if (orderChart) {
    charts.order = echarts.init(orderChart)
    charts.order.setOption({
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '待付款' },
          { value: 735, name: '待发货' },
          { value: 580, name: '已发货' },
          { value: 484, name: '已完成' }
        ]
      }]
    })
  }
}

// 刷新数据
const refreshData = () => {
  // 这里添加刷新数据的逻辑
  statisticsData.value = statisticsData.value.map(item => ({
    ...item,
    value: Math.floor(item.value * (1 + Math.random() * 0.1 - 0.05)),
    trend: Math.floor(Math.random() * 25 - 5)
  }))
  
  // 重新初始化图表
  initCharts()
}

// 格式化数字
const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}
</script>

<template>
  <div class="dashboard-container">
    <!-- 页面标题 -->
    <div class="dashboard-header">
      <h2 class="page-title">数据概览</h2>
      <div class="page-subtitle">欢迎回来，这是您的首页数据概览</div>
    </div>
    
    <!-- 操作栏 -->
    <div class="action-bar">
      <a-button type="primary" class="refresh-btn" @click="refreshData">
        <template #icon><icon-refresh /></template>
        刷新数据
      </a-button>
      <div class="time-filter">
        <a-radio-group type="button" v-model="timeRange">
          <a-radio value="today">今日</a-radio>
          <a-radio value="week">本周</a-radio>
          <a-radio value="month">本月</a-radio>
          <a-radio value="year">全年</a-radio>
        </a-radio-group>
      </div>
    </div>
    
    <!-- 数据卡片 -->
    <div class="data-card-container">
      <a-card v-for="(item, index) in statisticsData" :key="index" class="data-card" :class="item.type">
        <div class="card-content">
          <div class="card-info">
            <div class="card-title">{{ item.title }}</div>
            <div class="card-value">{{ formatNumber(item.value) }}</div>
            <div class="card-trend" :class="{ up: item.trend > 0, down: item.trend < 0 }">
              <component :is="item.trend > 0 ? 'icon-arrow-rise' : 'icon-arrow-fall'" />
              <span>{{ Math.abs(item.trend) }}% 较上周</span>
            </div>
            <div class="card-detail">{{ item.detail }}</div>
          </div>
          <div class="card-icon" :class="item.type">
            <component :is="getIconComponent(item.icon)" />
          </div>
        </div>
      </a-card>
    </div>
    
    <!-- 图表区域 -->
    <div class="chart-section">
      <a-row :gutter="[16, 16]">
        <a-col :span="24" :md="24" :lg="16">
          <a-card class="chart-card" title="访问量趋势" :bordered="false">
            <template #extra>
              <a-radio-group type="button" default-value="week" class="responsive-radio">
                <a-radio value="day">今日</a-radio>
                <a-radio value="week">本周</a-radio>
                <a-radio value="month">本月</a-radio>
                <a-radio value="year">全年</a-radio>
              </a-radio-group>
            </template>
            <div id="userGrowthChart" ref="visitChart" class="chart-container"></div>
          </a-card>
        </a-col>
        
        <a-col :span="24" :md="24" :lg="8">
          <a-card class="chart-card" title="用户分布" :bordered="false">
            <template #extra>
              <a-dropdown trigger="click">
                <a-button size="small">
                  <template #icon><icon-more-vertical /></template>
                </a-button>
                <template #content>
                  <a-doption>按区域统计</a-doption>
                  <a-doption>按终端统计</a-doption>
                  <a-doption>按来源统计</a-doption>
                </template>
              </a-dropdown>
            </template>
            <div id="sourceChart" ref="userChart" class="chart-container"></div>
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="[16, 16]" class="mt-4">
        <a-col :span="24" :md="24" :lg="12">
          <a-card class="chart-card" title="销售额趋势" :bordered="false">
            <template #extra>
              <a-button type="text" @click="refreshData">
                <template #icon><icon-refresh /></template>
                刷新
              </a-button>
            </template>
            <div id="salesChart" ref="salesChart" class="chart-container"></div>
          </a-card>
        </a-col>
        
        <a-col :span="24" :md="24" :lg="12">
          <a-card class="chart-card" title="订单统计" :bordered="false">
            <template #extra>
              <a-dropdown trigger="click">
                <a-button size="small">
                  <template #icon><icon-more-vertical /></template>
                </a-button>
                <template #content>
                  <a-doption>按日统计</a-doption>
                  <a-doption>按周统计</a-doption>
                  <a-doption>按月统计</a-doption>
                </template>
              </a-dropdown>
            </template>
            <div id="orderChart" ref="orderChart" class="chart-container"></div>
          </a-card>
        </a-col>
      </a-row>
    </div>
    
    <!-- 系统动态 -->
    <div class="activity-container">
      <a-card class="activity-card" title="系统动态">
        <a-list>
          <a-list-item v-for="(item, index) in activityData" :key="index">
            <div class="activity-item">
              <a-avatar :style="{ backgroundColor: item.color }">
                <component :is="getIconComponent(item.icon)" />
              </a-avatar>
              <div class="activity-content">
                <div class="activity-title">
                  <span class="username">{{ item.user }}</span>
                  <span class="action">{{ item.action }}</span>
                </div>
                <div class="activity-time">{{ item.time }}</div>
              </div>
            </div>
          </a-list-item>
        </a-list>
      </a-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  padding: 0;
  
  .dashboard-header {
    margin-bottom: 16px;
    
    .page-title {
      font-size: 22px;
      font-weight: 600;
      color: var(--color-text-1);
      margin: 0 0 4px;
    }
    
    .page-subtitle {
      font-size: 14px;
      color: var(--color-text-3);
    }
  }
  
  .action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .refresh-btn {
      background-color: rgb(var(--primary-6));
    }
    
    .time-filter {
      :deep(.arco-radio-group-button) {
        display: flex;
        flex-wrap: wrap;
        
        .arco-radio {
          border-radius: 4px;
          height: 32px;
          line-height: 32px;
          padding: 0 16px;
          border: 1px solid var(--color-border);
          
          &:first-child {
            border-radius: 4px 0 0 4px;
          }
          
          &:last-child {
            border-radius: 0 4px 4px 0;
          }
          
          @media (max-width: 480px) {
            padding: 0 10px;
            font-size: 12px;
          }
        }
        
        .arco-radio-checked {
          background-color: var(--color-fill-2);
          border-color: var(--color-border);
          color: var(--color-text-1);
        }
      }
    }
  }
  
  .data-card-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
    
    @media (max-width: 1400px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    
    .data-card {
      background-color: var(--color-bg-2);
      border-radius: 4px;
      transition: transform 0.3s, box-shadow 0.3s;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
      }
      
      &.blue { border-top: 3px solid rgb(var(--primary-6)); }
      &.green { border-top: 3px solid rgb(var(--success-6)); }
      &.orange { border-top: 3px solid rgb(var(--warning-6)); }
      &.red { border-top: 3px solid rgb(var(--danger-6)); }
      
      .card-content {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        
        .card-info {
          .card-title {
            font-size: 14px;
            color: var(--color-text-2);
            margin-bottom: 4px;
          }
          
          .card-value {
            font-size: 28px;
            font-weight: 600;
            color: var(--color-text-1);
            margin-bottom: 8px;
          }
          
          .card-trend {
            font-size: 12px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            
            &.up {
              color: rgb(var(--success-6));
            }
            
            &.down {
              color: rgb(var(--danger-6));
            }
            
            .arco-icon {
              margin-right: 4px;
            }
          }
          
          .card-detail {
            font-size: 12px;
            color: var(--color-text-3);
          }
        }
        
        .card-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: transform 0.3s;
          
          &:hover {
            transform: scale(1.1);
          }
          
          &.blue {
            background-color: rgba(var(--primary-6), 0.1);
            color: rgb(var(--primary-6));
          }
          
          &.green {
            background-color: rgba(var(--success-6), 0.1);
            color: rgb(var(--success-6));
          }
          
          &.orange {
            background-color: rgba(var(--warning-6), 0.1);
            color: rgb(var(--warning-6));
          }
          
          &.red {
            background-color: rgba(var(--danger-6), 0.1);
            color: rgb(var(--danger-6));
          }
          
          .arco-icon {
            font-size: 28px;
          }
        }
      }
    }
  }
  
  .chart-section {
    margin-bottom: 24px;
    
    .chart-card {
      background-color: var(--color-bg-2);
      border-radius: 4px;
      height: 100%;
      transition: box-shadow 0.3s;
      
      &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
      }
      
      :deep(.arco-card-header) {
        border-bottom: 1px solid var(--color-border);
        padding: 16px;
      }
      
      .chart-container {
        height: 320px;
        padding: 16px;
        
        @media (max-width: 768px) {
          height: 260px;
        }
      }
      
      .responsive-radio {
        @media (max-width: 768px) {
          display: none;
        }
      }
    }
    
    .mt-4 {
      margin-top: 16px;
    }
  }
  
  .activity-container {
    .activity-card {
      background-color: var(--color-bg-2);
      border-radius: 4px;
      
      :deep(.arco-card-header) {
        border-bottom: 1px solid var(--color-border);
        padding: 16px;
      }
      
      .activity-item {
        display: flex;
        align-items: flex-start;
        padding: 16px;
        transition: background-color 0.2s;
        
        &:hover {
          background-color: var(--color-fill-1);
        }
        
        .arco-avatar {
          margin-right: 12px;
          transition: transform 0.3s;
          
          &:hover {
            transform: scale(1.1);
          }
        }
        
        .activity-content {
          flex: 1;
          
          .activity-title {
            font-size: 14px;
            color: var(--color-text-1);
            margin-bottom: 4px;
            
            .username {
              font-weight: 500;
              margin-right: 4px;
            }
          }
          
          .activity-time {
            font-size: 12px;
            color: var(--color-text-3);
          }
        }
      }
    }
  }
}
</style> 