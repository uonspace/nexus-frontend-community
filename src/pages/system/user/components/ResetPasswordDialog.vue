<template>
  <!-- 对话框 -->
  <t-dialog
    v-model:visible="visible"
    header="重置密码"
    width="32%"
    :closeOnOverlayClick="false"
    :closeOnEscKeydown="false"
    :on-close="onClose"
    :on-confirm="onConfirm"
  >
    <!-- 表单 -->
    <t-form ref="form" :rules="FORM_RULES" :data="formData" :colon="true" @submit="onSubmit">
      <t-form-item label="用户密码" name="password">
        <div class="w-full flex gap-4">
          <t-input v-model.trim="formData.password" type="password" placeholder="请输入新的用户密码" />
          <t-button theme="default" @click="handlePassword">系统默认</t-button>
        </div>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { userUpdatePasswordApi } from '@/api/user'

const INITIAL_DATA = {
  id: 0,
  password: '',
} // 表单初始化数据

const FORM_RULES = {
  password: [
    { required: true, message: '用户密码必填' },
    { whitespace: true, message: '用户密码不能为空' },
    { min: 6, message: '输入字数应在6到20之间' },
    { max: 20, message: '输入字数应在6到20之间' },
    { pattern: /^[a-zA-Z0-9!@#$%^&*()_+=-`~`{}\[\]|\:;'<>,.?/]*$/, message: '密码只能是英文大小写或某些特殊符号' },
  ],
} // 表单验证规则

const form = ref(null) // 表单对象引用

const formData = ref({ ...INITIAL_DATA }) // 表单数据

// 默认密码生成
const handlePassword = () => {
  formData.value.password = '123456'
}

// 表单提交
const onSubmit = async ({ validateResult, firstError }) => {
  if (validateResult === true) {
    try {
      // 新增用户
      await userUpdatePasswordApi(formData.value.id, formData.value.password)
      MessagePlugin.success('用户密码重置成功')

      // 关闭弹窗
      visible.value = false
    } catch (error) {
      console.log('用户密码重置失败: ', error)
    }
  } else {
    console.log('校验错误: ', firstError, validateResult)
  }
}

const visible = ref(false) // 弹窗显隐状态

// 弹窗确定按钮
const onConfirm = async (ctx) => {
  console.log('弹窗点击了确认按钮', ctx)
  // 提交表单
  await form.value.submit()
}

// 弹窗取消按钮
const onClose = async (ctx) => {
  console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发', ctx)
}

// 打开弹窗
const openDialog = (id) => {
  visible.value = true
  formData.value.id = id
}

// 暴露函数
defineExpose({
  openDialog,
})
</script>

<style lang="scss" scoped></style>
