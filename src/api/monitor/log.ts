import request from '../request'

// 操作日志API接口

/**
 * 获取操作日志列表
 * @param params 查询参数
 */
export function getOperationLogList(params: any) {
  return request.get('/api/monitor/operlog/list', { params })
}

/**
 * 删除操作日志
 * @param ids 日志ID数组
 */
export function deleteOperationLog(ids: string[]) {
  return request.delete('/api/monitor/operlog', { data: { ids } })
}

/**
 * 清空操作日志
 */
export function clearOperationLog() {
  return request.delete('/api/monitor/operlog/clean')
}

/**
 * 导出操作日志
 * @param params 查询参数
 */
export function exportOperationLog(params: any) {
  return request.get('/api/monitor/operlog/export', { 
    params,
    responseType: 'blob'
  })
}