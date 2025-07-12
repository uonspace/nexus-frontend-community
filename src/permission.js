import router from '@/router'
import { getToken } from '@/utils/token'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

// 白名单地址
const whiteList = ['/login']

// 路由开始前
router.beforeEach(async (to) => {
  // 开始导航条
  NProgress.start()

  // 获取本地token
  const hasToken = getToken()

  // 如果存在token
  if (hasToken) {
    // 如果访问路径是登录页面,则直接跳转到主页
    if (to.path === '/login') {
      return {
        path: '/',
        replace: true,
      }
    }
    // 结束导航条
    NProgress.done()
  } else {
    // 如果不存在token但白名单中存在该路径则也放行
    if (whiteList.includes(to.path)) {
      // 结束导航条
      NProgress.done()
      return true
    }

    // 结束导航条
    NProgress.done()

    // 如果不存在token并且不在白名单则重定向到登录页面
    return {
      path: '/login',
      query: {
        redirect: to.path,
        ...to.query,
      },
    }
  }
})
