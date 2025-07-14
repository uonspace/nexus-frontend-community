<template>
  <!-- 对话框 -->
  <t-dialog
    v-model:visible="visible"
    :header="header"
    width="32%"
    :closeOnOverlayClick="false"
    :closeOnEscKeydown="false"
    :on-close="onClose"
    :on-confirm="onConfirm"
  >
    <!-- 表单 -->
    <t-form ref="form" :rules="FORM_RULES" :data="formData" :colon="true" @submit="onSubmit">
      <t-form-item label="角色名称" name="name">
        <t-input v-model="formData.name" placeholder="请输入角色名称" />
      </t-form-item>

      <t-form-item label="角色编码" name="code">
        <t-input v-model="formData.code" placeholder="请输入角色编码" />
      </t-form-item>

      <t-form-item label="角色状态" name="status">
        <t-switch v-model="formData.status" />
      </t-form-item>

      <t-form-item label="角色排序" name="sort">
        <t-input-number v-model="formData.sort" />
      </t-form-item>

      <t-form-item label="角色描述" name="description">
        <t-textarea v-model="formData.description" placeholder="请输入角色描述" :maxlength="200" :autosize="{ minRows: 3, maxRows: 5 }" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { roleCreateApi, roleUpdateApi } from '@/api/role'

// 回调事件
const emits = defineEmits(['close'])

// 初始化数据
const INITIAL_DATA = {
  id: 0,
  name: '',
  code: '',
  status: true,
  sort: 1,
  description: '',
}

// 表单验证规则
const FORM_RULES = {
  name: [
    { required: true, message: '角色名称必填' },
    { whitespace: true, message: '角色名称不能为空' },
    { min: 4, message: '输入字数应在4到20之间' },
    { max: 20, message: '输入字数应在4到20之间' },
  ],
  code: [
    { required: true, message: '角色编码必填' },
    { whitespace: true, message: '角色编码不能为空' },
    { min: 4, message: '输入字数应在4到20之间' },
    { max: 20, message: '输入字数应在4到20之间' },
  ],
}

// 表单
const form = ref(null)

// 表单数据
const formData = ref({ ...INITIAL_DATA })

// 提交表单
const onSubmit = async ({ validateResult, firstError }) => {
  if (validateResult === true) {
    // 判断是新增还是编辑
    if (formData.value.id === 0) {
      // 新增角色
      await roleCreateApi(formData.value)
      MessagePlugin.success('角色创建成功')
    } else {
      // 编辑角色
      await roleUpdateApi(formData.value)
      MessagePlugin.success('角色更新成功')
    }

    // 关闭弹窗
    emits('close')
    visible.value = false
  } else {
    console.log('Validate Errors: ', firstError, validateResult)
  }
}

// 弹窗
const visible = ref(false)

const header = ref('新增角色')

// 弹窗确定按钮
const onConfirm = async (context) => {
  console.log('点击了确认按钮', context)

  // 提交表单
  await form.value.submit()
}

// 弹窗取消按钮
const onClose = (context) => {
  console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发', context)
}

// 打开弹窗
const openDialog = (role) => {
  visible.value = true
  if (role) {
    Object.assign(formData.value, role)
    header.value = '编辑角色'
  } else {
    header.value = '新增角色'
    form.value.reset({ type: 'initial' })
  }
}

// 暴露函数
defineExpose({
  openDialog,
})
</script>

<style lang="scss" scoped></style>
