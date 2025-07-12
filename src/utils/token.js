const tokenKey = 'token'

// 设置token
export const setToken = (token) => {
  localStorage.setItem(tokenKey, token)
}

// 获取token
export const getToken = () => {
  return localStorage.getItem(tokenKey)
}

// 删除token
export const removeToken = () => {
  localStorage.removeItem(tokenKey)
}
