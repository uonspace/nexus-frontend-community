import service from '@/utils/request'

// 角色列表
export const roleListApi = (data) => service.get('/role', { params: data })

// 所有角色
export const roleListAllApi = () => service.get('/role/all')

// 角色详情
export const roleDetailApi = (id) => service.get(`/role/${id}`)

// 创建角色
export const roleCreateApi = (data) => service.post('/role', data)

// 更新角色
export const roleUpdateApi = (data) => service.put(`/role`, data)

// 删除角色
export const roleDeleteApi = (ids) => service.delete(`/role/${ids}`)

// 用户角色
export const roleListByUserIdApi = (userId) => service.get(`/role/user/${userId}`)

// 分配角色
export const roleAssignApi = (data) => service.post('/role/assign', data)
