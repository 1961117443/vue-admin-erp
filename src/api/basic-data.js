import request from '@/utils/request'

export function getMaterialWarehouseOptions() {
  return request({
    url: `${process.env.VUE_APP_BASE_API}/api/MaterialWarehouse`,
    method: 'get'
  })
}

export function getProductCateoryList(params) {
  return request({
    url: 'api/ProductCategory',
    method: 'get',
    params: params
  })
}
export function getProductCateory(id) {
  return request({
    url: `api/ProductCategory/${id}`,
    method: 'get'
  })
}
export function postProductCateory(data) {
  return request({
    url: 'api/ProductCategory',
    method: 'post',
    data: data
  })
}
export function delProductCateory(id) {
  return request({
    url: `api/ProductCategory/delete/${id}`,
    method: 'post'
  })
}

export function getProductList(params) {
  return request({
    url: 'api/Product',
    method: 'get',
    params: params
  })
}
export function getProduct(id) {
  return request({
    url: `api/Product/${id}`,
    method: 'get'
  })
}
export function postProduct(data) {
  return request({
    url: 'api/Product',
    method: 'post',
    data: data
  })
}
export function delProduct(id) {
  return request({
    url: `api/Product/delete/${id}`,
    method: 'post'
  })
}
