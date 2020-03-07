
import request from '@/utils/request'

const baseURL = process.env.VUE_APP_BASE_API
// console.log(request)
export function ApiLockRecord(param) {
  return request({
    baseURL: baseURL,
    url: `api/RecordLock/Lock/${param.tableName}/${param.id}`,
    method: 'get'
  })
}

export function ApiUnLockRecord(param) {
  return request({
    baseURL: baseURL,
    url: `api/RecordLock/UnLock/${param.tableName}/${param.id}`,
    method: 'post'
  })
}

export function ApiGlobalDataState(param) {
  return request({
    baseURL: baseURL,
    url: `api/GlobalConfigs/data-state`,
    method: 'get'
  })
}
