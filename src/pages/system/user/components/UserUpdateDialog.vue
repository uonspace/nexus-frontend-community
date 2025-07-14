<template>
  <!-- 对话框 -->
  <t-dialog
    v-model:visible="visible"
    header="新增用户"
    width="32%"
    :closeOnOverlayClick="false"
    :closeOnEscKeydown="false"
    :on-close="onClose"
    :on-confirm="onConfirm"
  >
    <!-- 表单 -->
    <t-form ref="form" :rules="FORM_RULES" :data="formData" :colon="true" @submit="onSubmit">
      <t-form-item label="用户账号" name="username">
        <t-input v-model.trim="formData.username" placeholder="请输入用户账号" />
      </t-form-item>

      <t-form-item label="用户昵称" name="nickname">
        <t-input v-model.trim="formData.nickname" placeholder="请输入用户昵称" />
      </t-form-item>

      <t-form-item label="用户头像" name="avatar">
        <t-input v-model.trim="formData.avatar" placeholder="请输入用户头像" />
      </t-form-item>

      <t-form-item label="用户手机" name="mobile">
        <t-input v-model.trim="formData.mobile" placeholder="请输入用户手机" />
      </t-form-item>

      <t-form-item label="用户邮箱" name="email">
        <t-input v-model.trim="formData.email" placeholder="请输入用户邮箱" />
      </t-form-item>

      <t-form-item label="用户性别" name="gender">
        <t-radio-group v-model.number="formData.gender">
          <t-radio :value="0">未知</t-radio>
          <t-radio :value="1">男</t-radio>
          <t-radio :value="2">女</t-radio>
        </t-radio-group>
      </t-form-item>

      <t-form-item label="用户状态" name="status">
        <t-switch v-model="formData.status" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { userUpdateApi } from '@/api/user'

const emits = defineEmits(['close']) // 回调事件

const INITIAL_DATA = {
  id: null,
  username: '',
  nickname: '',
  avatar: null,
  mobile: null,
  email: null,
  gender: 0,
  status: true,
} // 表单初始化数据

const FORM_RULES = {
  username: [
    { required: true, message: '用户名称必填' },
    { whitespace: true, message: '用户名称不能为空' },
    { min: 4, message: '输入字数应在4到20之间' },
    { max: 20, message: '输入字数应在4到20之间' },
    { pattern: /^[a-zA-Z0-9]+$/, message: '账号只能是英文大小写或数字' },
  ],
  nickname: [
    { required: true, message: '用户昵称必填' },
    { whitespace: true, message: '用户昵称不能为空' },
    { min: 2, message: '输入字数应在2到20之间' },
    { max: 20, message: '输入字数应在2到20之间' },
  ],
  mobile: [{ telnumber: true, message: '手机号格式不正确' }],
  email: [{ email: true, message: '邮箱格式不正确' }],
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
      await userUpdateApi(formData.value)
      MessagePlugin.success('用户更新成功')

      // 关闭弹窗
      emits('close')
      visible.value = false
    } catch (error) {
      console.log('更新失败: ', error)
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
const openDialog = (user) => {
  visible.value = true
  // 拷贝数据
  console.log(user)
  Object.assign(formData.value, user)
}

// 暴露函数
defineExpose({
  openDialog,
})
</script>

<style lang="scss" scoped></style>
