import service from '@/utils/request'

// 获取验证码
export const captchaApi = (data) => service.get('/user/captcha', data)

// 用户登录
export const loginApi = (data) => service.post('/user/login', data)

// 退出登录
export const logoutApi = () => service.get('/user/logout')

// 用户信息
export const getUserInfoApi = () => service.get('/user/info')
