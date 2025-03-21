<template>
  <div class="user-container">
    <a-card class="general-card">
      <template #title>用户管理</template>
      
      <!-- 搜索表单 -->
      <a-form :model="searchForm" layout="inline" class="search-form">
        <a-form-item field="username" label="用户名">
          <a-input v-model="searchForm.username" placeholder="请输入用户名" allow-clear />
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-select v-model="searchForm.status" placeholder="请选择状态" allow-clear>
            <a-option value="1">启用</a-option>
            <a-option value="0">禁用</a-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="fetchUserList">查询</a-button>
            <a-button @click="resetSearch">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
      
      <!-- 操作按钮 -->
      <div class="operation-wrapper">
        <a-space>
          <a-button type="primary" @click="openUserModal('add')">
            <template #icon><icon-plus /></template>
            新增用户
          </a-button>
          <a-button @click="handleBatchDelete" :disabled="selectedKeys.length === 0">
            <template #icon><icon-delete /></template>
            批量删除
          </a-button>
          <a-button @click="fetchUserList">
            <template #icon><icon-refresh /></template>
            刷新
          </a-button>
        </a-space>
      </div>
      
      <!-- 用户列表 -->
      <a-table
        row-key="id"
        :data="userList"
        :loading="loading"
        :pagination="pagination"
        @page-change="onPageChange"
        @selection-change="onSelectionChange"
      >
        <template #columns>
          <a-table-column type="selection" width="40" />
          <a-table-column title="用户ID" data-index="id" width="80" />
          <a-table-column title="用户名" data-index="username" />
          <a-table-column title="昵称" data-index="nickname" />
          <a-table-column title="部门" data-index="department" />
          <a-table-column title="手机号" data-index="phone" />
          <a-table-column title="状态" data-index="status">
            <template #cell="{record}">
              <a-tag :color="record.status === '1' ? 'green' : 'red'">
                {{ record.status === '1' ? '启用' : '禁用' }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="创建时间" data-index="createTime" />
          <a-table-column title="操作" width="200">
            <template #cell="{record}">
              <a-space>
                <a-button type="text" size="small" @click="openUserModal('edit', record)">
                  <template #icon><icon-edit /></template>
                  编辑
                </a-button>
                <a-button type="text" size="small" @click="assignRoles(record)">
                  <template #icon><icon-user-group /></template>
                  分配角色
                </a-button>
                <a-popconfirm
                  content="确定要删除此用户吗？"
                  @ok="handleDelete(record)"
                >
                  <a-button type="text" status="danger" size="small">
                    <template #icon><icon-delete /></template>
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    
    <!-- 用户表单弹窗 -->
    <a-modal
      v-model:visible="userModalVisible"
      :title="modalTitle"
      @cancel="closeUserModal"
      @before-ok="handleSubmitUser"
    >
      <a-form :model="userForm" ref="userFormRef" :rules="userRules">
        <a-form-item field="username" label="用户名" required>
          <a-input v-model="userForm.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item field="nickname" label="昵称">
          <a-input v-model="userForm.nickname" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item field="password" label="密码" required v-if="modalType === 'add'">
          <a-input-password v-model="userForm.password" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item field="departmentId" label="部门">
          <a-select v-model="userForm.departmentId" placeholder="请选择部门">
            <a-option value="1">研发部</a-option>
            <a-option value="2">产品部</a-option>
            <a-option value="3">市场部</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="phone" label="手机号">
          <a-input v-model="userForm.phone" placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item field="email" label="邮箱">
          <a-input v-model="userForm.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item field="status" label="状态" required>
          <a-radio-group v-model="userForm.status">
            <a-radio value="1">启用</a-radio>
            <a-radio value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="remark" label="备注">
          <a-textarea v-model="userForm.remark" placeholder="请输入备注信息" />
        </a-form-item>
      </a-form>
    </a-modal>
    
    <!-- 角色分配弹窗 -->
    <a-modal
      v-model:visible="roleModalVisible"
      title="分配角色"
      @cancel="closeRoleModal"
      @before-ok="handleSubmitRoles"
    >
      <a-form :model="roleForm">
        <a-form-item field="roles" label="角色">
          <a-checkbox-group v-model="roleForm.roles">
            <a-checkbox value="1">超级管理员</a-checkbox>
            <a-checkbox value="2">普通管理员</a-checkbox>
            <a-checkbox value="3">测试人员</a-checkbox>
            <a-checkbox value="4">普通用户</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { 
  IconPlus, 
  IconDelete, 
  IconRefresh, 
  IconEdit, 
  IconUserGroup 
} from '@arco-design/web-vue/es/icon'

// 搜索表单
const searchForm = reactive({
  username: '',
  status: undefined
})

// 重置搜索
const resetSearch = () => {
  searchForm.username = ''
  searchForm.status = undefined
  fetchUserList()
}

// 用户列表数据
const userList = ref([
  {
    id: 1,
    username: 'admin',
    nickname: '系统管理员',
    department: '研发部',
    phone: '13800138000',
    email: 'admin@example.com',
    status: '1',
    createTime: '2023-01-01 10:00:00'
  },
  {
    id: 2,
    username: 'test',
    nickname: '测试用户',
    department: '测试部',
    phone: '13800138001',
    email: 'test@example.com',
    status: '1',
    createTime: '2023-01-02 11:00:00'
  },
  {
    id: 3,
    username: 'disabled',
    nickname: '禁用用户',
    department: '市场部',
    phone: '13800138002',
    email: 'disabled@example.com',
    status: '0',
    createTime: '2023-01-03 12:00:00'
  }
])

// 加载状态
const loading = ref(false)

// 分页配置
const pagination = reactive({
  total: 100,
  current: 1,
  pageSize: 10,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [10, 20, 50, 100]
})

// 页码变化
const onPageChange = (page: number) => {
  pagination.current = page
  fetchUserList()
}

// 选中的用户
const selectedKeys = ref<string[]>([])

// 选择变化
const onSelectionChange = (keys: string[]) => {
  selectedKeys.value = keys
}

// 获取用户列表
const fetchUserList = () => {
  loading.value = true
  // 模拟请求
  setTimeout(() => {
    loading.value = false
    // 这里应该是请求后端API
  }, 500)
}

// 用户表单弹窗
const userModalVisible = ref(false)
const modalType = ref<'add' | 'edit'>('add')
const modalTitle = computed(() => modalType.value === 'add' ? '新增用户' : '编辑用户')

// 用户表单
const userForm = reactive({
  id: undefined,
  username: '',
  nickname: '',
  password: '',
  departmentId: undefined,
  phone: '',
  email: '',
  status: '1',
  remark: ''
})

// 用户表单校验规则
const userRules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
  status: [{ required: true, message: '请选择状态' }]
}

const userFormRef = ref()

// 打开用户弹窗
const openUserModal = (type: 'add' | 'edit', record?: any) => {
  modalType.value = type
  resetUserForm()
  
  if (type === 'edit' && record) {
    // 编辑模式下填充表单
    Object.keys(userForm).forEach(key => {
      if (record[key] !== undefined) {
        userForm[key as keyof typeof userForm] = record[key]
      }
    })
  }
  
  userModalVisible.value = true
}

// 重置用户表单
const resetUserForm = () => {
  userForm.id = undefined
  userForm.username = ''
  userForm.nickname = ''
  userForm.password = ''
  userForm.departmentId = undefined
  userForm.phone = ''
  userForm.email = ''
  userForm.status = '1'
  userForm.remark = ''
}

// 关闭用户弹窗
const closeUserModal = () => {
  userModalVisible.value = false
  resetUserForm()
}

// 提交用户表单
const handleSubmitUser = (done: () => void) => {
  userFormRef.value.validate((errors: any) => {
    if (!errors) {
      // 提交表单
      const action = modalType.value === 'add' ? '新增' : '更新'
      
      // 模拟请求
      setTimeout(() => {
        Message.success(`${action}用户成功`)
        fetchUserList()
        done()
      }, 500)
    } else {
      done(false)
    }
  })
}

// 删除用户
const handleDelete = (record: any) => {
  // 模拟请求
  setTimeout(() => {
    Message.success(`删除用户 ${record.username} 成功`)
    fetchUserList()
  }, 500)
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedKeys.value.length === 0) {
    Message.warning('请至少选择一条记录')
    return
  }
  
  // 模拟请求
  setTimeout(() => {
    Message.success(`批量删除 ${selectedKeys.value.length} 个用户成功`)
    selectedKeys.value = []
    fetchUserList()
  }, 500)
}

// 角色分配弹窗
const roleModalVisible = ref(false)
const currentUser = ref<any>(null)

// 角色表单
const roleForm = reactive({
  userId: undefined,
  roles: [] as string[]
})

// 打开角色分配弹窗
const assignRoles = (record: any) => {
  currentUser.value = record
  roleForm.userId = record.id
  roleForm.roles = ['2'] // 默认设置为普通管理员角色，实际应该从API获取
  roleModalVisible.value = true
}

// 关闭角色弹窗
const closeRoleModal = () => {
  roleModalVisible.value = false
  currentUser.value = null
  roleForm.userId = undefined
  roleForm.roles = []
}

// 提交角色分配
const handleSubmitRoles = (done: () => void) => {
  // 模拟请求
  setTimeout(() => {
    Message.success(`已成功为用户 ${currentUser.value?.username} 分配角色`)
    done()
  }, 500)
}

// 组件挂载
onMounted(() => {
  fetchUserList()
})
</script>

<style lang="scss" scoped>
.user-container {
  padding: 0;
  
  .search-form {
    margin-bottom: 16px;
  }
  
  .operation-wrapper {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style> 