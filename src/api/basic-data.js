import request from '@/utils/request'

export function getMaterialWarehouseOptions() {
  return request({
    url: `${process.env.VUE_APP_BASE_API}/api/MaterialWarehouse`,
    method: 'get'
  })
}

// import axios from 'axios'

// const service = axios.create({
//   baseURL: 'http://localhost:8090', // url = base url + request url
//   // withCredentials: true, // send cookies when cross-domain requests
//   timeout: 50000 // request timeout
// })

// export function getMaterialWarehouseOptions(params) {
// //   const req = service.get({
// //     url: '/api/MaterialWarehouse',
// //     method: 'get',
// //     params
// //   })
//   return axios.create({
//     baseURL: 'http://localhost:8090', // url = base url + request url
//     // withCredentials: true, // send cookies when cross-domain requests
//     timeout: 50000, // request timeout
//     url: '/api/MaterialWarehouse',
//     method: 'get',
//     params
//   })
// }
