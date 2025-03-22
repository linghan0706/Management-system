<template>
  <div class="server-info-container">
    <a-card class="server-info-card" title="服务器信息">
      <template #extra>
        <a-button status="warning" @click="refreshData">
          <template #icon>
            <icon-refresh />
          </template>
          刷新
        </a-button>
      </template>
      
      <!-- CPU信息 -->
      <a-card class="info-section" title="CPU信息">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-statistic title="核心数" :value="serverInfo.cpu.cores" />
          </a-col>
          <a-col :span="8">
            <a-statistic title="使用率" :value="serverInfo.cpu.usage" suffix="%" />
          </a-col>
          <a-col :span="8">
            <a-statistic title="系统使用率" :value="serverInfo.cpu.sysUsage" suffix="%" />
          </a-col>
        </a-row>
        <a-divider />
        <a-progress
          :percent="serverInfo.cpu.usage"
          :stroke-color="getProgressColor(serverInfo.cpu.usage)"
          :track-color="'#f5f5f5'"
          :show-text="true"
        />
      </a-card>
      
      <!-- 内存信息 -->
      <a-card class="info-section" title="内存信息">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-statistic title="总内存" :value="formatSize(serverInfo.memory.total)" />
          </a-col>
          <a-col :span="8">
            <a-statistic title="已用内存" :value="formatSize(serverInfo.memory.used)" />
          </a-col>
          <a-col :span="8">
            <a-statistic title="使用率" :value="serverInfo.memory.usage" suffix="%" />
          </a-col>
        </a-row>
        <a-divider />
        <a-progress
          :percent="serverInfo.memory.usage"
          :stroke-color="getProgressColor(serverInfo.memory.usage)"
          :track-color="'#f5f5f5'"
          :show-text="true"
        />
      </a-card>
      
      <!-- 磁盘信息 -->
      <a-card class="info-section" title="磁盘信息">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-statistic title="总空间" :value="formatSize(serverInfo.disk.total)" />
          </a-col>
          <a-col :span="8">
            <a-statistic title="已用空间" :value="formatSize(serverInfo.disk.used)" />
          </a-col>
          <a-col :span="8">
            <a-statistic title="使用率" :value="serverInfo.disk.usage" suffix="%" />
          </a-col>
        </a-row>
        <a-divider />
        <a-progress
          :percent="serverInfo.disk.usage"
          :stroke-color="getProgressColor(serverInfo.disk.usage)"
          :track-color="'#f5f5f5'"
          :show-text="true"
        />
      </a-card>
      
      <!-- 系统信息 -->
      <a-card class="info-section" title="系统信息">
        <a-descriptions :data="systemInfoData" layout="inline-vertical" bordered />
      </a-card>
      
      <!-- JVM信息 -->
      <a-card class="info-section" title="JVM信息">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-statistic title="总内存" :value="formatSize(serverInfo.jvm.total)" />
          </a-col>
          <a-col :span="8">
            <a-statistic title="已用内存" :value="formatSize(serverInfo.jvm.used)" />
          </a-col>
          <a-col :span="8">
            <a-statistic title="使用率" :value="serverInfo.jvm.usage" suffix="%" />
          </a-col>
        </a-row>
        <a-divider />
        <a-progress
          :percent="serverInfo.jvm.usage"
          :stroke-color="getProgressColor(serverInfo.jvm.usage)"
          :track-color="'#f5f5f5'"
          :show-text="true"
        />
        <a-divider />
        <a-descriptions :data="jvmInfoData" layout="inline-vertical" bordered />
      </a-card>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconRefresh } from '@arco-design/web-vue/es/icon'

// 服务器信息数据
const serverInfo = reactive({
  cpu: {
    cores: 8,
    usage: 32.5,
    sysUsage: 25.8
  },
  memory: {
    total: 16 * 1024 * 1024 * 1024, // 16GB
    used: 8 * 1024 * 1024 * 1024,   // 8GB
    usage: 50.0
  },
  disk: {
    total: 512 * 1024 * 1024 * 1024, // 512GB
    used: 256 * 1024 * 1024 * 1024,  // 256GB
    usage: 50.0
  },
  jvm: {
    total: 2 * 1024 * 1024 * 1024, // 2GB
    used: 1 * 1024 * 1024 * 1024,  // 1GB
    usage: 50.0,
    version: 'JDK 11',
    home: '/usr/lib/jvm/java-11-openjdk',
    startTime: '2023-06-01 08:00:00',
    runTime: '10小时30分钟'
  },
  system: {
    os: 'Linux CentOS 7.9',
    ip: '192.168.1.100',
    hostname: 'server-prod-01',
    arch: 'x86_64',
    cpuModel: 'Intel(R) Xeon(R) CPU E5-2680 v4 @ 2.40GHz',
    userDir: '/home/admin',
    javaVersion: '11.0.11'
  }
})

// 系统信息数据
const systemInfoData = computed(() => [
  {
    label: '操作系统',
    value: serverInfo.system.os
  },
  {
    label: 'IP地址',
    value: serverInfo.system.ip
  },
  {
    label: '主机名',
    value: serverInfo.system.hostname
  },
  {
    label: '系统架构',
    value: serverInfo.system.arch
  },
  {
    label: 'CPU型号',
    value: serverInfo.system.cpuModel
  },
  {
    label: '用户目录',
    value: serverInfo.system.userDir
  },
  {
    label: 'Java版本',
    value: serverInfo.system.javaVersion
  }
])

// JVM信息数据
const jvmInfoData = computed(() => [
  {
    label: 'JDK版本',
    value: serverInfo.jvm.version
  },
  {
    label: 'JDK路径',
    value: serverInfo.jvm.home
  },
  {
    label: '启动时间',
    value: serverInfo.jvm.startTime
  },
  {
    label: '运行时长',
    value: serverInfo.jvm.runTime
  }
])

// 格式化文件大小
const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i]
}

// 根据使用率获取进度条颜色
const getProgressColor = (usage: number) => {
  if (usage < 50) return '#52c41a' // 绿色
  if (usage < 80) return '#faad14' // 黄色
  return '#f5222d' // 红色
}

// 刷新数据
const refreshData = () => {
  Message.loading('正在获取服务器信息...')
  
  // 模拟API调用
  try {
    setTimeout(() => {
      try {
        // 随机更新一些数据以模拟实时变化
        serverInfo.cpu.usage = Math.floor(Math.random() * 100)
        serverInfo.cpu.sysUsage = Math.floor(Math.random() * serverInfo.cpu.usage) // 确保系统使用率不超过总使用率
        
        // 更新内存数据
        serverInfo.memory.usage = Math.floor(Math.random() * 100)
        serverInfo.memory.used = (serverInfo.memory.usage / 100) * serverInfo.memory.total
        
        // 更新磁盘数据
        serverInfo.disk.usage = Math.floor(Math.random() * 100)
        serverInfo.disk.used = (serverInfo.disk.usage / 100) * serverInfo.disk.total
        
        // 更新JVM数据
        serverInfo.jvm.usage = Math.floor(Math.random() * 100)
        serverInfo.jvm.used = (serverInfo.jvm.usage / 100) * serverInfo.jvm.total
        
        // 更新运行时间（模拟增加）
        const currentRunTime = serverInfo.jvm.runTime
        if (currentRunTime.includes('小时')) {
          const hours = parseInt(currentRunTime.split('小时')[0]) + 1
          serverInfo.jvm.runTime = `${hours}小时${currentRunTime.split('小时')[1]}`
        }
        
        Message.success('服务器信息已更新')
      } catch (error) {
        console.error('更新数据时出错:', error)
        Message.error('更新数据时出错，请重试')
      }
    }, 1000)
  } catch (error) {
    console.error('刷新数据时出错:', error)
    Message.error('刷新数据时出错，请重试')
  }
}

// 组件挂载时获取数据
onMounted(() => {
  refreshData()
})
</script>

<style lang="scss" scoped>
.server-info-container {
  padding: 16px;
  
  .server-info-card {
    width: 100%;
  }
  
  .info-section {
    margin-bottom: 16px;
  }
  
  :deep(.arco-statistic-title) {
    font-size: 14px;
  }
  
  :deep(.arco-statistic-value) {
    font-size: 20px;
    font-weight: bold;
  }
  
  :deep(.arco-progress) {
    margin: 8px 0;
  }
}
</style>