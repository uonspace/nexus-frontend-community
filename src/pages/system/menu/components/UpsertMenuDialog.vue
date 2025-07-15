<template>
  <!-- 对话框 -->
  <t-dialog
    v-model:visible="visible"
    header="添加菜单"
    width="32%"
    top="70px"
    :closeOnOverlayClick="false"
    :closeOnEscKeydown="false"
    :on-close="onClose"
    :on-confirm="onConfirm"
  >
    <!-- 表单 -->
    <t-form ref="form" :rules="FORM_RULES" :data="formData" :colon="true" @submit="onSubmit">
      <t-form-item label="上级菜单" name="parentId">
        <t-tree-select
          v-model="formData.parentId"
          :data="menus"
          :keys="{ value: 'id', label: 'name', children: 'children' }"
          placeholder="请选择父节点"
          clearable
          filterable
        />
      </t-form-item>

      <t-form-item label="菜单类型" name="type">
        <t-radio-group v-model.number="formData.type">
          <t-radio :value="0">目录</t-radio>
          <t-radio :value="1">菜单</t-radio>
          <t-radio :value="2">按钮</t-radio>
        </t-radio-group>
      </t-form-item>

      <t-form-item label="菜单名称" name="name">
        <t-input v-model.trim="formData.name" placeholder="请输入菜单名称" />
      </t-form-item>

      <t-form-item label="组件名称" name="componentName" requiredMark v-if="formData.type === 1">
        <t-input v-model.trim="formData.componentName" placeholder="请输入组件名称" />
      </t-form-item>

      <t-form-item label="组件地址" name="component" requiredMark v-if="formData.type === 1">
        <t-input v-model.trim="formData.component" placeholder="请输入组件地址" />
      </t-form-item>

      <t-form-item label="路由地址" name="path" requiredMark v-if="formData.type !== 2">
        <t-input v-model.trim="formData.path" placeholder="请输入路由地址" />
      </t-form-item>

      <t-form-item label="权限字符" name="permission" v-if="formData.type !== 0">
        <t-input v-model.trim="formData.permission" placeholder="请输入权限字符" />
      </t-form-item>

      <t-form-item label="菜单图标" name="icon" v-if="formData.type !== 2">
        <t-select v-model="formData.icon" placeholder="请选择菜单图标" :popup-props="{ overlayInnerStyle: { width: '400px' } }">
          <t-option v-for="item in options" :key="item.stem" :value="item.stem" class="overlay-options">
            <div>
              <t-icon :name="item.stem" size="18px" />
            </div>
          </t-option>
          <template #valueDisplay v-if="formData.icon"
            ><t-icon :name="formData.icon" :style="{ marginRight: '8px' }" />{{ formData.icon }}</template
          >
        </t-select>
      </t-form-item>

      <t-form-item label="显示排序" name="sort">
        <t-input-number v-model="formData.sort" />
      </t-form-item>

      <t-form-item label="显示状态" name="hidden">
        <t-radio-group v-model.number="formData.hidden">
          <t-radio :value="0">显示</t-radio>
          <t-radio :value="1">隐藏</t-radio>
        </t-radio-group>
      </t-form-item>

      <t-form-item label="菜单状态" name="status">
        <t-radio-group v-model.number="formData.status">
          <t-radio :value="1">正常</t-radio>
          <t-radio :value="0">停用</t-radio>
        </t-radio-group>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { manifest } from 'tdesign-icons-vue-next'

import { menuListApi, menuUpsertApi } from '@/api/menu'
import { buildTree } from '@/utils/tree'

const options = ref(manifest) // 获取全部图标的列表

const emits = defineEmits(['close']) // 回调事件

const INITIAL_DATA = {
  id: null,
  parentId: '',
  type: 0,
  name: '',
  icon: '',
  componentName: '',
  component: '',
  path: '',
  permission: '',
  sort: 0,
  hidden: 0,
  status: 1,
} // 表单初始化数据

const FORM_RULES = {
  name: [
    { required: true, message: '菜单名称必填' },
    { whitespace: true, message: '菜单名称不能为空' },
    { min: 4, message: '输入字数应在4到20之间' },
    { max: 20, message: '输入字数应在4到20之间' },
  ],
} // 表单验证规则

const form = ref(null) // 表单对象引用

const formData = ref({ ...INITIAL_DATA }) // 表单数据

// 表单提交
const onSubmit = async ({ validateResult, firstError }) => {
  if (validateResult === true) {
    try {
      console.log(formData.value)

      // 新增或修改菜单
      await menuUpsertApi(formData.value)

      // 判断新增还是修改
      if (formData.value.id === null) {
        MessagePlugin.success('菜单创建成功')
      } else {
        MessagePlugin.success('菜单更新成功')
      }

      // 关闭弹窗
      emits('close')
      visible.value = false
    } catch (error) {
      console.log('创建失败: ', error)
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
const openDialog = async (data) => {
  visible.value = true

  // 重置表单
  form.value.reset({ type: 'initial' })

  // 初始化菜单列表
  await fetchMenuList()
  // 判断新增还是更新
  if (data) {
    // 如果传递名称则为更新
    if (data.name) {
      Object.assign(formData.value, data)
    } else {
      // 新增菜单(传递的只有id)
      // 设置父分类
      formData.value.parentId = data
    }
  }
}

// 树选择框
const menus = ref([
  {
    id: 0,
    name: '根目录',
    children: [],
  },
])

// 初始化菜单列表
const fetchMenuList = async () => {
  try {
    // 调用接口
    const response = await menuListApi({ name: '' })
    // 构建菜单树
    const tree = buildTree(response.data)
    // 填充数据
    menus.value[0].children = tree
  } catch (error) {
    console.log('查询菜单列表:', error)
  }
}

// 暴露函数
defineExpose({
  openDialog,
})
</script>

<style lang="scss">
.overlay-options {
  display: inline-block;
  font-size: 20px;
}
</style>
