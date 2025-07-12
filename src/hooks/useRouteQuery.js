import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

// 从路由对象中查询重定向和路由参数
export const useRouteQuery = () => {
  const redirect = ref('')
  const otherQuery = ref('')
  const route = useRoute()

  const getOtherQuery = (query) => {
    return Object.keys(query).reduce((memo, key) => {
      if (key !== 'redirect') {
        memo[key] = query[key]
      }
      return memo
    }, {})
  }

  watchEffect(() => {
    const query = route.query

    if (query) {
      redirect.value = query.redirect
      otherQuery.value = getOtherQuery(query)
    }
  })

  return {
    redirect,
    otherQuery,
  }
}
