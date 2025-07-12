import axios from 'axios'
import { MessagePlugin } from 'tdesign-vue-next'
import { getToken } from '@/utils/token'
import { removeToken } from '@/utils/token'
import { useAuthStore } from '@/store'

// 请求配置信息
const config = {
  baseURL: import.meta.env.VITE_APP_URL,
  timeout: 10000,
}

// 创建axios实例
const service = axios.create(config)

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    // 获取token
    const token = getToken()

    // 如果token存在，则在请求头中添加Authorization字段
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    // 获取响应数据
    const { code, msg } = response.data

    // 判断是否响应成功
    if (code != 0) {
      MessagePlugin.error({ content: msg })
      return Promise.reject(msg)
    }

    return response.data
  },
  (error) => {
    // 处理错误信息
    if (error.code === 'ERR_NETWORK') {
      MessagePlugin.error({ content: '网络错误' })
    }

    // 未认证
    if (error.status === 401) {
      // 清除仓库token
      const authStore = useAuthStore()
      authStore.state.token = ''
      // 清除本地token
      removeToken()
      // 刷新页面
      window.location.reload()
    }

    return Promise.reject(error)
  }
)

export default service
