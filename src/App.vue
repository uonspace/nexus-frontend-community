<template>
  <RouterView />
</template>

<script setup></script>

<style lang="scss">
#nprogress .bar {
  background: #0052d9 !important; //自定义颜色
}

#nprogress .peg {
  box-shadow: 0 0 10px #0052d9, 0 0 5px #0052d9 !important;
}
</style>
