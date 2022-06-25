import Vue from 'vue'
import router from '@/router'
import notification from 'ant-design-vue/es/notification'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  // Vue.ls.remove(ACCESS_TOKEN)
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 404) {
      notification.warning({
        message: '提示',
        description: '系统维护中，请稍后^_^'
      })
    }
    if (error.response.status === 401) {
      toLogin()
    }
    if (error.response.status === 400) {
      notification.error({
        message: '提示',
        description: data.body
      })
    }
    if (error.response.status === 500) {
      notification.error({
        message: '错误',
        description: data
      })
    }
  }
  return Promise.reject(error)
}

// 创建axios实例
let instance = Vue.axios.create({ timeout: 1000 * 60 })
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
// instance.defaults.headers.post['Content-Type'] = 'application/json'
// instance.defaults.baseURL = API_URL

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    // const token = Vue.ls.get(ACCESS_TOKEN)
    // token && (config.headers['accessToken'] = token) // 让每个请求携带自定义 token 请根据实际情况自行修改
    // console.log('请求拦截器', config)
    return config
  }, err)

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => {
    // console.log('响应拦截器', res)
    if (res.headers.filename) { // 导出文件处理方式
      return res.status === 200 ? Promise.resolve(res) : Promise.reject(res)
    } else {
      return res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res)
    }
  }, err)

export default instance
