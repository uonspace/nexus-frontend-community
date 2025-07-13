<template>
  <div class="h-full flex flex-col gap-4">
    <!-- 搜索表单 -->
    <t-card title="角色管理" :bordered="false">
      <!-- 表单 -->
      <t-form ref="form" :data="formData" layout="inline" label-width="80px" label-align="left" :colon="true" @submit="onSubmit">
        <!-- 根据角色名称搜索 -->
        <t-form-item label="角色名称" name="name">
          <t-input v-model.trim="formData.name" placeholder="请输入角色名称" class="min-w-[250px]"></t-input>
        </t-form-item>

        <!-- 根据角色编码搜索 -->
        <t-form-item label="角色编码" name="code">
          <t-input v-model.trim="formData.code" placeholder="请输入角色编码" class="min-w-[250px]"></t-input>
        </t-form-item>

        <!-- 操作按钮 -->
        <t-space>
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
      </t-form>
    </t-card>

    <!-- 角色数据 -->
    <t-card class="flex-1" :bordered="false">
      <!-- 操作按钮 -->
      <div class="flex justify-between items-center">
        <t-space>
          <!-- 新增角色 -->
          <t-button theme="primary" @click="handleAddRole">
            <template #icon><t-icon name="add" /> </template>
            新增角色
          </t-button>

          <!-- 批量删除 -->
          <t-button variant="outline" theme="danger" @click="handleBatchDelete">
            <template #icon><t-icon name="delete" /> </template>
            批量删除
          </t-button>
        </t-space>
        <!-- 刷新角色列表 -->
        <t-button shape="square" theme="default" @click="fetchData">
          <template #icon><t-icon name="refresh" /> </template>
        </t-button>
      </div>

      <!-- 角色表格 -->
      <t-table
        row-key="id"
        :data="data"
        :columns="columns"
        :hover="true"
        :loading="dataLoading"
        :pagination="pagination"
        :reserveSelectedRowOnPaginate="false"
        :selected-row-keys="selectedRowKeys"
        @page-change="onPageChange"
        @select-change="rehandleSelectChange"
        cell-empty-content="-"
        class="mt-4"
      >
        <!-- 角色状态 -->
        <template #status="{ row }">
          <t-switch v-model="row.status" @change="onChangeStatus(row)">
            <template #label="slotProps">
              <span class="text-[11px] pl-[4px] pr-[2px] py-[1px]">{{ slotProps.value ? '启用' : '禁用' }}</span>
            </template>
          </t-switch>
        </template>

        <!-- 操作按钮 -->
        <template #operate="{ row }">
          <t-space size="0">
            <!-- 编辑角色 -->
            <t-link theme="primary" @click="handleEditRole(row)">编辑</t-link>
            <t-divider layout="vertical" />

            <!-- 角色分配权限 -->
            <t-link theme="primary">权限</t-link>
            <t-divider layout="vertical" />

            <!-- 删除角色 -->
            <t-link theme="primary" @click="handleDeleteRole(row)">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </t-card>
  </div>

  <!-- 角色表单组件 -->
  <RoleForm ref="roleFormRef" @close="handleCloseRoleForm" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RoleForm from './components/RoleForm.vue'
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next'
import { roleListApi, roleUpdateApi, roleDeleteApi } from '@/api/role'

// 搜索表单
const formData = ref({
  name: '',
  code: '',
})

// 表单引用
const form = ref(null)

// 提交表单事件
const onSubmit = async () => {
  // 刷新数据
  await fetchData()
}

// 提交表单查询
const submitForm = async () => {
  await form.value.submit()
}

// 重置表单
const resetForm = async () => {
  form.value.reset()
  // 刷新数据
  await fetchData()
}

// 表格列配置
const columns = ref([
  { colKey: 'row-select', type: 'multiple' },
  { colKey: 'name', title: '角色名称' },
  { colKey: 'code', title: '角色编码' },
  { colKey: 'status', title: '角色状态', width: '150px' },
  { colKey: 'sort', title: '角色排序', width: '150px' },
  { colKey: 'description', title: '角色描述' },
  { colKey: 'operate', title: '操作', align: 'center', width: '250px' },
])

// 表格数据
const data = ref([])
const total = ref(0)
const dataLoading = ref(false)

// 分页配置
const pagination = ref({
  defaultCurrent: 1,
  defaultPageSize: 10,
  total: 0,
})

// 分页事件
const onPageChange = async (pageInfo) => {
  console.log('page-change', pageInfo)
  pagination.value.current = pageInfo.current
  pagination.value.pageSize = pageInfo.pageSize
  await fetchData(pageInfo)
}

// 获取表格数据
const fetchData = async () => {
  dataLoading.value = true
  try {
    // 发起请求
    console.log(pagination.value)

    const response = await roleListApi({
      pageNum: pagination.value.current || pagination.value.defaultCurrent,
      pageSize: pagination.value.pageSize || pagination.value.defaultPageSize,
      ...formData.value,
    })

    // 获取数据
    data.value = response.data.data || []
    total.value = response.data.total || 0
    console.log('获取角色列表:', data.value)

    // 更新分页信息
    pagination.value = {
      ...pagination.value,
      total: total.value,
    }
  } catch (e) {
    console.log(e)
  } finally {
    dataLoading.value = false
  }
}

// 页面挂载时获取数据
onMounted(async () => {
  await fetchData()
})

// 批量删除
const selectedRowKeys = ref([])

const rehandleSelectChange = (value, ctx) => {
  selectedRowKeys.value = value
  console.log(value, ctx)
}

const handleBatchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    MessagePlugin.error('请先选择要删除的角色')
    return
  }

  // 弹窗确认
  const confirmDia = DialogPlugin({
    theme: 'info',
    header: '批量删除角色',
    body: '确定要删除选中的角色吗?',
    confirmBtn: '确定',
    cancelBtn: '取消',
    onConfirm: async ({ e }) => {
      // 执行批量删除逻辑
      await roleDeleteApi(selectedRowKeys.value.join(','))
      console.log('批量删除角色:', selectedRowKeys.value.join(','))

      // 刷新数据
      await fetchData()

      // 隐藏弹窗
      confirmDia.hide()
    },
    onClose: ({ e, trigger }) => {
      confirmDia.hide()
    },
  })
}

// 角色表单组件引用
const roleFormRef = ref(null)

// 新增角色
const handleAddRole = () => {
  roleFormRef.value.openDialog()
}

// 编辑角色
const handleEditRole = (row) => {
  // 打开角色表单弹窗
  roleFormRef.value.openDialog(row)
}

// 删除角色
const handleDeleteRole = (row) => {
  // 弹窗确认
  const confirmDia = DialogPlugin({
    theme: 'info',
    header: '删除角色',
    body: '确定要删除选中的角色吗?',
    confirmBtn: '确定',
    cancelBtn: '取消',
    onConfirm: async ({ e }) => {
      // 执行删除逻辑
      await roleDeleteApi(row.id)
      MessagePlugin.success('角色删除成功')

      // 刷新数据
      await fetchData()

      // 隐藏弹窗
      console.log('删除角色:', row)
      confirmDia.hide()
    },
    onClose: ({ e, trigger }) => {
      confirmDia.hide()
    },
  })
}

// 关闭角色表单弹窗
const handleCloseRoleForm = async () => {
  await fetchData() // 刷新数据
}

// 更新状态
const onChangeStatus = (row) => {
  console.log(row)

  let status = row.status
  let body = ''

  if (status) {
    body = '确定要更新角色为启用状态吗?'
  } else {
    body = '确定要更新角色为禁用状态吗?'
  }

  // 弹窗确认
  const confirmDia = DialogPlugin({
    theme: 'info',
    header: '更新角色状态',
    body: body,
    confirmBtn: '确定',
    cancelBtn: '取消',
    onConfirm: async ({ e }) => {
      // 执行更新角色状态逻辑
      await roleUpdateApi(row)
      MessagePlugin.success('角色状态更新成功')

      // 刷新数据
      await fetchData()

      // 隐藏弹窗
      console.log('角色状态更新:', row)
      confirmDia.hide()
    },
    onClose: ({ e, trigger }) => {
      // 取消恢复原状态
      row.status = !row.status
      confirmDia.hide()
    },
  })
}
</script>

<style lang="scss" scoped></style>
