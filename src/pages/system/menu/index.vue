<template>
  <div class="h-full flex flex-col gap-4">
    <!-- 搜索功能 -->
    <t-card title="菜单管理" :bordered="false">
      <!-- 表单 -->
      <t-form ref="form" :data="formData" :label-width="80" label-align="left" :colon="true" @submit="onSubmit">
        <!-- 分行 -->
        <t-row>
          <!-- 搜索条件表单项 -->
          <t-col :span="10">
            <t-row :gutter="[24, 24]">
              <!-- 菜单名称 -->
              <t-col :span="4">
                <t-form-item label="菜单名称" name="name">
                  <t-input v-model.trim="formData.name" placeholder="请输入菜单名称" class="max-w-[300px]" />
                </t-form-item>
              </t-col>

              <!-- 菜单状态 -->
              <t-col :span="4">
                <t-form-item label="账号状态" name="status">
                  <t-select v-model="formData.status" placeholder="请选择菜单状态" class="max-w-[300px]">
                    <t-option key="1" label="正常" value="1" />
                    <t-option key="0" label="禁用" value="0" />
                  </t-select>
                </t-form-item>
              </t-col>
            </t-row>
          </t-col>

          <!-- 搜索操作 -->
          <t-col :span="2">
            <t-space class="flex justify-end">
              <!-- 查询按钮 -->
              <t-button theme="primary" @click="submitForm">
                <template #icon><t-icon name="search" /> </template>
                查询
              </t-button>

              <!-- 重置按钮 -->
              <t-button theme="default" variant="base" @click="resetForm">
                <template #icon><t-icon name="rotate" /> </template>
                重置
              </t-button>
            </t-space>
          </t-col>
        </t-row>
      </t-form>
    </t-card>

    <!-- 菜单列表 -->
    <t-card class="flex-1" :bordered="false">
      <!-- 操作按钮 -->
      <div class="flex justify-between items-center">
        <t-space>
          <!-- 新增菜单 -->
          <t-button theme="primary">
            <template #icon><t-icon name="add" /> </template>
            新增菜单
          </t-button>

          <!-- 折叠展开 -->
          <t-button theme="default">
            <template #icon><t-icon name="unfold-more" /> </template>
            全部展开
          </t-button>
        </t-space>

        <!-- 刷新菜单列表 -->
        <t-button shape="square" theme="default">
          <template #icon><t-icon name="refresh" /> </template>
        </t-button>
      </div>

      <!-- 菜单树形表格 -->
      <t-enhanced-table ref="tableRef" row-key="id" :data="tableData" :columns="tableColumns" :tree="tableConfig" class="mt-4">
        <!-- 菜单类型 -->
        <template #type="{ row }">
          <t-tag theme="primary" variant="light" v-if="row.type === 0">目录</t-tag>
          <t-tag theme="success" variant="light" v-else-if="row.type === 1">菜单</t-tag>
          <t-tag theme="warning" variant="light" v-else-if="row.type === 2">按钮</t-tag>
        </template>
        <!-- 图标 -->
        <template #icon="{ row }">
          <div class="flex items-center justify-begin">
            <t-icon :name="row.icon" size="20px" />
          </div>
        </template>
        <!-- 状态 -->
        <template #status="{ row }">
          <t-tag theme="success" v-if="row.status === 1">正常</t-tag>
          <t-tag theme="danger" v-else>禁用</t-tag>
        </template>
        <!-- 操作按钮 -->
        <template #operation="{ row }">
          <t-space size="0">
            <!-- 新增菜单 -->
            <t-link theme="primary">新增</t-link>
            <t-divider layout="vertical" />

            <!-- 编辑菜单 -->
            <t-link theme="primary">编辑</t-link>
            <t-divider layout="vertical" />

            <!-- 删除菜单 -->
            <t-link theme="primary">删除</t-link>
          </t-space>
        </template>
      </t-enhanced-table>
    </t-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { menuListApi } from '@/api/menu'

const tableRef = ref(null) // 树形表格引用

const tableData = ref([]) // 树形表格数据

const tableColumns = [
  { colKey: 'name', title: '名称', width: 150 },
  { colKey: 'type', title: '类型', width: 80 },
  { colKey: 'icon', title: '图标', width: 80 },
  { colKey: 'component', title: '组件路径', width: 220 },
  { colKey: 'permission', title: '权限标识', width: 220 },
  { colKey: 'path', title: '路由地址', width: 220 },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'sort', title: '排序', width: 70 },
  { colKey: 'createdTime', title: '创建时间', width: 200 },
  { colKey: 'operation', title: '操作', align: 'center', width: 190, fixed: 'right' },
] // 树形表格列配置

const tableConfig = ref({
  childrenKey: 'children',
  treeNodeColumnIndex: 0,
  indent: 25,
  expandTreeNodeOnClick: true,
}) // 树形表格配置

// 查询菜单列表
const fetchData = async () => {
  try {
    // 调用接口
    const response = await menuListApi(formData.value)
    // 构建菜单树
    const tree = buildTree(response.data)
    // 填充数据
    tableData.value = tree
  } catch (error) {
    console.log('查询菜单列表:', error)
  }
}

// 页面挂载事件
onMounted(async () => {
  await fetchData()
})

const form = ref(null) // 搜索表单引用

const formData = ref({
  name: '',
  status: '',
}) // 搜索表单数据

// 搜索表单提交
const onSubmit = async () => {
  console.log(formData.value)
}

// 搜索表单提交事件
const submitForm = async () => {
  await form.value.submit()
}

// 搜索表单重置事件
const resetForm = async () => {
  form.value.reset()
}

// 生成树
const buildTree = (list) => {
  // 根据id构建映射
  const map = list.reduce((memo, current) => {
    memo[current.id] = { ...current }
    return memo
  }, {})

  // 顶层目录
  const tree = []

  // 遍历每一项
  list.forEach((item) => {
    // 获取父项
    const pid = item.parentId

    // 找到映射的元素
    const current = map[item.id]

    // 判断父项是否存在
    if (pid !== 0 || pid !== null) {
      const parent = map[pid]
      if (parent) {
        const children = parent?.children || []
        children.push(current)
        parent.children = children
        return
      }
    }

    // 放置顶层
    tree.push(current)
  })

  // 打印
  console.log(tree)

  return tree
}
</script>

<style lang="scss" scoped></style>
