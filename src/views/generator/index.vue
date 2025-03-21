<template>
  <div class="generator-container">
    <a-card title="代码生成器">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card title="数据源" :bordered="false">
            <div class="table-list">
              <a-input-search placeholder="输入表名搜索" allow-clear style="margin-bottom: 16px" />
              <a-list :bordered="false" size="small">
                <a-list-item v-for="(table, index) in tables" :key="index">
                  <a-checkbox 
                    v-model="table.selected" 
                    @change="handleTableSelect(table)"
                  >
                    {{ table.name }}
                  </a-checkbox>
                </a-list-item>
              </a-list>
            </div>
          </a-card>
        </a-col>
        <a-col :span="18">
          <a-card title="生成配置" :bordered="false">
            <a-tabs>
              <a-tab-pane key="basic" title="基础配置">
                <a-form :model="formConfig" layout="vertical">
                  <a-row :gutter="16">
                    <a-col :span="12">
                      <a-form-item field="tableName" label="表名称">
                        <a-input v-model="formConfig.tableName" disabled />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="tableComment" label="表描述">
                        <a-input v-model="formConfig.tableComment" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="16">
                    <a-col :span="12">
                      <a-form-item field="moduleName" label="模块名称">
                        <a-input v-model="formConfig.moduleName" placeholder="请输入模块名称" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="businessName" label="业务名称">
                        <a-input v-model="formConfig.businessName" placeholder="请输入业务名称" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="16">
                    <a-col :span="12">
                      <a-form-item field="packageName" label="包名称">
                        <a-input v-model="formConfig.packageName" placeholder="请输入包名称" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="author" label="作者">
                        <a-input v-model="formConfig.author" placeholder="请输入作者" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-form>
              </a-tab-pane>
              <a-tab-pane key="fields" title="字段设置">
                <a-table :columns="fieldColumns" :data="fields" :pagination="false" size="small">
                  <template #columns>
                    <a-table-column title="字段名称" data-index="columnName" />
                    <a-table-column title="字段类型" data-index="columnType" />
                    <a-table-column title="字段描述" data-index="columnComment" />
                    <a-table-column title="是否主键" data-index="isPk" align="center">
                      <template #cell="{ record }">
                        <a-tag v-if="record.isPk" color="blue">是</a-tag>
                        <a-tag v-else color="gray">否</a-tag>
                      </template>
                    </a-table-column>
                    <a-table-column title="必填" data-index="isRequired" align="center">
                      <template #cell="{ record }">
                        <a-switch v-model="record.isRequired" size="small" />
                      </template>
                    </a-table-column>
                    <a-table-column title="列表显示" data-index="isList" align="center">
                      <template #cell="{ record }">
                        <a-switch v-model="record.isList" size="small" />
                      </template>
                    </a-table-column>
                    <a-table-column title="查询显示" data-index="isQuery" align="center">
                      <template #cell="{ record }">
                        <a-switch v-model="record.isQuery" size="small" />
                      </template>
                    </a-table-column>
                  </template>
                </a-table>
              </a-tab-pane>
              <a-tab-pane key="options" title="生成选项">
                <a-form :model="genOptions" layout="vertical">
                  <a-row :gutter="16">
                    <a-col :span="24">
                      <a-form-item field="templateType" label="模板类型">
                        <a-radio-group v-model="genOptions.templateType">
                          <a-radio value="crud">单表（增删改查）</a-radio>
                          <a-radio value="tree">树表（增删改查）</a-radio>
                          <a-radio value="sub">主子表（增删改查）</a-radio>
                        </a-radio-group>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="16">
                    <a-col :span="24">
                      <a-form-item field="genType" label="生成方式">
                        <a-radio-group v-model="genOptions.genType">
                          <a-radio value="zip">ZIP压缩包</a-radio>
                          <a-radio value="direct">自动生成到模块</a-radio>
                        </a-radio-group>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="16">
                    <a-col :span="24">
                      <a-form-item field="genFiles" label="生成文件">
                        <a-checkbox-group v-model="genOptions.genFiles">
                          <a-checkbox value="controller">控制器</a-checkbox>
                          <a-checkbox value="service">服务层</a-checkbox>
                          <a-checkbox value="mapper">映射层</a-checkbox>
                          <a-checkbox value="model">实体类</a-checkbox>
                          <a-checkbox value="vue">Vue前端</a-checkbox>
                          <a-checkbox value="sql">SQL脚本</a-checkbox>
                        </a-checkbox-group>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-form>
              </a-tab-pane>
            </a-tabs>
            <div class="action-bar">
              <a-space>
                <a-button type="primary" @click="handleGenerateCode">
                  <template #icon><icon-code /></template>
                  生成代码
                </a-button>
                <a-button>
                  <template #icon><icon-refresh /></template>
                  重置
                </a-button>
              </a-space>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconCode, IconRefresh } from '@arco-design/web-vue/es/icon';

// 模拟数据 - 表
const tables = ref([
  { name: 'sys_user', comment: '用户表', selected: false },
  { name: 'sys_role', comment: '角色表', selected: false },
  { name: 'sys_menu', comment: '菜单表', selected: false },
  { name: 'sys_dept', comment: '部门表', selected: false },
  { name: 'sys_config', comment: '配置表', selected: false },
]);

// 模拟数据 - 字段
const fields = ref([
  { 
    columnName: 'id', 
    columnType: 'int', 
    columnComment: '主键ID', 
    isPk: true, 
    isRequired: true, 
    isList: true, 
    isQuery: false 
  },
  { 
    columnName: 'name', 
    columnType: 'varchar(50)', 
    columnComment: '名称', 
    isPk: false, 
    isRequired: true, 
    isList: true, 
    isQuery: true 
  },
  { 
    columnName: 'status', 
    columnType: 'tinyint', 
    columnComment: '状态', 
    isPk: false, 
    isRequired: true, 
    isList: true, 
    isQuery: true 
  },
  { 
    columnName: 'create_time', 
    columnType: 'datetime', 
    columnComment: '创建时间', 
    isPk: false, 
    isRequired: false, 
    isList: true, 
    isQuery: false 
  },
  { 
    columnName: 'update_time', 
    columnType: 'datetime', 
    columnComment: '更新时间', 
    isPk: false, 
    isRequired: false, 
    isList: false, 
    isQuery: false 
  }
]);

// 表单配置
const formConfig = reactive({
  tableName: '',
  tableComment: '',
  moduleName: 'system',
  businessName: '',
  packageName: 'com.xhan.admin',
  author: 'xhan'
});

// 生成选项
const genOptions = reactive({
  templateType: 'crud',
  genType: 'zip',
  genFiles: ['controller', 'service', 'mapper', 'model', 'vue', 'sql']
});

// 字段表格列
const fieldColumns = [
  { title: '字段名称', dataIndex: 'columnName' },
  { title: '字段类型', dataIndex: 'columnType' },
  { title: '字段描述', dataIndex: 'columnComment' },
  { 
    title: '是否主键', 
    dataIndex: 'isPk',
    align: 'center'
  },
  {
    title: '必填',
    dataIndex: 'isRequired',
    align: 'center'
  },
  {
    title: '列表显示',
    dataIndex: 'isList',
    align: 'center'
  },
  {
    title: '查询显示',
    dataIndex: 'isQuery',
    align: 'center'
  }
];

// 处理表选择
const handleTableSelect = (table: any) => {
  if (table.selected) {
    // 清除其他选中的表
    tables.value.forEach(item => {
      if (item.name !== table.name) {
        item.selected = false;
      }
    });
    // 更新表单信息
    formConfig.tableName = table.name;
    formConfig.tableComment = table.comment;
    formConfig.businessName = table.name.replace('sys_', '');
  } else {
    formConfig.tableName = '';
    formConfig.tableComment = '';
    formConfig.businessName = '';
  }
};

// 生成代码处理
const handleGenerateCode = () => {
  if (!formConfig.tableName) {
    Message.warning('请先选择一个数据表');
    return;
  }
  
  Message.success('代码生成成功，请在下载中心查看');
  
  // 实际应用中，这里应该调用后端API生成代码
  console.log('生成代码配置:', {
    formConfig,
    genOptions,
    fields: fields.value
  });
};
</script>

<style lang="scss" scoped>
.generator-container {
  padding: 16px;
  
  .table-list {
    height: 600px;
    overflow-y: auto;
  }
  
  .action-bar {
    margin-top: 24px;
    text-align: center;
  }
}
</style> 