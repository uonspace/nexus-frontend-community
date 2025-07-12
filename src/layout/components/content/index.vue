<template>
  <t-layout>
    <t-content>
      <RouterView v-slot="{ Component }">
        <Transition name="fade">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </t-content>
  </t-layout>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  @apply transition-all duration-500 absolute;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0 translate-x-[50px];
}
</style>
