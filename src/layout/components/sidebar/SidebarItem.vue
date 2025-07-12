<template>
  <template v-if="!item.meta?.hidden">
    <!-- 单级菜单 -->
    <t-menu-item v-if="filteredChildren.length < 1" :value="resolvedPath(singleChildRoute.path)">
      <!-- 菜单图标 -->
      <template #icon v-if="item.meta?.icon">
        <t-icon :name="item.meta?.icon" />
      </template>

      <!-- 菜单标题 -->
      {{ singleChildRoute.meta?.title }}
    </t-menu-item>

    <!-- 多级菜单 -->
    <t-submenu v-else :value="item.path">
      <!-- 菜单图标 -->
      <template #icon v-if="item.meta?.icon">
        <t-icon :name="item.meta?.icon" />
      </template>

      <!-- 菜单标题 -->
      <template #title>
        <span>{{ item.meta?.title }}</span>
      </template>

      <!-- 遍历子菜单 -->
      <SidebarItem v-for="child in filteredChildren" :key="child.path" :item="child" :base-path="resolvedPath(child.path)" />
    </t-submenu>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import path from 'path-browserify-esm'

// 定义属性
const { item, basePath } = defineProps({
  item: {
    type: Object,
    required: true,
  },
  basePath: {
    type: String,
    required: true,
  },
})

// 获取children
const filteredChildren = computed(() => (item.children || []).filter((child) => !child.meta?.hidden))

// 单个路由
const singleChildRoute = computed(() => (filteredChildren.value.length === 1 ? filteredChildren.value[0] : { ...item, path: '' }))

// 图标名称
const iconName = computed(() => singleChildRoute.value.meta?.icon)

// 父子路径拼接
const resolvedPath = (childPath) => {
  // 如果是外链，直接返回
  if (childPath.startsWith('http://') || childPath.startsWith('https://')) {
    return childPath
  }

  return path.resolve(basePath, childPath)
}
</script>

<style lang="scss" scoped></style>
