import service from '@/utils/request'

// 角色列表
export const roleListApi = (data) => service.get('/role', { params: data })

// 角色详情
export const roleDetailApi = (id) => service.get(`/role/${id}`)

// 创建角色
export const roleCreateApi = (data) => service.post('/role', data)

// 更新角色
export const roleUpdateApi = (data) => service.put(`/role`, data)

// 删除角色
export const roleDeleteApi = (ids) => service.delete(`/role/${ids}`)
