import axios from 'axios'

// 增加统一超时时间和请求带 cookie 处理
let axiosInstance = axios.create({
  timeout: 30000,
  withCredentials: true
})
// 增加统一的请求拦截器
// axiosInstance.interceptors.request.use(res => {
//   console.log(res.data || res.params)
//   return res
// })
// 增加统一的回调拦截器
axiosInstance.interceptors.response.use(res => {
  // 未登录，跳转到登录页
  if (res.data.status === 101) {
    window.location.href = '/qaweb/login.html'
  }
  return res
}, err => {
  console.error(err.config.url + ' 接口异常')
  return Promise.reject(err)
})

export default axiosInstance
