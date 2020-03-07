import request from '@/utils/request'

const baseURL = process.env.VUE_APP_BASE_API
export function login(data) {
  return request({
    // url: '/vue-admin-template/user/login',
    // baseURL: baseURL,
    url: 'api/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    // url: '/vue-admin-template/user/info',
    // baseURL: baseURL,
    url: 'api/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    // url: '/vue-admin-template/user/logout',
    // baseURL: baseURL,
    url: 'api/user/logout',
    method: 'post'
  })
}
