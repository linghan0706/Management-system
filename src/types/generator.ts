// 表信息接口
export interface TableInfo {
  tableName: string
  tableComment: string
  createTime: string
  updateTime: string
}

// 表字段信息接口
export interface ColumnInfo {
  columnName: string
  columnComment: string
  columnType: string
  javaType: string
  javaField: string
  isPk: boolean
  isIncrement: boolean
  isRequired: boolean
  isList: boolean
  isQuery: boolean
  queryType: string
  htmlType: string
  dictType?: string
}

// 生成配置接口
export interface GeneratorConfig {
  tableName: string
  tableComment: string
  moduleName: string
  businessName: string
  packageName: string
  authorName: string
  functionName: string
  tplCategory: string
  columns: ColumnInfo[]
}