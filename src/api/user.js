import service from '@/utils/request'

// 用户列表
export const userListApi = (data) => service.get('/user', { params: data })

// 创建用户
export const userCreateApi = (data) => service.post('/user', data)

// 更新用户
export const userUpdateApi = (data) => service.put('/user', data)

// 删除用户
export const userDeleteApi = (ids) => service.delete(`/user/${ids}`)

// 更新用户状态
export const userUpdateStatusApi = (id, status) => service.put(`/user/status/${id}`, { status })

// 更新用户密码
export const userUpdatePasswordApi = (id, password) => service.put(`/user/password/${id}`, { password })
