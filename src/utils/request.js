import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getRefreshToken } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // console.log('response.data:' + res)
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      // 200000 到 30000 是 api 执行成功 但是执行结果不符合预期 自定义的错误信息
      if (res.code > 200000 && res.code < 30000) {
        if (res.data instanceof String) {
          Message({
            message: res.data || 'Error',
            type: 'error',
            duration: 5 * 1000
          })
        }
        return res
      }
      // console.log('response:' + res)
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      console.log(res)
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log(error.config)
    // console.log('err' + error) // for debug
    if (error.response) {
      // 未授权：
      // 首先用refresh_token获取新的token,然后再发起请求
      // 如果refresh_token也过期了，直接跳转到登录页面
      if (error.response.status === 401) {
        const refresh_token = getRefreshToken()
        return new Promise((resolve, reject) => {
          return axios.get('api/user/refresh-token', {
            baseURL: 'http://localhost:8090',
            params: {
              token: getToken()
            },
            headers: {
              Authorization: `Bearer ${refresh_token}`
            }
          }).then(res => {
            // 获取到新的token
            if (res.data && res.data.data) {
              console.log('获取到新的token,重新发起请求')
              // 设置新的token 然后重新发起请求
              const token = res.data.data
              console.log('refresh-token:ok')
              store.dispatch('user/resetToken', token)
              error.config.__isRetryRequest = true
              error.config.headers.Authorization = `Bearer ${token}`
              return axios(error.config).then(res => {
                resolve(res.data)
              })
            } else {
              // console.log('error1')
              return store.dispatch('user/resetToken').then(() => {
                toLogin()
                // reject()
              })
            }
          }).catch(err => {
            if (err.response) {
              // 还是未授权状态 跳转至登录页面
              if (err.response.status === 401) {
                console.log('refresh_token也过期了，只好重新登录:' + refresh_token)
                console.log(err.response)
                toLogin()
              }
            }
            reject()
          })
        })
      }
      return Promise.reject(error)
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  }
)

const toLogin = function() {
  let path = router.app.$route.fullPath
  if (path !== '/') {
    path = `/login?redirect=${router.app.$route.fullPath}`
  } else {
    path = `/login`
  }
  console.log(path)
  router.push(path)
}
export default service
