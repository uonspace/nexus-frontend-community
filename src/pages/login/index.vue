<template>
  <div class="login-page">
    <!-- 登陆框 -->
    <div class="login-box">
      <!-- 左侧面板 -->
      <div class="login-left-panel">
        <!-- Logo -->
        <img :src="LoginLogoImage" class="logo" alt="logo" />

        <!-- 平台介绍 -->
        <div class="platform-intro">
          <!-- 多种协议 -->
          <div class="platform-intro-item">
            <!-- Icon -->
            <img :src="LoginIconProto" class="platform-intro-item-icon" alt="多种协议" />
            <!-- 描述信息 -->
            <div class="platform-intro-item-desc">
              <div class="platform-intro-item-title">多种协议</div>
              <div class="platform-intro-item-subtitle">支持多种物联网接入协议</div>
            </div>
          </div>

          <!-- 安全可靠 -->
          <div class="platform-intro-item mt-8">
            <!-- Icon -->
            <img :src="LoginIconSecure" class="platform-intro-item-icon" alt="安全可靠" />
            <!-- 描述信息 -->
            <div class="platform-intro-item-desc">
              <div class="platform-intro-item-title">安全可靠</div>
              <div class="platform-intro-item-subtitle">多重安全防护保障数据安全</div>
            </div>
          </div>

          <!-- 数据融合 -->
          <div class="platform-intro-item mt-8">
            <!-- Icon -->
            <img :src="LoginIconDb" class="platform-intro-item-icon" alt="数据融合" />
            <!-- 描述信息 -->
            <div class="platform-intro-item-desc">
              <div class="platform-intro-item-title">数据融合</div>
              <div class="platform-intro-item-subtitle">多方位数据存储功能融合</div>
            </div>
          </div>
        </div>

        <!-- 公司版权 -->
        <div class="copyright">©2025天穹智能科技·保留所有权利</div>
      </div>

      <!-- 右侧面板 -->
      <div class="login-right-panel">
        <!-- 登录标题 -->
        <p class="login-info-title">欢迎回来</p>
        <!-- 登录子标题 -->
        <p class="login-info-subtitle">请登录您的账号继续访问</p>

        <!-- 登录表单 -->
        <t-form ref="form" :data="formData" :rules="rules" :labelWidth="0" @submit="onSubmit">
          <!-- 账号输入框 -->
          <t-form-item name="username">
            <t-input v-model="formData.username" size="large" clearable placeholder="用户名/手机号/邮箱">
              <template #prefix-icon>
                <user-icon size="20px" style="color: #003cab" />
              </template>
            </t-input>
          </t-form-item>

          <!-- 密码输入框 -->
          <t-form-item name="password">
            <t-input v-model="formData.password" size="large" type="password" clearable placeholder="密码">
              <template #prefix-icon>
                <lock-on-icon size="18px" style="color: #003cab" />
              </template>
            </t-input>
          </t-form-item>

          <!-- 验证码输入框 -->
          <t-form-item name="captcha">
            <t-input v-model="formData.captcha" size="large" clearable placeholder="验证码">
              <template #prefix-icon>
                <rotate-locked-filled-icon size="20px" style="color: #003cab" />
              </template>
            </t-input>
            <div class="captcha-container">
              <img @click="fetchCaptcha" :src="'data:image/png;base64,' + captchaB64" class="captcha-image" alt="验证码" />
            </div>
          </t-form-item>

          <!-- 登录操作 -->
          <div class="login-toolbar">
            <!-- 记住账号 -->
            <t-checkbox v-model="checked" @change="onChange"> 记住账号 </t-checkbox>
            <!-- 忘记密码 -->
            <t-link theme="primary"> 忘记密码? </t-link>
          </div>

          <!-- 登录按钮 -->
          <t-form-item>
            <t-button theme="primary" size="large" type="submit" block class="tracking-[4px]" :loading="loading">登录</t-button>
          </t-form-item>
        </t-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { UserIcon, LockOnIcon, RotateLockedFilledIcon } from 'tdesign-icons-vue-next'

import LoginLogoImage from '@/assets/images/login/login-logo.png'
import LoginIconProto from '@/assets/images/login/login-icon-proto.png'
import LoginIconSecure from '@/assets/images/login/login-icon-secure.png'
import LoginIconDb from '@/assets/images/login/login-icon-db.png'
import { useAuthStore } from '@/store'
import { captchaApi } from '@/api/auth'
import { useRouter } from 'vue-router'
import { useRouteQuery } from '@/hooks/useRouteQuery'

// 路由对象
const router = useRouter()

// 路由地址查询
const { redirect, otherQuery } = useRouteQuery()

// 引入认证状态管理
const authStore = useAuthStore()

// 登录按钮加载状态
const loading = ref(false)

// 验证码图片
const captchaB64 = ref('')

// 记住账号勾选框状态
const checked = ref(true)

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  captchaId: '',
  captcha: '',
})

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '账号必填' },
    { whitespace: true, message: '姓名不能为空' },
    { min: 3, message: '输入字数应在3到6之间' },
    { max: 6, message: '输入字数应在3到6之间' },
  ],
  password: [
    { required: true, message: '密码必填' },
    { whitespace: true, message: '密码不能为空' },
  ],
  captcha: [
    { required: true, message: '验证码必填' },
    { whitespace: true, message: '验证码不能为空' },
  ],
}

// 记住账号
const onChange = (val) => {
  console.log('change:', checked.value, val)
}

// 获取验证码
const fetchCaptcha = async () => {
  try {
    // 调用验证码接口
    const response = await captchaApi()
    const { uuid, captcha } = response.data
    // 设置验证码
    formData.captchaId = uuid
    captchaB64.value = captcha
  } catch (e) {
    console.error('failed to fetch captcha:', e)
  }
}

// 页面初始化获取验证码
onMounted(async () => {
  fetchCaptcha()
})

// 登录提交
const onSubmit = async ({ validateResult, firstError, e }) => {
  // 设置加载状态
  loading.value = true

  // 阻止默认提交
  e.preventDefault()

  // 参数校验失败
  if (validateResult !== true) {
    console.log('Validate Errors: ', firstError, validateResult)
    loading.value = false
    return
  }

  // 登录
  try {
    // 调用登录接口
    await authStore.login(formData)
    MessagePlugin.success('登录成功')
    // 跳转页面
    router.push({ path: redirect.value || '/', query: otherQuery.value })
  } catch (error) {
    // 重新加载验证码
    await fetchCaptcha()
    // 清空验证码表单
    formData.captcha = ''
    // 打印日志
    console.error('login failed:', error)
  }

  // 取消加载状态
  loading.value = false
}
</script>

<style lang="scss" scoped>
// 登录页
.login-page {
  @apply w-full h-full flex items-center justify-center bg-gray-100;

  // 登录框
  .login-box {
    @apply min-w-[840px] min-h-[480px] flex rounded-xl overflow-hidden bg-white;
  }

  // 左侧面板
  .login-left-panel {
    @apply w-1/2 flex flex-col flex-1 justify-between px-5 pt-12 pb-4;
    background-image: linear-gradient(to bottom right, #1150c4 0%, #003cab 100%);

    // Icon
    .logo {
      @apply pl-3 w-[370px];
    }

    // 平台介绍
    .platform-intro {
      @apply pl-14 pb-4;

      // 平台介绍单项
      .platform-intro-item {
        @apply flex items-stretch;

        // 平台介绍单项图标
        .platform-intro-item-icon {
          @apply rounded-xl overflow-hidden border-[1.5px] border-white bg-transparent w-[46px] h-[46px] p-[6px];
        }

        // 平台介绍单项描述
        .platform-intro-item-desc {
          @apply ml-3 flex flex-col justify-around;

          // 平台介绍单项标题
          .platform-intro-item-title {
            @apply font-bold text-gray-50;
          }

          // 平台介绍单项子标题
          .platform-intro-item-subtitle {
            @apply text-[13px] text-gray-300;
          }
        }
      }
    }

    // 版权信息
    .copyright {
      @apply text-gray-50 text-[13px] text-center leading-10 tracking-2px;
    }
  }

  // 右侧面板
  .login-right-panel {
    @apply w-1/2 h-full px-10 pt-17 pb-12;

    // 登录信息标题
    .login-info-title {
      @apply text-[26px] tracking-4px;
    }

    // 登录信息子标题
    .login-info-subtitle {
      @apply text-gray-500 mt-4 text-[15px] tracking-2px pb-11;
    }

    // 登录操作
    .login-toolbar {
      @apply flex justify-between items-center pb-8;
    }

    // 验证码
    .captcha-container {
      @apply absolute top-[1px] right-[1px] z-1;

      .captcha-image {
        @apply cursor-pointer h-[38px];
      }
    }
  }
}
</style>
