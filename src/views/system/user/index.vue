<template>
  <div class="user-container">
    <a-card class="general-card" title="用户管理">
      <template #extra>
        <a-button type="primary">
          <template #icon><icon-plus /></template>
          新增用户
        </a-button>
      </template>
      <a-table :columns="columns" :data="userData" :pagination="pagination" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'

const columns = [
  {
    title: '用户ID',
    dataIndex: 'id'
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
    title: '手机号',
    dataIndex: 'phone'
  },
  {
    title: '角色',
    dataIndex: 'role'
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  },
  {
    title: '操作',
    slotName: 'operations'
  }
]

const userData = ref([
  {
    id: 1,
    username: 'admin',
    name: '系统管理员',
    phone: '13800138000',
    role: '超级管理员',
    status: 1,
    createTime: '2023-01-01 12:00:00'
  },
  {
    id: 2,
    username: 'test',
    name: '测试用户',
    phone: '13800138001',
    role: '普通用户',
    status: 1,
    createTime: '2023-01-02 12:00:00'
  }
])

const pagination = {
  pageSize: 10,
  current: 1,
  total: 2
}
</script>

<style lang="scss" scoped>
.user-container {
  .general-card {
    margin-bottom: 16px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style> 