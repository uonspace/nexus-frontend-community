<template>
  <t-layout class="h-full">
    <!-- 顶部导航 -->
    <LayoutHeader />
    <t-layout>
      <!-- 侧边导航 -->
      <LayoutSidebar />
      <!-- 主体内容 -->
      <LayoutContent />
    </t-layout>
  </t-layout>
</template>

<script setup>
import LayoutHeader from './components/header/index.vue'
import LayoutSidebar from './components/sidebar/index.vue'
import LayoutContent from './components/content/index.vue'
</script>

<style lang="scss" scoped></style>
