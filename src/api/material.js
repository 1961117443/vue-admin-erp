import request from '@/utils/request'

const baseURL = process.env.VUE_APP_BASE_API

/**
 * 根据id获取入库单主表数据接口
 * @param {String} id
 */
export function ApiMaterialPurchase(id) {
  return request({
    baseURL: baseURL,
    url: `/api/MaterialPurchase/${id}`,
    method: 'get'
  })
}
/**
 * 入库单分页列表数据接口
 * @param {Object} params
 */
export function ApiMaterialPurchaseList(params) {
  return request({
    baseURL: baseURL,
    url: '/api/MaterialPurchase',
    method: 'get',
    params: params
  })
}

/**
 * 单张入库单的从表数据接口
 * @param {String} mid
 */
export function ApiMaterialPurchaseDetail(mid) {
  return request({
    baseURL: baseURL,
    url: `/api/MaterialPurchase/detail/${mid}`,
    method: 'get'
  })
}
/**
 * 保存采购入库的数据 主从表数据一起保存
 * @param {Object} data
 */
export function ApiPostMaterialPurchase(data) {
  return request({
    baseURL: baseURL,
    url: `/api/MaterialPurchase`,
    method: 'post',
    data: data
  })
}

/**
 * 材料入库单删除接口
 * @param {string} id
 */
export function ApiMaterialPurchaseDelete(id) {
  return request({
    baseURL: baseURL,
    url: `/api/MaterialPurchase/delete/${id}`,
    method: 'post'
  })
}

export function ApiMaterialPurchaseAudit(id) {
  return request({
    baseURL: baseURL,
    url: `/api/MaterialPurchase/audit/${id}`,
    method: 'post'
  })
}
export function ApiMaterialPurchaseUnAudit(id) {
  return request({
    baseURL: baseURL,
    url: `/api/MaterialPurchase/unaudit/${id}`,
    method: 'post'
  })
}

export function ApiMaterialSalesOut(id) {
  return request({
    baseURL: baseURL,
    url: `/api/MaterialSalesOut/${id}`,
    method: 'get'
  })
}

export function ApiMaterialSalesOutDetail(mid) {
  return request({
    baseURL: baseURL,
    url: `/api/MaterialSalesOut/detail/${mid}`,
    method: 'get'
  })
}
