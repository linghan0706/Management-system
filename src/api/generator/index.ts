import request from '../request'

// 获取数据库表列表
export function getTableList() {
  return request({
    url: '/generator/tables',
    method: 'get'
  })
}

// 获取表字段信息
export function getTableColumns(tableName: string) {
  return request({
    url: `/generator/columns/${tableName}`,
    method: 'get'
  })
}

// 生成代码
export function generateCode(data: any) {
  return request({
    url: '/generator/generate',
    method: 'post',
    data
  })
}

// 预览代码
export function previewCode(data: any) {
  return request({
    url: '/generator/preview',
    method: 'post',
    data
  })
}

// 下载代码
export function downloadCode(tableName: string) {
  return request({
    url: `/generator/download/${tableName}`,
    method: 'get',
    responseType: 'blob'
  })
}