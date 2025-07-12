<template>
  <t-aside style="border-top: 1px solid #e7e7e7">
    <t-menu :defaultValue="defaultValue" @change="changeHandler">
      <!-- 遍历侧边栏项 -->
      <SidebarItem v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
    </t-menu>
  </t-aside>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { routes } from '@/router'

import SidebarItem from './SidebarItem.vue'

const route = useRoute()
const router = useRouter()

const defaultValue = computed(() => {
  // ...
  return route.path
})

const changeHandler = (active) => {
  console.log('change', active)

  if (active.startsWith('http://') || active.startsWith('https://')) {
    // 如果是外链，直接打开
    window.open(active, '_blank')
    return
  }

  router.push({ path: active })
}
</script>

<style lang="scss" scoped></style>
