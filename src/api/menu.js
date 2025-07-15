import service from '@/utils/request'

// 菜单列表
export const menuListApi = (data) => service.get('/menu', { params: data })

// 创建更新菜单
export const menuUpsertApi = (data) => service.post('/menu/upsert', data)

// 删除菜单
export const menuDeleteApi = (id) => service.delete(`/menu/${id}`)
