import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { loginApi, logoutApi, getUserInfoApi } from '@/api/auth'
import { setToken, removeToken } from '@/utils/token'

// 认证状态管理
export const useAuthStore = defineStore('auth', () => {
  // 定义状态
  const state = reactive({
    userInfo: '',
    token: '',
  })

  // 用户登录
  const login = async (data) => {
    try {
      // 获取用户名和密码
      const { username, password, captchaId, captcha } = data
      // 调用登录接口
      const response = await loginApi({ username, password, uuid: captchaId, captcha })
      // 获取返回的token
      const { token } = response.data
      // 设置token到状态
      state.token = token
      // 将token存储到本地
      setToken(state.token)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  // 退出登录
  const logout = async () => {
    // 移除token
    state.token = ''
    removeToken()

    // 退出请求
    try {
      // 发送请求
      await logoutApi()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  // 用户信息
  const getUserInfo = async () => {
    try {
      // 发送请求
      const response = await getUserInfoApi()
      // 获取用户信息
      state.userInfo = response.data
    } catch (e) {
      return Promise.reject(e)
    }
  }

  return {
    state,
    login,
    logout,
    getUserInfo,
  }
})
