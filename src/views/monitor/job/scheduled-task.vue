<template>
  <div class="scheduled-task-container">
    <a-card class="scheduled-task-card" title="定时任务管理">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleAdd">
            <template #icon>
              <icon-plus />
            </template>
            新增
          </a-button>
          <a-button status="success">
            <template #icon>
              <icon-play-circle />
            </template>
            启动所选
          </a-button>
          <a-button status="danger">
            <template #icon>
              <icon-pause-circle />
            </template>
            暂停所选
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
        <a-form-item field="status" label="任务状态">
          <a-select v-model="searchForm.status" placeholder="请选择状态" allow-clear style="width: 120px">
            <a-option value="0">正常</a-option>
            <a-option value="1">暂停</a-option>
          </a-select>
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
        class="task-table"
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
          <a-table-column title="执行类" data-index="invokeTarget" />
          <a-table-column title="cron表达式" data-index="cronExpression" />
          <a-table-column title="状态" data-index="status" width="80">
            <template #cell="{ record }">
              <a-tag :color="record.status === '0' ? 'green' : 'red'">
                {{ record.status === '0' ? '正常' : '暂停' }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="下次执行时间" data-index="nextExecuteTime" />
          <a-table-column title="操作" width="200">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleEdit(record)">
                  <template #icon>
                    <icon-edit />
                  </template>
                  编辑
                </a-button>
                <a-button 
                  type="text" 
                  size="small" 
                  :status="record.status === '0' ? 'danger' : 'success'"
                  @click="handleToggleStatus(record)"
                >
                  <template #icon>
                    <icon-pause-circle v-if="record.status === '0'" />
                    <icon-play-circle v-else />
                  </template>
                  {{ record.status === '0' ? '暂停' : '启动' }}
                </a-button>
                <a-button type="text" size="small" status="warning" @click="handleExecuteOnce(record)">
                  <template #icon>
                    <icon-play-arrow-fill />
                  </template>
                  执行一次
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
    
    <!-- 任务编辑对话框 -->
    <a-modal
      v-model:visible="editModalVisible"
      :title="editForm.id ? '编辑任务' : '新增任务'"
      @cancel="editModalVisible = false"
      @before-ok="handleSaveTask"
    >
      <a-form :model="editForm" layout="vertical">
        <a-form-item field="taskName" label="任务名称" required>
          <a-input v-model="editForm.taskName" placeholder="请输入任务名称" />
        </a-form-item>
        <a-form-item field="taskGroup" label="任务组" required>
          <a-input v-model="editForm.taskGroup" placeholder="请输入任务组" />
        </a-form-item>
        <a-form-item field="invokeTarget" label="调用目标字符串" required>
          <a-input v-model="editForm.invokeTarget" placeholder="请输入调用目标字符串" />
        </a-form-item>
        <a-form-item field="cronExpression" label="cron表达式" required>
          <a-input v-model="editForm.cronExpression" placeholder="请输入cron表达式" />
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-radio-group v-model="editForm.status">
            <a-radio value="0">正常</a-radio>
            <a-radio value="1">暂停</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="remark" label="备注">
          <a-textarea v-model="editForm.remark" placeholder="请输入备注信息" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import {
  IconPlus,
  IconPlayCircle,
  IconPauseCircle,
  IconRefresh,
  IconSearch,
  IconEdit,
  IconDelete,
  IconPlayArrowFill
} from '@arco-design/web-vue/es/icon'

// 搜索表单
const searchForm = reactive({
  taskName: '',
  status: ''
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

// 编辑表单
const editForm = reactive({
  id: '',
  taskName: '',
  taskGroup: '',
  invokeTarget: '',
  cronExpression: '',
  status: '0',
  remark: ''
})

// 控制编辑对话框显示
const editModalVisible = ref(false)

// 获取任务列表
const fetchTaskList = async () => {
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
          cronExpression: '0 0/30 * * * ?',
          status: '0',
          nextExecuteTime: '2023-06-01 12:30:00',
          selected: false
        },
        {
          id: '2',
          taskName: '数据库备份',
          taskGroup: 'BACKUP',
          invokeTarget: 'com.xhan.task.DatabaseBackupTask.execute()',
          cronExpression: '0 0 2 * * ?',
          status: '0',
          nextExecuteTime: '2023-06-02 02:00:00',
          selected: false
        },
        {
          id: '3',
          taskName: '临时文件清理',
          taskGroup: 'SYSTEM',
          invokeTarget: 'com.xhan.task.TempFileClearTask.execute()',
          cronExpression: '0 0 1 * * ?',
          status: '1',
          nextExecuteTime: '-',
          selected: false
        }
      ]
      pagination.total = 3
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取任务列表失败', error)
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchTaskList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.taskName = ''
  searchForm.status = ''
  handleSearch()
}

// 分页变化
const onPageChange = (page: number) => {
  pagination.current = page
  fetchTaskList()
}

// 每页条数变化
const onPageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  fetchTaskList()
}

// 编辑任务
const handleEdit = (record: any) => {
  Object.assign(editForm, record)
  editModalVisible.value = true
}

// 新增任务
const handleAdd = () => {
  // 重置表单
  Object.assign(editForm, {
    id: '',
    taskName: '',
    taskGroup: '',
    invokeTarget: '',
    cronExpression: '',
    status: '0',
    remark: ''
  })
  editModalVisible.value = true
}

// 保存任务
const handleSaveTask = async (done: Function) => {
  // 表单验证
  if (!editForm.taskName) {
    Message.error('请输入任务名称')
    done(false)
    return
  }
  if (!editForm.taskGroup) {
    Message.error('请输入任务组')
    done(false)
    return
  }
  if (!editForm.invokeTarget) {
    Message.error('请输入调用目标字符串')
    done(false)
    return
  }
  if (!editForm.cronExpression) {
    Message.error('请输入cron表达式')
    done(false)
    return
  }
  
  try {
    // 模拟API调用
    setTimeout(() => {
      Message.success(editForm.id ? '修改成功' : '新增成功')
      fetchTaskList()
      done(true)
    }, 500)
  } catch (error) {
    console.error('保存任务失败', error)
    done(false)
  }
}

// 切换任务状态
const handleToggleStatus = (record: any) => {
  const action = record.status === '0' ? '暂停' : '启动'
  Modal.confirm({
    title: `确认${action}`,
    content: `确定要${action}任务「${record.taskName}」吗？`,
    onOk: () => {
      // 模拟API调用
      setTimeout(() => {
        record.status = record.status === '0' ? '1' : '0'
        Message.success(`${action}成功`)
      }, 500)
    }
  })
}

// 执行一次
const handleExecuteOnce = (record: any) => {
  Modal.confirm({
    title: '确认执行',
    content: `确定要立即执行任务「${record.taskName}」吗？`,
    onOk: () => {
      // 模拟API调用
      setTimeout(() => {
        Message.success('执行成功')
      }, 500)
    }
  })
}

// 删除任务
const handleDelete = (record: any) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除任务「${record.taskName}」吗？`,
    onOk: () => {
      // 模拟API调用
      setTimeout(() => {
        tableData.value = tableData.value.filter((item: any) => item.id !== record.id)
        pagination.total--
        Message.success('删除成功')
      }, 500)
    }
  })
}

// 刷新数据
const refreshData = () => {
  Message.loading('正在获取任务列表...')
  try {
    fetchTaskList()
    Message.success('任务列表已更新')
  } catch (error) {
    console.error('刷新数据时出错:', error)
    Message.error('刷新数据时出错，请重试')
  }
}

// 组件挂载
