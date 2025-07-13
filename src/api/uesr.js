import service from '@/utils/request'

// 用户列表
export const userListApi = (data) => service.get('/user', { params: data })
