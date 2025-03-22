// 监控相关类型定义

// 操作日志类型
export interface OperationLog {
  operId: string
  title: string
  businessType: string
  operName: string
  operIp: string
  operLocation: string
  method: string
  operUrl: string
  operParam: string
  jsonResult: string
  status: string
  errorMsg?: string
  operTime: string
  selected?: boolean
}

// 操作日志查询参数
export interface OperationLogQuery {
  pageNum?: number
  pageSize?: number
  operName?: string
  status?: string
  beginTime?: string
  endTime?: string
}

// 操作日志响应数据
export interface OperationLogResponse {
  code: number
  msg: string
  data: {
    list: OperationLog[]
    total: number
  }
}