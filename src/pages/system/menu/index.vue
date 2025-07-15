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
          <t-button theme="primary" @click="handleMenuUpsert(null)">
            <template #icon><t-icon name="add" /> </template>
            新增菜单
          </t-button>

          <!-- 折叠展开 -->
          <t-button theme="default" @click="handleExpandAllToggle">
            <template #icon><t-icon :name="expandAll ? 'unfold-less' : 'unfold-more'" /> </template>
            {{ expandAll ? '收起全部' : '展开全部' }}
          </t-button>
        </t-space>

        <!-- 刷新菜单列表 -->
        <t-button shape="square" theme="default" @click="fetchData">
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
            <t-link theme="primary" @click="handleMenuUpsert(row.id)">新增</t-link>
            <t-divider layout="vertical" />

            <!-- 编辑菜单 -->
            <t-link theme="primary" @click="handleMenuUpsert(row)">编辑</t-link>
            <t-divider layout="vertical" />

            <!-- 删除菜单 -->
            <t-link theme="primary" @click="handleMenuDelete(row)">删除</t-link>
          </t-space>
        </template>
      </t-enhanced-table>
    </t-card>
  </div>

  <!-- 菜单弹窗 -->
  <UpsertMenuDialog ref="upsertMenuDialogRef" @close="handleCloseUpsertMenuDialog" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next'
import { menuListApi, menuDeleteApi } from '@/api/menu'
import { buildTree } from '@/utils/tree'
import UpsertMenuDialog from './components/UpsertMenuDialog.vue'

const tableRef = ref(null) // 树形表格引用

const tableData = ref([]) // 树形表格数据

const expandAll = ref(false) // 树形表格展开

const tableColumns = [
  { colKey: 'name', title: '名称', width: 220 },
  { colKey: 'type', title: '类型', width: 80 },
  { colKey: 'icon', title: '图标', width: 80 },
  { colKey: 'component', title: '组件路径', width: 280 },
  { colKey: 'permission', title: '权限标识', width: 250 },
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
  expandTreeNodeOnClick: false,
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

// 树形表格全部展开折叠
const handleExpandAllToggle = () => {
  expandAll.value = !expandAll.value
  expandAll.value ? tableRef.value.expandAll() : tableRef.value.foldAll()
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
  // 刷新数据
  await fetchData()
}

// 搜索表单提交事件
const submitForm = async () => {
  await form.value.submit()
}

// 搜索表单重置事件
const resetForm = async () => {
  form.value.reset()
  // 刷新数据
  await fetchData()
}

const upsertMenuDialogRef = ref(null) // 菜单弹窗引用

// 新增或更新菜单
const handleMenuUpsert = async (row) => {
  upsertMenuDialogRef.value.openDialog(row)
}

// 删除菜单
const handleMenuDelete = async (row) => {
  // 弹窗确认
  const confirmDia = DialogPlugin({
    theme: 'info',
    header: '删除菜单',
    body: '确定要删除选中的菜单吗?',
    confirmBtn: '确定',
    cancelBtn: '取消',
    onConfirm: async ({ e }) => {
      // 执行删除逻辑
      await menuDeleteApi(row.id)
      MessagePlugin.success('菜单删除成功')

      // 刷新数据
      await fetchData()

      // 隐藏弹窗
      console.log('删除菜单:', row)
      confirmDia.hide()
    },
    onClose: ({ e, trigger }) => {
      confirmDia.hide()
    },
  })
}

// 关闭菜单弹窗事件
const handleCloseUpsertMenuDialog = async () => {
  await fetchData()
}
</script>

<style lang="scss" scoped></style>
