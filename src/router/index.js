import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

// 常量路由
const constantRoutes = [
  {
    path: '/',
    component: Layout,
    meta: { title: '仪表盘目录', icon: 'dashboard', hidden: false },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'dashboard', hidden: false },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue'),
    meta: { hidden: true },
  },
]

// 异步路由
const asyncRoutes = [
  {
    path: '/visual',
    component: Layout,
    meta: { title: '大屏中心目录', icon: 'dashboard', hidden: false },
    children: [
      {
        path: 'index',
        name: 'Visual',
        component: () => import('@/pages/visual/index.vue'),
        meta: { title: '大屏中心', icon: 'dashboard', hidden: false },
      },
    ],
  },
  {
    path: '/twin',
    component: Layout,
    meta: { title: '数字孪生', icon: 'dashboard', hidden: false },
    children: [
      {
        path: 'http://www.baidu.com',
        meta: { title: '数字孪生', icon: 'link', hidden: false },
      },
    ],
  },
  {
    path: '/thing',
    component: Layout,
    meta: { title: '设备中心', icon: 'article', hidden: false },
    children: [
      {
        path: 'product',
        name: 'Product',
        component: () => import('@/pages/thing/product/index.vue'),
        meta: { title: '产品管理', icon: 'letters-c', hidden: false },
      },
      {
        path: 'device',
        name: 'Device',
        component: () => import('@/pages/thing/device/index.vue'),
        meta: { title: '设备管理', icon: 'letters-d', hidden: false },
      },
    ],
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: '系统设置', icon: 'setting', hidden: false },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/pages/system/user/index.vue'),
        meta: { title: '用户管理', icon: 'letters-u', hidden: false },
      },
      // {
      //   path: 'role',
      //   name: 'Role',
      //   component: () => import('@/pages/system/role/index.vue'),
      //   meta: { title: '角色管理', icon: 'letters-r', hidden: false },
      // },
      // {
      //   path: 'menu',
      //   name: 'Menu',
      //   component: () => import('@/pages/system/menu/index.vue'),
      //   meta: { title: '菜单管理', icon: 'letters-c', hidden: false },
      // },
    ],
  },
]

// 路由表
export const routes = [...constantRoutes, ...asyncRoutes]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

export default router
