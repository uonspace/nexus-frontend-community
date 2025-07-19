<template>
  <!-- 对话框 -->
  <t-dialog v-model:visible="visible" header="分配权限" width="32%" :closeOnOverlayClick="false" :closeOnEscKeydown="false" :on-close="onClose" :on-confirm="onConfirm">
    <!-- 控制条 -->
    <t-space>
      <t-checkbox v-model="expandAll" @change="onChangeExpand">展开/折叠</t-checkbox>
      <t-checkbox v-model="allChecked" @change="onChangeAllChecked">全选/全不选</t-checkbox>
      <t-checkbox v-model="checkStrictly" @change="onChangeCheckStrictly">父子联动</t-checkbox>
    </t-space>

    <!-- 树结构 -->
    <div class="border mt-4 px-2">
      <t-tree
        ref="tree"
        :data="treeData"
        :keys="{ label: 'name', value: 'id', children: 'children' }"
        :expandAll="expandAll"
        v-model="treeChecked"
        :checkStrictly="!checkStrictly"
        checkable
        activable
        line
        hover
        transition
      />
    </div>
  </t-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { buildTree } from '@/utils/tree'
import { menuListApi, menuListByRoleApi, menuAssignApi } from '@/api/menu'

const tree = ref(null)

// 展开/折叠
const expandAll = ref(false)
const onChangeExpand = (value) => {
  expandAll.value = value
}

// 全选/全不选
const allChecked = ref(false)
const treeChecked = ref([])
const onChangeAllChecked = (value) => {
  allChecked.value = value

  // 取得所有节点
  if (value) {
    const items = tree.value.getItems()
    const selection = []
    items.forEach((item) => {
      selection.push(item.value)
      console.log(`item->`, item.value)
    })
    treeChecked.value = selection
  } else {
    treeChecked.value = []
  }
}

// 父子联动
const checkStrictly = ref(true)
const onChangeCheckStrictly = (value) => {
  checkStrictly.value = value
}

const treeData = ref([])

// 角色id
const roleId = ref(0)

// 查询菜单列表
const fetchData = async (id) => {
  // 保存角色id
  roleId.value = id

  try {
    // 调用查询菜单列表接口
    let response = await menuListApi({ name: '' })
    // 构建菜单列表树
    let tree = buildTree(response.data)
    // 填充菜单列表数据
    treeData.value = tree

    // 查询角色对应的菜单列表
    response = await menuListByRoleApi(roleId.value)
    const selection = []
    response.data.forEach((item) => {
      selection.push(item.id)
    })
    // 回填菜单列表数据
    treeChecked.value = selection
  } catch (error) {
    console.log('查询菜单列表:', error)
  }
}

// 弹窗
const visible = ref(false)

// 弹窗确定按钮
const onConfirm = async (context) => {
  console.log('点击了确认按钮', context)

  // 分配菜单
  console.log(treeChecked.value)

  try {
    await menuAssignApi({ roleId: roleId.value, menuIds: treeChecked.value })
    visible.value = false
  } catch (error) {
    console.log('角色分配菜单:', error)
  }
}

// 弹窗取消按钮
const onClose = (context) => {
  console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发', context)
}

// 打开弹窗
const openDialog = async (id) => {
  visible.value = true
  // 清空数据
  expandAll.value = false
  allChecked.value = false
  checkStrictly.value = true
  treeChecked.value = []

  // 刷新菜单树
  await fetchData(id)
}

// 暴露函数
defineExpose({
  openDialog,
})
</script>

<style lang="scss" scoped></style>
