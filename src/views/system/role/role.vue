<template>
  <div class="role-container">
    <a-card class="general-card">
      <template #title>角色管理</template>
      
      <!-- 搜索表单 -->
      <a-form :model="searchForm" layout="inline" class="search-form">
        <a-form-item field="roleName" label="角色名称">
          <a-input v-model="searchForm.roleName" placeholder="请输入角色名称" allow-clear />
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-select v-model="searchForm.status" placeholder="请选择状态" allow-clear>
            <a-option value="1">正常</a-option>
            <a-option value="0">停用</a-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="fetchRoleList">查询</a-button>
            <a-button @click="resetSearch">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
      
      <!-- 操作按钮 -->
      <div class="operation-wrapper">
        <a-space>
          <a-button type="primary" @click="openRoleModal('add')">
            <template #icon><icon-plus /></template>
            新增角色
          </a-button>
          <a-button @click="handleBatchDelete" :disabled="selectedKeys.length === 0">
            <template #icon><icon-delete /></template>
            批量删除
          </a-button>
          <a-button @click="fetchRoleList">
            <template #icon><icon-refresh /></template>
            刷新
          </a-button>
        </a-space>
      </div>
      
      <!-- 角色列表 -->
      <a-table
        row-key="id"
        :data="roleList"
        :loading="loading"
        :pagination="pagination"
        @page-change="onPageChange"
        @selection-change="onSelectionChange"
      >
        <template #columns>
          <a-table-column type="selection" width="40" />
          <a-table-column title="角色编号" data-index="id" width="80" />
          <a-table-column title="角色名称" data-index="roleName" />
          <a-table-column title="权限字符" data-index="roleKey" />
          <a-table-column title="显示顺序" data-index="orderNum" width="80" />
          <a-table-column title="状态" data-index="status">
            <template #cell="{record}">
              <a-tag :color="record.status === '1' ? 'green' : 'red'">
                {{ record.status === '1' ? '正常' : '停用' }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="创建时间" data-index="createTime" />
          <a-table-column title="操作" width="250">
            <template #cell="{record}">
              <a-space>
                <a-button type="text" size="small" @click="openRoleModal('edit', record)">
                  <template #icon><icon-edit /></template>
                  编辑
                </a-button>
                <a-button type="text" size="small" @click="assignPermissions(record)">
                  <template #icon><icon-select-all /></template>
                  分配权限
                </a-button>
                <a-button type="text" size="small" @click="viewUser(record)">
                  <template #icon><icon-user /></template>
                  用户
                </a-button>
                <a-popconfirm
                  content="确定要删除此角色吗？"
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
    
    <!-- 角色表单弹窗 -->
    <a-modal
      v-model:visible="roleModalVisible"
      :title="modalTitle"
      @cancel="closeRoleModal"
      @before-ok="handleSubmitRole"
    >
      <a-form :model="roleForm" ref="roleFormRef" :rules="roleRules">
        <a-form-item field="roleName" label="角色名称" required>
          <a-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </a-form-item>
        <a-form-item field="roleKey" label="权限字符" required>
          <a-input v-model="roleForm.roleKey" placeholder="请输入权限字符" />
        </a-form-item>
        <a-form-item field="orderNum" label="显示顺序" required>
          <a-input-number v-model="roleForm.orderNum" placeholder="请输入显示顺序" style="width: 100%" />
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-radio-group v-model="roleForm.status">
            <a-radio value="1">正常</a-radio>
            <a-radio value="0">停用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="remark" label="备注">
          <a-textarea v-model="roleForm.remark" placeholder="请输入角色备注" />
        </a-form-item>
      </a-form>
    </a-modal>
    
    <!-- 权限分配弹窗 -->
    <a-modal
      v-model:visible="permissionModalVisible"
      title="分配权限"
      @cancel="closePermissionModal"
      @before-ok="handleSubmitPermissions"
    >
      <a-form :model="permissionForm">
        <a-form-item field="roleId" label="角色名称">
          <a-input v-model="currentRole.roleName" disabled />
        </a-form-item>
        <a-form-item field="permissions" label="权限分配">
          <a-tree
            :data="permissionTree"
            v-model:checked-keys="permissionForm.checkedKeys"
            checkable
            :check-strictly="false"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    
    <!-- 角色用户弹窗 -->
    <a-modal
      v-model:visible="userModalVisible"
      title="角色用户"
      @cancel="closeUserModal"
    >
      <a-table
        row-key="id"
        :data="roleUserList"
        :loading="userLoading"
        :pagination="userPagination"
      >
        <template #columns>
          <a-table-column title="用户编号" data-index="id" />
          <a-table-column title="用户名称" data-index="username" />
          <a-table-column title="用户昵称" data-index="nickname" />
          <a-table-column title="部门" data-index="department" />
          <a-table-column title="电话" data-index="phone" />
          <a-table-column title="操作">
            <template #cell="{record}">
              <a-popconfirm
                content="确定要移除该用户的角色吗？"
                @ok="removeRoleFromUser(record)"
              >
                <a-button type="text" status="danger" size="small">
                  <template #icon><icon-delete /></template>
                  移除
                </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
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
  IconSelectAll, 
  IconUser
} from '@arco-design/web-vue/es/icon'

// 搜索表单
const searchForm = reactive({
  roleName: '',
  status: undefined
})

// 重置搜索
const resetSearch = () => {
  searchForm.roleName = ''
  searchForm.status = undefined
  fetchRoleList()
}

// 角色列表数据
const roleList = ref([
  {
    id: 1,
    roleName: '超级管理员',
    roleKey: 'admin',
    orderNum: 1,
    status: '1',
    createTime: '2023-01-01 10:00:00',
    remark: '超级管理员'
  },
  {
    id: 2,
    roleName: '普通角色',
    roleKey: 'common',
    orderNum: 2,
    status: '1',
    createTime: '2023-01-02 10:00:00',
    remark: '普通角色'
  },
  {
    id: 3,
    roleName: '访客',
    roleKey: 'visitor',
    orderNum: 3,
    status: '0',
    createTime: '2023-01-03 10:00:00',
    remark: '只读权限'
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
  fetchRoleList()
}

// 选中的角色
const selectedKeys = ref<string[]>([])

// 选择变化
const onSelectionChange = (keys: string[]) => {
  selectedKeys.value = keys
}

// 获取角色列表
const fetchRoleList = () => {
  loading.value = true
  // 模拟请求
  setTimeout(() => {
    loading.value = false
    // 这里应该是请求后端API
  }, 500)
}

// 角色表单弹窗
const roleModalVisible = ref(false)
const modalType = ref<'add' | 'edit'>('add')
const modalTitle = computed(() => modalType.value === 'add' ? '新增角色' : '编辑角色')

// 角色表单
const roleForm = reactive({
  id: undefined,
  roleName: '',
  roleKey: '',
  orderNum: 1,
  status: '1',
  remark: ''
})

// 角色表单校验规则
const roleRules = {
  roleName: [{ required: true, message: '请输入角色名称' }],
  roleKey: [{ required: true, message: '请输入权限字符' }],
  orderNum: [{ required: true, message: '请输入显示顺序' }]
}

const roleFormRef = ref()

// 打开角色弹窗
const openRoleModal = (type: 'add' | 'edit', record?: any) => {
  modalType.value = type
  resetRoleForm()
  
  if (type === 'edit' && record) {
    // 编辑模式下填充表单
    Object.keys(roleForm).forEach(key => {
      if (record[key] !== undefined) {
        roleForm[key as keyof typeof roleForm] = record[key]
      }
    })
  }
  
  roleModalVisible.value = true
}

// 重置角色表单
const resetRoleForm = () => {
  roleForm.id = undefined
  roleForm.roleName = ''
  roleForm.roleKey = ''
  roleForm.orderNum = 1
  roleForm.status = '1'
  roleForm.remark = ''
}

// 关闭角色弹窗
const closeRoleModal = () => {
  roleModalVisible.value = false
  resetRoleForm()
}

// 提交角色表单
const handleSubmitRole = (done: (closed: boolean) => void) => {
  roleFormRef.value.validate((errors: any) => {
    if (!errors) {
      // 提交表单
      const action = modalType.value === 'add' ? '新增' : '更新'
      
      // 模拟请求
      setTimeout(() => {
        Message.success(`${action}角色成功`)
        fetchRoleList()
        done(true)
      }, 500)
    } else {
      done(false)
    }
  })
}

// 删除角色
const handleDelete = (record: any) => {
  // 模拟请求
  setTimeout(() => {
    Message.success(`删除角色 ${record.roleName} 成功`)
    fetchRoleList()
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
    Message.success(`批量删除 ${selectedKeys.value.length} 个角色成功`)
    selectedKeys.value = []
    fetchRoleList()
  }, 500)
}

// 权限分配弹窗
const permissionModalVisible = ref(false)
const currentRole = ref<any>({})

// 权限树形数据
const permissionTree = ref([
  {
    title: '系统管理',
    key: 'system',
    children: [
      { title: '用户管理', key: 'system:user', children: [
        { title: '用户查询', key: 'system:user:list' },
        { title: '用户新增', key: 'system:user:add' },
        { title: '用户修改', key: 'system:user:edit' },
        { title: '用户删除', key: 'system:user:delete' }
      ]},
      { title: '角色管理', key: 'system:role', children: [
        { title: '角色查询', key: 'system:role:list' },
        { title: '角色新增', key: 'system:role:add' },
        { title: '角色修改', key: 'system:role:edit' },
        { title: '角色删除', key: 'system:role:delete' }
      ]},
      { title: '菜单管理', key: 'system:menu', children: [
        { title: '菜单查询', key: 'system:menu:list' },
        { title: '菜单新增', key: 'system:menu:add' },
        { title: '菜单修改', key: 'system:menu:edit' },
        { title: '菜单删除', key: 'system:menu:delete' }
      ]}
    ]
  },
  {
    title: '系统监控',
    key: 'monitor',
    children: [
      { title: '在线用户', key: 'monitor:online:list' },
      { title: '定时任务', key: 'monitor:job:list' },
      { title: '服务监控', key: 'monitor:server:list' },
      { title: '操作日志', key: 'monitor:log:list' }
    ]
  }
])

// 权限表单
const permissionForm = reactive({
  roleId: undefined,
  checkedKeys: [] as string[]
})

// 打开权限分配弹窗
const assignPermissions = (record: any) => {
  currentRole.value = record
  permissionForm.roleId = record.id
  
  // 模拟获取已有权限
  if (record.id === 1) {
    // 超管拥有所有权限
    permissionForm.checkedKeys = ['system', 'system:user', 'system:role', 'system:menu', 'monitor']
  } else if (record.id === 2) {
    // 普通角色部分权限
    permissionForm.checkedKeys = ['system:user:list', 'system:role:list', 'system:menu:list', 'monitor:log:list']
  } else {
    // 访客基本查看权限
    permissionForm.checkedKeys = ['system:user:list', 'monitor:log:list']
  }
  
  permissionModalVisible.value = true
}

// 关闭权限弹窗
const closePermissionModal = () => {
  permissionModalVisible.value = false
  currentRole.value = {}
  permissionForm.roleId = undefined
  permissionForm.checkedKeys = []
}

// 提交权限分配
const handleSubmitPermissions = (done: (closed: boolean) => void) => {
  // 模拟请求
  setTimeout(() => {
    Message.success(`已成功为角色 ${currentRole.value?.roleName} 分配权限`)
    done(true)
  }, 500)
}

// 角色用户相关
const userModalVisible = ref(false)
const roleUserList = ref([])
const userLoading = ref(false)
const userPagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  showTotal: true
})

// 查看角色用户
const viewUser = (record: any) => {
  currentRole.value = record
  userLoading.value = true
  userModalVisible.value = true
  
  // 模拟请求角色下的用户
  setTimeout(() => {
    roleUserList.value = [
      {
        id: 1,
        username: 'admin',
        nickname: '系统管理员',
        department: '研发部',
        phone: '13800138000'
      },
      {
        id: 2,
        username: 'test',
        nickname: '测试用户',
        department: '测试部',
        phone: '13800138001'
      }
    ]
    userPagination.total = 2
    userLoading.value = false
  }, 500)
}

// 关闭用户弹窗
const closeUserModal = () => {
  userModalVisible.value = false
  currentRole.value = {}
  roleUserList.value = []
}

// 移除用户角色
const removeRoleFromUser = (record: any) => {
  // 模拟请求
  setTimeout(() => {
    Message.success(`已成功移除用户 ${record.username} 的 ${currentRole.value?.roleName} 角色`)
    
    // 更新列表
    roleUserList.value = roleUserList.value.filter((item: any) => item.id !== record.id)
    userPagination.total -= 1
  }, 500)
}

// 组件挂载
onMounted(() => {
  fetchRoleList()
})
</script>

<style lang="scss" scoped>
.role-container {
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