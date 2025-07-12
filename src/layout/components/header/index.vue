<template>
  <t-header>
    <t-head-menu value="item1" height="120px">
      <!-- Logo -->
      <template #logo>
        <img :src="LogoImage" class="h-[40px] ml-[16px]" alt="logo" />
      </template>

      <!-- 右侧操作 -->
      <template #operations>
        <t-space :size="1">
          <!-- 通知信息 -->
          <t-badge :count="5" :offset="[9, 6]" size="small">
            <t-button variant="text" shape="square">
              <template #icon>
                <t-icon name="notification" size="17px" />
              </template>
            </t-button>
          </t-badge>

          <!-- 帮助手册 -->
          <t-button variant="text" shape="square">
            <template #icon>
              <t-icon name="help-circle" size="18px" />
            </template>
          </t-button>

          <!-- 全屏切换 -->
          <t-button variant="text" shape="square" @click="toggleFullscreen">
            <template #icon>
              <t-icon name="fullscreen-1" size="21px" v-if="!isFullScreen" />
              <t-icon name="fullscreen-exit-1" size="21px" v-else />
            </template>
          </t-button>
        </t-space>

        <!-- 分割线 -->
        <div class="w-[1px] h-[18px] bg-gray-300 mx-1"></div>

        <!-- 个人信息 -->
        <t-dropdown :min-column-width="88">
          <t-button variant="text">
            <div class="flex items-center">
              <t-avatar image="https://static.yuanbao.tencent.com/assets/72d5d6653089ab0d04be.svg" size="22px" />
              <span class="ml-2 text-[14px]">{{ state.userInfo.nickname }}</span>
            </div>
          </t-button>
          <t-dropdown-menu>
            <t-dropdown-item :value="1">
              <template #prefixIcon> <t-icon name="user" size="16" /></template>
              个人中心
            </t-dropdown-item>
            <t-dropdown-item @click="logout">
              <template #prefixIcon> <t-icon name="logout" size="16" /></template>
              退出登录
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
      </template>
    </t-head-menu>
  </t-header>
</template>

<script setup>
import LogoImage from '@/assets/images/logo.png'
import { onBeforeUnmount, onMounted, ref, toRaw, toRef } from 'vue'
import { DialogPlugin } from 'tdesign-vue-next'
import screenfull from 'screenfull'
import { useAuthStore } from '@/store'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// 引入认证状态管理
const authStore = useAuthStore()

// 获取认证状态
const { state } = storeToRefs(authStore)

// 路由
const router = useRouter()

// 全屏状态
const isFullScreen = ref(false)

// 监听全屏状态变化
const updateFullscreenState = () => {
  isFullScreen.value = screenfull.isFullscreen
}

onMounted(() => {
  // 浏览器全屏事件监听
  screenfull.on('change', updateFullscreenState)
})

onBeforeUnmount(() => {
  // 浏览器全屏事件监听
  screenfull.off('change', updateFullscreenState)
})

// 切换全屏
const toggleFullscreen = () => {
  if (screenfull.isEnabled) {
    screenfull.toggle()
  }
}

// 获取用户信息
const getUserInfo = async () => {
  try {
    await authStore.getUserInfo()
  } catch (e) {
    console.error('failed to getUserInfo:', e)
  }
}

// 页面挂载
onMounted(async () => {
  await getUserInfo()
})

// 退出登录
const logout = () => {
  const confirmDia = DialogPlugin({
    theme: 'info',
    header: '退出登录',
    body: '确定要退出当前账号?',
    confirmBtn: '确定',
    cancelBtn: '取消',
    onConfirm: async ({ e }) => {
      try {
        // 退出登录
        authStore.logout()
      } catch (e) {
        console.error('failed to logout:', e)
      }

      // 刷新页面
      window.location.reload()

      confirmDia.hide()
    },
    onClose: ({ e, trigger }) => {
      confirmDia.hide()
    },
  })
}
</script>

<style lang="scss" scoped></style>
