<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'

// 用户列表数据
const users = ref([
  {
    id: 1,
    username: 'admin',
    name: '管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    status: 1,
    role: '管理员',
    createTime: '2023-01-01 10:00:00'
  },
  {
    id: 2,
    username: 'editor',
    name: '编辑人员',
    email: 'editor@example.com',
    phone: '13800138001',
    status: 1,
    role: '编辑',
    createTime: '2023-01-02 11:30:00'
  },
  {
    id: 3,
    username: 'tester',
    name: '测试人员',
    email: 'tester@example.com',
    phone: '13800138002',
    status: 0,
    role: '测试',
    createTime: '2023-01-03 09:15:00'
  },
  {
    id: 4,
    username: 'viewer',
    name: '访客用户',
    email: 'viewer@example.com',
    phone: '13800138003',
    status: 1,
    role: '访客',
    createTime: '2023-01-04 14:20:00'
  },
  {
    id: 5,
    username: 'user1',
    name: '普通用户1',
    email: 'user1@example.com',
    phone: '13800138004',
    status: 1,
    role: '用户',
    createTime: '2023-01-05 16:45:00'
  }
])

// 搜索表单
const searchForm = reactive({
  username: '',
  status: null,
  role: null
})

// 重置搜索表单
const resetSearch = () => {
  searchForm.username = ''
  searchForm.status = null
  searchForm.role = null
}

// 表格分页
const pagination = reactive({
  total: 100,
  current: 1,
  pageSize: 10,
  showTotal: true,
  showJumper: true,
  showPageSize: true
})

// 表格加载状态
const loading = ref(false)

// 角色选项
const roleOptions = [
  { label: '管理员', value: '管理员' },
  { label: '编辑', value: '编辑' },
  { label: '测试', value: '测试' },
  { label: '访客', value: '访客' },
  { label: '用户', value: '用户' }
]

// 状态选项
const statusOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
]

// 表格列配置
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 70
  },
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '邮箱',
    dataIndex: 'email'
  },
  {
    title: '手机号',
    dataIndex: 'phone'
  },
  {
    title: '角色',
    dataIndex: 'role',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    slotName: 'status'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180
  },
  {
    title: '操作',
    dataIndex: 'operations',
    width: 160,
    slotName: 'operations',
    fixed: 'right'
  }
]

// 用户表单
const userForm = reactive({
  id: 0,
  username: '',
  name: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: '',
  status: 1,
  role: ''
})

// 表单规则
const rules = {
  username: [
    { required: true, message: '请输入用户名' },
    { minLength: 3, message: '用户名长度不能小于3位' }
  ],
  name: [{ required: true, message: '请输入姓名' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { minLength: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (value: string, cb: (error?: string) => void) => {
        if (value !== userForm.password) {
          cb('两次输入的密码不一致')
        } else {
          cb()
        }
      },
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    {
      match: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
      message: '邮箱格式不正确'
    }
  ],
  phone: [
    { required: true, message: '请输入手机号' },
    { match: /^1[3456789]\d{9}$/, message: '手机号格式不正确' }
  ],
  role: [{ required: true, message: '请选择角色' }]
}

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('添加用户')
const confirmLoading = ref(false)
const isEdit = ref(false)
const userFormRef = ref()

// 打开添加对话框
const openAddDialog = () => {
  resetUserForm()
  isEdit.value = false
  dialogTitle.value = '添加用户'
  dialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = (record: any) => {
  resetUserForm()
  isEdit.value = true
  dialogTitle.value = '编辑用户'
  
  Object.keys(userForm).forEach(key => {
    if (key in record) {
      userForm[key] = record[key]
    }
  })
  
  // 编辑时不需要修改密码
  userForm.password = ''
  userForm.confirmPassword = ''
  
  dialogVisible.value = true
}

// 重置用户表单
const resetUserForm = () => {
  userForm.id = 0
  userForm.username = ''
  userForm.name = ''
  userForm.password = ''
  userForm.confirmPassword = ''
  userForm.email = ''
  userForm.phone = ''
  userForm.status = 1
  userForm.role = ''
}

// 提交表单
const handleSubmit = async () => {
  try {
    await userFormRef.value.validate()
    
    confirmLoading.value = true
    
    // 模拟API请求
    setTimeout(() => {
      if (isEdit.value) {
        // 编辑用户
        const index = users.value.findIndex(item => item.id === userForm.id)
        if (index !== -1) {
          users.value[index] = { ...users.value[index], ...userForm }
        }
        Message.success('修改成功')
      } else {
        // 添加用户
        const newUser = {
          ...userForm,
          id: users.value.length + 1,
          createTime: new Date().toLocaleString()
        }
        users.value.unshift(newUser)
        Message.success('添加成功')
      }
      
      confirmLoading.value = false
      dialogVisible.value = false
    }, 1000)
  } catch (error) {
    console.error('表单验证失败', error)
  }
}

// 删除用户
const handleDelete = (record: any) => {
  const content = `确定要删除用户 <span style="color: #ff4d4f">${record.username}</span> 吗？删除后不可恢复。`
  
  Message.warning({
    title: '确认删除',
    content,
    modal: true,
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      // 模拟删除
      const index = users.value.findIndex(item => item.id === record.id)
      if (index !== -1) {
        users.value.splice(index, 1)
        Message.success('删除成功')
      }
    }
  })
}

// 修改用户状态
const handleStatusChange = (record: any) => {
  record.status = record.status === 1 ? 0 : 1
  Message.success(`已${record.status === 1 ? '启用' : '禁用'}用户: ${record.username}`)
}

// 搜索
const handleSearch = () => {
  loading.value = true
  // 模拟搜索
  setTimeout(() => {
    loading.value = false
  }, 800)
}
</script>

<template>
  <div class="user-container">
    <a-card class="general-card" title="用户管理">
      <!-- 搜索区域 -->
      <div class="search-area">
        <a-form :model="searchForm" layout="inline">
          <a-form-item field="username" label="用户名">
            <a-input v-model="searchForm.username" placeholder="请输入用户名" allow-clear />
          </a-form-item>
          <a-form-item field="status" label="状态">
            <a-select v-model="searchForm.status" placeholder="请选择状态" allow-clear style="width: 120px">
              <a-option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="role" label="角色">
            <a-select v-model="searchForm.role" placeholder="请选择角色" allow-clear style="width: 120px">
              <a-option v-for="option in roleOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" @click="handleSearch">
                <template #icon><icon-search /></template>
                搜索
              </a-button>
              <a-button @click="resetSearch">
                <template #icon><icon-refresh /></template>
                重置
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
      
      <!-- 操作按钮区域 -->
      <div class="button-area">
        <a-button type="primary" @click="openAddDialog">
          <template #icon><icon-plus /></template>
          添加用户
        </a-button>
      </div>
      
      <!-- 表格区域 -->
      <a-table
        :loading="loading"
        :data="users"
        :bordered="false"
        :pagination="pagination"
        :scroll="{ x: 1200 }"
        :columns="columns"
        row-key="id"
      >
        <!-- 状态列插槽 -->
        <template #status="{ record }">
          <a-tag :color="record.status === 1 ? 'green' : 'red'">
            {{ record.status === 1 ? '启用' : '禁用' }}
          </a-tag>
        </template>
        
        <!-- 操作列插槽 -->
        <template #operations="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="openEditDialog(record)">
              <icon-edit />
              编辑
            </a-button>
            <a-divider direction="vertical" />
            <a-button type="text" size="small" status="warning" @click="handleStatusChange(record)">
              <icon-swap />
              {{ record.status === 1 ? '禁用' : '启用' }}
            </a-button>
            <a-divider direction="vertical" />
            <a-button type="text" size="small" status="danger" @click="handleDelete(record)">
              <icon-delete />
              删除
            </a-button>
          </a-space>
        </template>
      </a-table>
      
      <!-- 用户表单对话框 -->
      <a-modal
        v-model:visible="dialogVisible"
        :title="dialogTitle"
        :ok-loading="confirmLoading"
        @ok="handleSubmit"
        @cancel="dialogVisible = false"
      >
        <a-form
          ref="userFormRef"
          :model="userForm"
          :rules="rules"
          layout="vertical"
        >
          <a-form-item field="username" label="用户名">
            <a-input v-model="userForm.username" placeholder="请输入用户名" :disabled="isEdit" />
          </a-form-item>
          <a-form-item field="name" label="姓名">
            <a-input v-model="userForm.name" placeholder="请输入姓名" />
          </a-form-item>
          
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="password" label="密码" :disabled="isEdit">
                <a-input-password
                  v-model="userForm.password"
                  placeholder="请输入密码"
                  :disabled="isEdit"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="confirmPassword" label="确认密码" :disabled="isEdit">
                <a-input-password
                  v-model="userForm.confirmPassword"
                  placeholder="请确认密码"
                  :disabled="isEdit"
                />
              </a-form-item>
            </a-col>
          </a-row>
          
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="email" label="邮箱">
                <a-input v-model="userForm.email" placeholder="请输入邮箱" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="phone" label="手机号">
                <a-input v-model="userForm.phone" placeholder="请输入手机号" />
              </a-form-item>
            </a-col>
          </a-row>
          
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="role" label="角色">
                <a-select v-model="userForm.role" placeholder="请选择角色">
                  <a-option v-for="option in roleOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="status" label="状态">
                <a-radio-group v-model="userForm.status">
                  <a-radio :value="1">启用</a-radio>
                  <a-radio :value="0">禁用</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<style lang="scss" scoped>
.user-container {
  padding: 16px;
  
  .general-card {
    margin-bottom: 16px;
    
    .search-area {
      margin-bottom: 16px;
    }
    
    .button-area {
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

@media (max-width: 768px) {
  .user-container {
    .general-card {
      .search-area {
        :deep(.arco-form-layout-inline) {
          .arco-form-item {
            margin-right: 0;
            margin-bottom: 16px;
            width: 100%;
          }
        }
      }
    }
  }
}
</style> 