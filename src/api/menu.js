import service from '@/utils/request'

// 菜单列表
export const menuListApi = (data) => service.get('/menu', { params: data })
