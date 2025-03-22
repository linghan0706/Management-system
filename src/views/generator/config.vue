<template>
  <div class="generator-config-container">
    <a-card title="代码生成配置" :bordered="false">
      <template #extra>
        <a-space>
          <a-button @click="goBack">
            <template #icon><icon-left /></template>
            返回
          </a-button>
          <a-button type="primary" @click="handleSave">
            <template #icon><icon-save /></template>
            保存
          </a-button>
          <a-button type="primary" status="success" @click="handleGenerate">
            <template #icon><icon-code /></template>
            生成代码
          </a-button>
        </a-space>
      </template>
      
      <a-form :model="formData" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="tableName" label="表名称" required>
              <a-input v-model="formData.tableName" placeholder="请输入表名称" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="tableComment" label="表描述" required>
              <a-input v-model="formData.tableComment" placeholder="请输入表描述" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="moduleName" label="模块名称" required>
              <a-input v-model="formData.moduleName" placeholder="请输入模块名称" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="businessName" label="业务名称" required>
              <a-input v-model="formData.businessName" placeholder="请输入业务名称" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="packageName" label="包名称" required>
              <a-input v-model="formData.packageName" placeholder="请输入包名称" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="authorName" label="作者" required>
              <a-input v-model="formData.authorName" placeholder="请输入作者" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="functionName" label="功能名称" required>
              <a-input v-model="formData.functionName" placeholder="请输入功能名称" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="tplCategory" label="生成模板" required>
              <a-select v-model="formData.tplCategory" placeholder="请选择生成模板">
                <a-option value="crud">单表（增删改查）</a-option>
                <a-option value="tree">树表（增删改查）</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      
      <a-divider>字段信息</a-divider>
      
      <a-table :data="formData.columns" :pagination="false">
        <template #columns>
          <a-table-column title="序号" width="80">
            <template #cell="{ rowIndex }">
              {{ rowIndex + 1 }}
            </template>
          </a-table-column>
          <a-table-column title="字段名称" data-index="columnName" />
          <a-table-column title="字段描述" data-index="columnComment">
            <template #cell="{ record }">
              <a-input v-model="record.columnComment" placeholder="请输入字段描述" />
            </template>
          </a-table-column>
          <a-table-column title="物理类型" data-index="columnType" />
          <a-table-column title="Java类型" data-index="javaType">
            <template #cell="{ record }">
              <a-select v-model="record.javaType" placeholder="请选择Java类型">
                <a-option value="String">String</a-option>
                <a-option value="Long">Long</a-option>
                <a-option value="Integer">Integer</a-option>
                <a-option value="Double">Double</a-option>
                <a-option value="BigDecimal">BigDecimal</a-option>
                <a-option value="Date">Date</a-option>
                <a-option value="Boolean">Boolean</a-option>
              </a-select>
            </template>
          </a-table-column>
          <a-table-column title="Java属性" data-index="javaField">
            <template #cell="{ record }">
              <a-input v-model="record.javaField" placeholder="请输入Java属性" />
            </template>
          </a-table-column>
          <a-table-column title="主键" data-index="isPk" width="80">
            <template #cell="{ record }">
              <a-switch v-model="record.isPk" />
            </template>
          </a-table-column>
          <a-table-column title="自增" data-index="isIncrement" width="80">
            <template #cell="{ record }">
              <a-switch v-model="record.isIncrement" />
            </template>
          </a-table-column>
          <a-table-column title="必填" data-index="isRequired" width="80">
            <template #cell="{ record }">
              <a-switch v-model="record.isRequired" />
            </template>
          </a-table-column>
          <a-table-column title="列表" data-index="isList" width="80">
            <template #cell="{ record }">
              <a-switch v-model="record.isList" />
            </template>
          </a-table-column>
          <a-table-column title="查询" data-index="isQuery" width="80">
            <template #cell="{ record }">
              <a-switch v-model="record.isQuery" />
            </template>
          </a-table-column>
          <a-table-column title="查询方式" data-index="queryType">
            <template #cell="{ record }">
              <a-select v-model="record.queryType" placeholder="请选择查询方式">
                <a-option value="EQ">等于</a-option>
                <a-option value="NE">不等于</a-option>
                <a-option value="GT">大于</a-option>
                <a-option value="GTE">大于等于</a-option>
                <a-option value="LT">小于</a-option>
                <a-option value="LTE">小于等于</a-option>
                <a-option value="LIKE">模糊</a-option>
                <a-option value="BETWEEN">范围</a-option>
              </a-select>
            </template>
          </a-table-column>
          <a-table-column title="显示类型" data-index="htmlType">
            <template #cell="{ record }">
              <a-select v-model="record.htmlType" placeholder="请选择显示类型">
                <a-option value="input">文本框</a-option>
                <a-option value="textarea">文本域</a-option>
                <a-option value="select">下拉框</a-option>
                <a-option value="radio">单选框</a-option>
                <a-option value="checkbox">复选框</a-option>
                <a-option value="datetime">日期控件</a-option>
                <a-option value="upload">上传控件</a-option>
                <a-option value="editor">富文本控件</a-option>
              </a-select>
            </template>
          </a-table-column>
          <a-table-column title="字典类型" data-index="dictType">
            <template #cell="{ record }">
              <a-input v-model="record.dictType" placeholder="请输入字典类型" />
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { getTableColumns, generateCode } from '@/api/generator'
import type { GeneratorConfig, ColumnInfo } from '@/types/generator'
import {
  IconLeft,
  IconSave,
  IconCode
} from '@arco-design/web-vue/es/icon'

const router = useRouter()
const route = useRoute()

// 获取URL参数
const tableName = route.query.tableName as string
const action = route.query.action as string

// 表单数据
const formData = reactive<GeneratorConfig>({
  tableName: tableName || '',
  tableComment: '',
  moduleName: 'system',
  businessName: '',
  packageName: 'com.xhan.admin',
  authorName: 'xhan',
  functionName: '',
  tplCategory: 'crud',
  columns: []
})

// 加载状态
const loading = ref(false)

// 获取表字段信息
const fetchTableColumns = async () => {
  if (!tableName) {
    Message.error('表名称不能为空')
    return
  }
  
  loading.value = true
  try {
    const res = await getTableColumns(tableName)
    
    // 设置表信息
    formData.tableComment = res.data.tableComment || ''
    formData.businessName = tableName.replace(/^[a-z]+_/, '')
    formData.functionName = res.data.tableComment || ''
    
    // 设置字段信息
    formData.columns = res.data.columns || []
    
    // 如果action为generate，自动生成代码
    if (action === 'generate') {
      handleGenerate()
    }
  } catch (error) {
    console.error('获取表字段信息失败', error)
    Message.error('获取表字段信息失败')
  } finally {
    loading.value = false
  }
}

// 返回列表页
const goBack = () => {
  router.push('/generator')
}

// 保存配置
const handleSave = () => {
  // 这里可以添加保存配置的逻辑
  Message.success('保存成功')
}

// 生成代码
const handleGenerate = async () => {
  try {
    await generateCode(formData)
    Message.success('代码生成成功')
  } catch (error) {
    console.error('生成代码失败', error)
    Message.error('生成代码失败')
  }
}

onMounted(() => {
  fetchTableColumns()
})
</script>

<style scoped>
.generator-config-container {
  padding: 16px;
}
</style>