import service from '@/utils/request'

// 菜单列表
export const menuListApi = (data) => service.get('/menu', { params: data })

// 创建更新菜单
export const menuUpsertApi = (data) => service.post('/menu/upsert', data)

// 删除菜单
export const menuDeleteApi = (id) => service.delete(`/menu/${id}`)

// 根据角色id查询菜单列表
export const menuListByRoleApi = (id) => service.get(`/menu/role/${id}`)

// 分配菜单
export const menuAssignApi = (data) => service.post('/menu/assign', data)
