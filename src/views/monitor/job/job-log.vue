<template>
  <div class="job-log-container">
    <a-card class="job-log-card" title="任务日志管理">
      <template #extra>
        <a-space>
          <a-button status="danger" @click="handleBatchDelete">
            <template #icon>
              <icon-delete />
            </template>
            批量删除
          </a-button>
          <a-button status="warning" @click="refreshData">
            <template #icon>
              <icon-refresh />
            </template>
            刷新
          </a-button>
        </a-space>
      </template>
      
      <!-- 搜索表单 -->
      <a-form :model="searchForm" layout="inline" class="search-form">
        <a-form-item field="taskName" label="任务名称">
          <a-input v-model="searchForm.taskName" placeholder="请输入任务名称" allow-clear />
        </a-form-item>
        <a-form-item field="status" label="执行状态">
          <a-select v-model="searchForm.status" placeholder="请选择状态" allow-clear style="width: 120px">
            <a-option value="0">成功</a-option>
            <a-option value="1">失败</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="dateRange" label="执行时间">
          <a-range-picker v-model="searchForm.dateRange" style="width: 240px" />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <template #icon>
                <icon-search />
              </template>
              搜索
            </a-button>
            <a-button @click="resetSearch">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
      
      <!-- 数据表格 -->
      <a-table
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
        row-key="id"
        class="log-table"
      >
        <template #columns>
          <a-table-column title="#" width="60">
            <template #cell="{ rowIndex }">
              {{ (pagination.current - 1) * pagination.pageSize + rowIndex + 1 }}
            </template>
          </a-table-column>
          <a-table-column title="选择" width="60">
            <template #cell="{ record }">
              <a-checkbox v-model="record.selected" />
            </template>
          </a-table-column>
          <a-table-column title="任务名称" data-index="taskName" />
          <a-table-column title="任务组" data-index="taskGroup" />
          <a-table-column title="调用目标" data-index="invokeTarget" />
          <a-table-column title="日志信息" data-index="logInfo" />
          <a-table-column title="执行状态" data-index="status" width="80">
            <template #cell="{ record }">
              <a-tag :color="record.status === '0' ? 'green' : 'red'">
                {{ record.status === '0' ? '成功' : '失败' }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="执行时间" data-index="createTime" />
          <a-table-column title="耗时" data-index="costTime">
            <template #cell="{ record }">
              {{ record.costTime }} 毫秒
            </template>
          </a-table-column>
          <a-table-column title="操作" width="120">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleViewDetail(record)">
                  <template #icon>
                    <icon-eye />
                  </template>
                  详情
                </a-button>
                <a-button type="text" size="small" status="danger" @click="handleDelete(record)">
                  <template #icon>
                    <icon-delete />
                  </template>
                  删除
                </a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    
    <!-- 日志详情对话框 -->
    <a-modal
      v-model:visible="detailModalVisible"
      title="日志详情"
      @cancel="detailModalVisible = false"
      :footer="false"
      width="700px"
    >
      <a-descriptions :data="detailData" layout="vertical" bordered />
      <div v-if="currentLog.exceptionInfo" class="exception-info">
        <h3>异常信息</h3>
        <a-typography-paragraph code>
          <pre>{{ currentLog.exceptionInfo }}</pre>
        </a-typography-paragraph>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import {
  IconDelete,
  IconRefresh,
  IconSearch,
  IconEye
} from '@arco-design/web-vue/es/icon'

// 搜索表单
const searchForm = reactive({
  taskName: '',
  status: '',
  dateRange: []
})

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [10, 20, 50, 100]
})

// 当前查看的日志
const currentLog = reactive({
  id: '',
  taskName: '',
  taskGroup: '',
  invokeTarget: '',
  logInfo: '',
  status: '',
  exceptionInfo: '',
  createTime: '',
  costTime: 0
})

// 控制详情对话框显示
const detailModalVisible = ref(false)

// 详情数据
const detailData = ref([])

// 获取日志列表
const fetchLogList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    setTimeout(() => {
      // 模拟数据
      tableData.value = [
        {
          id: '1',
          taskName: '系统状态监控',
          taskGroup: 'SYSTEM',
          invokeTarget: 'com.xhan.task.SystemMonitorTask.execute()',
          logInfo: '系统状态监控执行成功',
          status: '0',
          exceptionInfo: '',
          createTime: '2023-06-01 12:30:00',
          costTime: 125,
          selected: false
        },
        {
          id: '2',
          taskName: '数据库备份',
          taskGroup: 'BACKUP',
          invokeTarget: 'com.xhan.task.DatabaseBackupTask.execute()',
          logInfo: '数据库备份执行成功',
          status: '0',
          exceptionInfo: '',
          createTime: '2023-06-01 02:00:00',
          costTime: 3542,
          selected: false
        },
        {
          id: '3',
          taskName: '临时文件清理',
          taskGroup: 'SYSTEM',
          invokeTarget: 'com.xhan.task.TempFileClearTask.execute()',
          logInfo: '临时文件清理失败',
          status: '1',
          exceptionInfo: 'java.io.IOException: 无法访问目录 /tmp/uploads，权限不足\n\tat com.xhan.task.TempFileClearTask.execute(TempFileClearTask.java:42)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)',
          createTime: '2023-06-01 01:00:00',
          costTime: 56,
          selected: false
        }
      ]
      pagination.total = 3
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取日志列表失败', error)
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchLogList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.taskName = ''
  searchForm.status = ''
  searchForm.dateRange = []
  handleSearch()
}

// 分页变化
const onPageChange = (page) => {
  pagination.current = page
  fetchLogList()
}

// 每页条数变化
const onPageSizeChange = (pageSize) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  fetchLogList()
}

// 查看详情
const handleViewDetail = (record) => {
  Object.assign(currentLog, record)
  
  // 构建详情数据
  detailData.value = [
    {
      label: '任务名称',
      value: record.taskName
    },
    {
      label: '任务组',
      value: record.taskGroup
    },
    {
      label: '调用目标',
      value: record.invokeTarget
    },
    {
      label: '日志信息',
      value: record.logInfo
    },
    {
      label: '执行状态',
      value: record.status === '0' ? '成功' : '失败'
    },
    {
      label: '执行时间',
      value: record.createTime
    },
    {
      label: '执行耗时',
      value: `${record.costTime} 毫秒`
    }
  ]
  
  detailModalVisible.value = true
}

// 删除日志
const handleDelete = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除该条日志记录吗？`,
    onOk: () => {
      // 模拟API调用
      setTimeout(() => {
        tableData.value = tableData.value.filter((item) => item.id !== record.id)
        pagination.total--
        Message.success('删除成功')
      }, 500)
    }
  })
}

// 批量删除日志
const handleBatchDelete = () => {
  const selectedLogs = tableData.value.filter((item) => item.selected)
  
  if (selectedLogs.length === 0) {
    Message.warning('请至少选择一条日志记录')
    return
  }
  
  Modal.confirm({
    title: '确认批量删除',
    content: `确定要删除已选中的 ${selectedLogs.length} 条日志记录吗？`,
    onOk: () => {
      // 模拟API调用
      setTimeout(() => {
        const selectedIds = selectedLogs.map((log) => log.id)
        tableData.value = tableData.value.filter((item) => !selectedIds.includes(item.id))
        pagination.total -= selectedLogs.length
        Message.success('批量删除成功')
      }, 500)
    }
  })
}

// 组件挂载
onMounted(() => {
  fetchLogList()
})

// 刷新数据
const refreshData = () => {
  fetchLogList()
}
</script>

<style lang="scss" scoped>
.job-log-container {
  padding: 16px;
  
  .job-log-card {
    width: 100%;
  }
  
  .search-form {
    margin-bottom: 16px;
  }
  
  .exception-info {
    margin-top: 16px;
    
    h3 {
      margin-bottom: 8px;
      color: #f5222d;
    }
    
    pre {
      max-height: 300px;
      overflow: auto;
      background-color: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      margin: 0;
    }
  }
}
</style>