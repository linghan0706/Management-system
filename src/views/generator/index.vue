<template>
  <div class="generator-container">
    <a-card title="代码生成器" :bordered="false">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="refreshTableList">
            <template #icon><icon-refresh /></template>
            刷新
          </a-button>
        </a-space>
      </template>
      
      <a-table
        :data="tableList"
        :loading="loading"
        :pagination="pagination"
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column title="序号" width="80">
            <template #cell="{ rowIndex }">
              {{ (pagination.current - 1) * pagination.pageSize + rowIndex + 1 }}
            </template>
          </a-table-column>
          <a-table-column title="表名称" data-index="tableName" />
          <a-table-column title="表描述" data-index="tableComment" />
          <a-table-column title="创建时间" data-index="createTime" />
          <a-table-column title="更新时间" data-index="updateTime" />
          <a-table-column title="操作" width="250">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" @click="handlePreview(record)">
                  <template #icon><icon-eye /></template>
                  预览
                </a-button>
                <a-button type="text" @click="handleEdit(record)">
                  <template #icon><icon-edit /></template>
                  编辑
                </a-button>
                <a-button type="text" status="success" @click="handleGenerate(record)">
                  <template #icon><icon-code /></template>
                  生成代码
                </a-button>
                <a-button type="text" status="warning" @click="handleDownload(record)">
                  <template #icon><icon-download /></template>
                  下载
                </a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    
    <!-- 预览代码对话框 -->
    <a-modal
      v-model:visible="previewVisible"
      title="预览代码"
      width="800px"
      :footer="false"
    >
      <a-tabs>
        <a-tab-pane key="entity" title="实体类">
          <a-typography-paragraph>
            <pre>{{ previewData.entity || '暂无数据' }}</pre>
          </a-typography-paragraph>
        </a-tab-pane>
        <a-tab-pane key="mapper" title="Mapper">
          <a-typography-paragraph>
            <pre>{{ previewData.mapper || '暂无数据' }}</pre>
          </a-typography-paragraph>
        </a-tab-pane>
        <a-tab-pane key="service" title="Service">
          <a-typography-paragraph>
            <pre>{{ previewData.service || '暂无数据' }}</pre>
          </a-typography-paragraph>
        </a-tab-pane>
        <a-tab-pane key="controller" title="Controller">
          <a-typography-paragraph>
            <pre>{{ previewData.controller || '暂无数据' }}</pre>
          </a-typography-paragraph>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { getTableList, previewCode, downloadCode } from '@/api/generator'
import type { TableInfo } from '@/types/generator'
import {
  IconRefresh,
  IconEye,
  IconEdit,
  IconCode,
  IconDownload
} from '@arco-design/web-vue/es/icon'

const router = useRouter()

// 表格数据
const tableList = ref<TableInfo[]>([])
const loading = ref(false)

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
})

// 预览相关
const previewVisible = ref(false)
const previewData = ref<Record<string, string>>({})

// 获取表格数据
const fetchTableList = async () => {
  loading.value = true
  try {
    const res = await getTableList()
    tableList.value = res.data || []
    pagination.total = tableList.value.length
  } catch (error) {
    console.error('获取表格数据失败', error)
    Message.error('获取表格数据失败')
  } finally {
    loading.value = false
  }
}

// 刷新表格数据
const refreshTableList = () => {
  pagination.current = 1
  fetchTableList()
}

// 分页变化
const onPageChange = (page: number) => {
  pagination.current = page
}

// 预览代码
const handlePreview = async (record: TableInfo) => {
  try {
    const res = await previewCode({ tableName: record.tableName })
    previewData.value = res.data || {}
    previewVisible.value = true
  } catch (error) {
    console.error('预览代码失败', error)
    Message.error('预览代码失败')
  }
}

// 编辑配置
const handleEdit = (record: TableInfo) => {
  router.push(`/generator/config?tableName=${record.tableName}`)
}

// 生成代码
const handleGenerate = async (record: TableInfo) => {
  router.push(`/generator/config?tableName=${record.tableName}&action=generate`)
}

// 下载代码
const handleDownload = async (record: TableInfo) => {
  try {
    const res = await downloadCode(record.tableName)
    
    // 创建下载链接
    const blob = new Blob([res], { type: 'application/zip' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${record.tableName}.zip`
    link.click()
    URL.revokeObjectURL(link.href)
    
    Message.success('下载成功')
  } catch (error) {
    console.error('下载代码失败', error)
    Message.error('下载代码失败')
  }
}

onMounted(() => {
  fetchTableList()
})
</script>

<style scoped>
.generator-container {
  padding: 16px;
}
</style>