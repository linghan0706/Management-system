<template>
  <div class="online-users-container">
    <a-card class="online-users-card" title="在线用户">
      <template #extra>
        <a-space>
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
        <a-form-item field="userName" label="用户名称">
          <a-input v-model="searchForm.userName" placeholder="请输入用户名称" allow-clear />
        </a-form-item>
        <a-form-item field="ipaddr" label="登录地址">
          <a-input v-model="searchForm.ipaddr" placeholder="请输入登录地址" allow-clear />
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
        row-key="sessionId"
        class="online-table"
      >
        <template #columns>
          <a-table-column title="#" width="60">
            <template #cell="{ rowIndex }">
              {{ (pagination.current - 1) * pagination.pageSize + rowIndex + 1 }}
            </template>
          </a-table-column>
          <a-table-column title="会话编号" data-index="sessionId" />
          <a-table-column title="用户名称" data-index="userName" />
          <a-table-column title="部门名称" data-index="deptName" />
          <a-table-column title="登录地址" data-index="ipaddr" />
          <a-table-column title="登录地点" data-index="loginLocation" />
          <a-table-column title="浏览器" data-index="browser" />
          <a-table-column title="操作系统" data-index="os" />
          <a-table-column title="登录时间" data-index="loginTime" />
          <a-table-column title="操作" width="100">
            <template #cell="{ record }">
              <a-button type="text" size="small" status="danger" @click="handleForceLogout(record)">
                <template #icon>
                  <icon-poweroff />
                </template>
                强退
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import {
  IconRefresh,
  IconSearch,
  IconPoweroff
} from '@arco-design/web-vue/es/icon'

// 搜索表单
const searchForm = reactive({
  userName: '',
  ipaddr: ''
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

// 获取在线用户列表
const fetchOnlineUsers = async () => {
  loading.value = true
  try {
    // 这里添加获取在线用户的API调用
    // 模拟数据
    setTimeout(() => {
      tableData.value = []
      pagination.total = 0
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取在线用户失败', error)
    Message.error('获取在线用户失败，请稍后重试')
    tableData.value = []
    pagination.total = 0
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchOnlineUsers()
}

// 重置搜索
const resetSearch = () => {
  searchForm.userName = ''
  searchForm.ipaddr = ''
  handleSearch()
}

// 分页变化
const onPageChange = (page: number) => {
  pagination.current = page
  fetchOnlineUsers()
}

// 每页条数变化
const onPageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  fetchOnlineUsers()
}

// 强制退出
const handleForceLogout = (record: any) => {
  Modal.confirm({
    title: '确认强退',
    content: `确定要强制退出用户 ${record.userName} 吗？`,
    onOk: async () => {
      try {
        // 这里添加强制退出的API调用
        Message.success('强制退出成功')
        fetchOnlineUsers()
      } catch (error) {
        console.error('强制退出失败', error)
        Message.error('强制退出失败，请稍后重试')
      }
    }
  })
}

// 刷新数据
const refreshData = () => {
  fetchOnlineUsers()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchOnlineUsers()
})
</script>

<style lang="scss" scoped>
.online-users-container {
  padding: 16px;
  
  .online-users-card {
    width: 100%;
  }
  
  .search-form {
    margin-bottom: 16px;
  }
}
</style>