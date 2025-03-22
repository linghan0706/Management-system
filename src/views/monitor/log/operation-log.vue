<template>
  <div class="operation-log-container">
    <a-card class="operation-log-card" title="操作日志">
      <template #extra>
        <a-space>
          <a-button status="danger" @click="handleBatchDelete" :disabled="!hasSelectedLogs">
            <template #icon>
              <icon-delete />
            </template>
            删除所选
          </a-button>
          <a-button status="warning" @click="refreshData">
            <template #icon>
              <icon-refresh />
            </template>
            刷新
          </a-button>
          <a-button status="success" @click="handleExport">
            <template #icon>
              <icon-download />
            </template>
            导出
          </a-button>
        </a-space>
      </template>
      
      <!-- 搜索表单 -->
      <a-form :model="searchForm" layout="inline" class="search-form">
        <a-form-item field="operName" label="操作人员">
          <a-input v-model="searchForm.operName" placeholder="请输入操作人员" allow-clear />
        </a-form-item>
        <a-form-item field="status" label="操作状态">
          <a-select v-model="searchForm.status" placeholder="请选择状态" allow-clear style="width: 120px">
            <a-option value="0">成功</a-option>
            <a-option value="1">失败</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="operTime" label="操作时间">
          <a-range-picker v-model="searchForm.operTime" style="width: 240px" />
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
        row-key="operId"
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
          <a-table-column title="操作模块" data-index="title" />
          <a-table-column title="操作类型" data-index="businessType">
            <template #cell="{ record }">
              <a-tag :color="getBusinessTypeColor(record.businessType)">
                {{ getBusinessTypeText(record.businessType) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="操作人员" data-index="operName" />
          <a-table-column title="操作地址" data-index="operIp" />
          <a-table-column title="操作地点" data-index="operLocation" />
          <a-table-column title="操作状态" data-index="status" width="80">
            <template #cell="{ record }">
              <a-tag :color="record.status === '0' ? 'green' : 'red'">
                {{ record.status === '0' ? '成功' : '失败' }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="操作时间" data-index="operTime" />
          <a-table-column title="操作" width="100">
            <template #cell="{ record }">
              <a-button type="text" size="small" @click="handleViewDetail(record)">
                <template #icon>
                  <icon-eye />
                </template>
                详情
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    
    <!-- 详情对话框 -->
    <a-modal
      v-model:visible="detailModalVisible"
      title="操作日志详情"
      @cancel="detailModalVisible = false"
      :footer="false"
      :mask-closable="true"
    >
      <a-descriptions :data="logDetailData" layout="vertical" bordered />
      <template v-if="currentLog && currentLog.status === '1'">
        <a-divider>异常信息</a-divider>
        <a-typography-paragraph>
          <pre class="error-message">{{ currentLog.errorMsg }}</pre>
        </a-typography-paragraph>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import {
  IconDelete,
  IconRefresh,
  IconDownload,
  IconSearch,
  IconEye
} from '@arco-design/web-vue/es/icon'
import { getOperationLogList, deleteOperationLog, clearOperationLog, exportOperationLog } from '../../../api/monitor/log'
import type { OperationLog, OperationLogQuery, OperationLogResponse } from '../../../types/monitor'

// 搜索表单
const searchForm = reactive({
  operName: '',
  status: '',
  operTime: []
})

// 表格数据
const tableData = ref<OperationLog[]>([])
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
const currentLog = ref<OperationLog | null>(null)

// 控制详情对话框显示
const detailModalVisible = ref(false)

// 日志详情数据
const logDetailData = computed(() => {
  if (!currentLog.value) return []
  
  return [
    {
      label: '操作模块',
      value: currentLog.value.title
    },
    {
      label: '操作类型',
      value: getBusinessTypeText(currentLog.value.businessType)
    },
    {
      label: '操作人员',
      value: currentLog.value.operName
    },
    {
      label: '操作地址',
      value: currentLog.value.operIp
    },
    {
      label: '操作地点',
      value: currentLog.value.operLocation
    },
    {
      label: '请求方法',
      value: currentLog.value.method
    },
    {
      label: '请求URL',
      value: currentLog.value.operUrl
    },
    {
      label: '请求参数',
      value: currentLog.value.operParam
    },
    {
      label: '返回结果',
      value: currentLog.value.jsonResult
    },
    {
      label: '操作状态',
      value: currentLog.value.status === '0' ? '成功' : '失败'
    },
    {
      label: '操作时间',
      value: currentLog.value.operTime
    }
  ]
})

// 获取操作日志列表
const fetchLogList = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      operName: searchForm.operName || undefined,
      status: searchForm.status || undefined,
      beginTime: searchForm.operTime && searchForm.operTime[0] ? searchForm.operTime[0] : undefined,
      endTime: searchForm.operTime && searchForm.operTime[1] ? searchForm.operTime[1] : undefined
    }
    
    // 调用API获取数据
    const res = await getOperationLogList(params)
    if (res.code === 200) {
      // 为每条记录添加selected属性
      tableData.value = res.data.list.map((item: OperationLog) => ({
        ...item,
        selected: false
      }))
      pagination.total = res.data.total
    } else {
      Message.error(res.msg || '获取操作日志失败')
      // 如果API调用失败，使用空数组
      tableData.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('获取操作日志失败', error)
    Message.error('获取操作日志失败，请稍后重试')
    tableData.value = []
    pagination.total = 0
  } finally {
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
  searchForm.operName = ''
  searchForm.status = ''
  searchForm.operTime = []
  handleSearch()
}

// 分页变化
const onPageChange = (page: number) => {
  pagination.current = page
  fetchLogList()
}

// 每页条数变化
const onPageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  fetchLogList()
}

// 查看详情
const handleViewDetail = (record: any) => {
  currentLog.value = record
  detailModalVisible.value = true
}

// 刷新数据
const refreshData = () => {
  fetchLogList()
}

// 获取业务类型文本
const getBusinessTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    '1': '新增',
    '2': '修改',
    '3': '删除',
    '4': '授权',
    '5': '导出',
    '6': '导入',
    '7': '强退',
    '8': '生成代码',
    '9': '清空数据'
  }
  return typeMap[type] || '其他'
}

// 获取业务类型颜色
const getBusinessTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    '1': 'green',
    '2': 'blue',
    '3': 'red',
    '4': 'purple',
    '5': 'cyan',
    '6': 'orange',
    '7': 'magenta',
    '8': 'lime',
    '9': 'red'
  }
  return colorMap[type] || 'default'
}

// 判断是否有选中的日志
const hasSelectedLogs = computed(() => {
  return tableData.value.some(item => item.selected)
})

// 批量删除
const handleBatchDelete = () => {
  const selectedIds = tableData.value
    .filter(item => item.selected)
    .map(item => item.operId)
  
  if (selectedIds.length === 0) {
    Message.warning('请至少选择一条记录')
    return
  }
  
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除已选中的 ${selectedIds.length} 条操作日志吗？`,
    onOk: async () => {
      try {
        const res = await deleteOperationLog(selectedIds)
        if (res.code === 200) {
          Message.success('删除成功')
          fetchLogList()
        } else {
          Message.error(res.msg || '删除失败')
        }
      } catch (error) {
        console.error('删除操作日志失败', error)
        Message.error('删除失败，请稍后重试')
      }
    }
  })
}

// 导出操作日志
const handleExport = async () => {
  try {
    // 构建查询参数，与当前搜索条件一致
    const params = {
      operName: searchForm.operName || undefined,
      status: searchForm.status || undefined,
      beginTime: searchForm.operTime && searchForm.operTime[0] ? searchForm.operTime[0] : undefined,
      endTime: searchForm.operTime && searchForm.operTime[1] ? searchForm.operTime[1] : undefined
    }
    
    Message.loading('正在导出数据，请稍候...')
    const res = await exportOperationLog(params)
    
    // 创建Blob对象并下载
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '操作日志.xlsx'
    link.click()
    window.URL.revokeObjectURL(url)
    
    Message.success('导出成功')
  } catch (error) {
    console.error('导出操作日志失败', error)
    Message.error('导出失败，请稍后重试')
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchLogList()
})
</script>

<style lang="scss" scoped>
.operation-log-container {
  padding: 16px;
  
  .operation-log-card {
    width: 100%;
  }
  
  .search-form {
    margin-bottom: 16px;
  }
  
  .error-message {
    max-height: 300px;
    overflow-y: auto;
    background-color: #f5f5f5;
    padding: 8px;
    border-radius: 4px;
    color: #f5222d;
    font-family: monospace;
    white-space: pre-wrap;
    word-break: break-all;
  }
}
</style>