<template>
  <div class="h-full flex flex-col gap-4">
    <!-- 搜索功能 -->
    <t-card title="用户管理" :bordered="false">
      <!-- 表单 -->
      <t-form ref="form" :data="formData" :label-width="80" label-align="left" :colon="true" @submit="onSubmit">
        <!-- 分行 -->
        <t-row>
          <!-- 搜索条件表单项 -->
          <t-col :span="10">
            <t-row :gutter="[24, 24]">
              <!-- 关键字 -->
              <t-col :span="4">
                <t-form-item label="关键字" name="keyword">
                  <t-input v-model.trim="formData.keyword" placeholder="用户名/昵称/手机/邮箱" class="max-w-[300px]" />
                </t-form-item>
              </t-col>

              <!-- 账号状态 -->
              <t-col :span="4">
                <t-form-item label="账号状态" name="status">
                  <t-select v-model="formData.status" placeholder="请选择账号状态" class="max-w-[300px]">
                    <t-option key="1" label="全部" value="-1" />
                    <t-option key="2" label="启用" value="1" />
                    <t-option key="3" label="禁用" value="0" />
                  </t-select>
                </t-form-item>
              </t-col>

              <!-- 开始时间 -->
              <t-col :span="4">
                <t-form-item label="开始时间" name="beginTime">
                  <t-date-picker
                    v-model="formData.beginTime"
                    enable-time-picker
                    allow-input
                    clearable
                    placeholder="请选择开始时间"
                    format="YYYY-MM-DD hh:mm:ss"
                    class="w-[300px]"
                  />
                </t-form-item>
              </t-col>

              <!-- 结束时间 -->
              <t-col :span="4">
                <t-form-item label="结束时间" name="endTime">
                  <t-date-picker
                    v-model="formData.endTime"
                    enable-time-picker
                    allow-input
                    clearable
                    placeholder="请选择结束时间"
                    format="YYYY-MM-DD hh:mm:ss"
                    class="w-[300px]"
                  />
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

    <!-- 数据表格 -->
    <t-card class="flex-1" :bordered="false">
      <!-- 操作按钮 -->
      <div class="flex justify-between items-center">
        <t-space>
          <!-- 新增用户 -->
          <t-button theme="primary" @click="handleUserCreate">
            <template #icon><t-icon name="add" /> </template>
            新增用户
          </t-button>

          <!-- 批量删除 -->
          <t-button variant="outline" theme="danger" @click="handleUserBatchDelete">
            <template #icon><t-icon name="delete" /> </template>
            批量删除
          </t-button>
        </t-space>
        <!-- 刷新用户列表 -->
        <t-button shape="square" theme="default" @click="fetchData">
          <template #icon><t-icon name="refresh" /> </template>
        </t-button>
      </div>

      <!-- 表格定义 -->
      <t-table
        row-key="id"
        :hover="true"
        :data="tableData"
        :columns="tableColumns"
        :loading="tableLoading"
        :pagination="pagination"
        :reserveSelectedRowOnPaginate="false"
        :selected-row-keys="selectedRowKeys"
        @page-change="onPageChange"
        @select-change="rehandleSelectChange"
        cell-empty-content="-"
        class="mt-4"
      >
        <!-- 用户头像 -->
        <template #avatar="{ row }">
          <t-avatar :image="row.avatar" size="22px" />
        </template>

        <!-- 用户性别 -->
        <template #gender="{ row }">
          <t-tag theme="success" variant="light-outline" v-if="row.gender === 1"> 男 </t-tag>
          <t-tag theme="success" variant="light-outline" v-else-if="row.gender === 2"> 女 </t-tag>
          <t-tag theme="success" variant="light-outline" v-else> 未知 </t-tag>
        </template>

        <!-- 用户状态 -->
        <template #status="{ row }">
          <t-switch v-model="row.status" @change="onChangeUserStatus(row)">
            <template #label="slotProps">
              <span class="text-[11px] pl-[4px] pr-[2px] py-[1px]">{{ slotProps.value ? '启用' : '禁用' }}</span>
            </template>
          </t-switch>
        </template>

        <!-- 最后登录时间 -->
        <template #lastLoginTime="{ row }">
          {{ row.lastLoginTime ? dayjs(row.lastLoginTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}
        </template>

        <!-- 创建时间 -->
        <template #createdTime="{ row }">
          {{ row.createdTime ? dayjs(row.createdTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}
        </template>

        <!-- 操作按钮 -->
        <template #operation="{ row }">
          <t-space size="0">
            <!-- 用户分配角色 -->
            <t-link theme="primary" @click="handleAssignRole(row)">分配角色</t-link>
            <t-divider layout="vertical" />

            <!-- 用户分配角色 -->
            <t-link theme="primary" @click="handleResetPassword(row)">重置密码</t-link>
            <t-divider layout="vertical" />

            <!-- 编辑用户 -->
            <t-link theme="primary" @click="handleUserUpdate(row)">编辑</t-link>
            <t-divider layout="vertical" />

            <!-- 删除角色 -->
            <t-link theme="primary" @click="handleUserDelete(row)">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </t-card>
  </div>

  <!-- 新增用户弹窗 -->
  <UserCreateDialog ref="userCreateDialog" @close="fetchData" />

  <!-- 更新用户弹窗 -->
  <UserUpdateDialog ref="userUpdateDialog" @close="fetchData" />

  <!-- 分配角色弹窗 -->
  <AssignRoleDialog ref="assignRoleDialog" />

  <!-- 重置密码弹窗 -->
  <ResetPasswordDialog ref="resetPasswordDialog" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { userListApi, userUpdateStatusApi, userDeleteApi } from '@/api/user'
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next'
import dayjs from 'dayjs'
import UserCreateDialog from './components/UserCreateDialog.vue'
import UserUpdateDialog from './components/UserUpdateDialog.vue'
import ResetPasswordDialog from './components/ResetPasswordDialog.vue'
import AssignRoleDialog from './components/AssignRoleDialog.vue'

const form = ref(null) // 搜索表单引用

const formData = ref({
  keyword: '',
  status: '',
  beginTime: '',
  endTime: '',
}) // 搜索表单数据

// 搜索表单提交
const onSubmit = async () => {
  console.log(formData.value)
  // 初始化表格
  await fetchData()
}

// 搜索表单提交事件
const submitForm = async () => {
  await form.value.submit()
}

// 搜索表单重置事件
const resetForm = async () => {
  form.value.reset()
  // 初始化表格
  await fetchData()
}

const tableData = ref([]) // 表格数据定义

const tableTotal = ref(0) // 表格数据总数

const tableColumns = [
  { colKey: 'row-select', type: 'multiple' },
  { colKey: 'avatar', title: '头像', width: 90 },
  { colKey: 'username', title: '账号', width: 150 },
  { colKey: 'nickname', title: '昵称', width: 120 },
  { colKey: 'mobile', title: '手机', width: 150 },
  { colKey: 'email', title: '邮箱', width: 200 },
  { colKey: 'gender', title: '性别' },
  { colKey: 'status', title: '角色状态', width: 150 },
  { colKey: 'lastLoginIp', title: '最后登录IP', width: 150 },
  { colKey: 'lastLoginTime', title: '最后登录时间', width: 200 },
  { colKey: 'createdBy', title: '创建用户', width: 150 },
  { colKey: 'createdTime', title: '创建时间', width: 200 },
  { colKey: 'operation', title: '操作', align: 'center', width: 300, fixed: 'right' },
] // 表格数据列配置

const tableLoading = ref(false) // 表格加载状态

const selectedRowKeys = ref([]) // 表格多选项目

const pagination = ref({
  defaultCurrent: 1,
  defaultPageSize: 10,
  total: 0,
}) // 表格分页配置

// 表格多选事件
const rehandleSelectChange = (value, ctx) => {
  selectedRowKeys.value = value
  console.log(value, ctx)
}

// 表格分页事件
const onPageChange = async (pageInfo) => {
  console.log('page-change', pageInfo)
  // 刷新数据
  pagination.value.current = pageInfo.current
  pagination.value.pageSize = pageInfo.pageSize
  await fetchData()
}

// 分页列表条件查询
const fetchData = async () => {
  tableLoading.value = true // 设置表格加载状态

  // 调用后台接口
  try {
    // 发送请求
    const response = await userListApi({
      pageNum: pagination.value.current || pagination.value.defaultCurrent,
      pageSize: pagination.value.pageSize || pagination.value.defaultPageSize,
      ...formData.value,
    })

    // 返回数据
    tableData.value = response.data.data || []
    tableTotal.value = response.data.total || 0
    console.log('获取用户列表:', tableData.value)

    // 更新分页
    pagination.value = {
      ...pagination.value,
      total: tableTotal.value,
    }
  } catch (error) {
    console.log(error)
  } finally {
    tableLoading.value = false
  }
}

// 页面挂载事件
onMounted(async () => {
  // 初始化表格
  await fetchData()
})

const userCreateDialog = ref(null) // 新增用户弹窗引用

// 新增用户事件
const handleUserCreate = () => {
  userCreateDialog.value.openDialog()
}

const userUpdateDialog = ref(null) // 更新用户弹窗引用

// 更新用户事件
const handleUserUpdate = (row) => {
  userUpdateDialog.value.openDialog(row)
}

const assignRoleDialog = ref(null) // 分配角色弹窗引用

// 分配角色事件
const handleAssignRole = (row) => {
  assignRoleDialog.value.openDialog(row.id)
}

const resetPasswordDialog = ref(null) // 重置密码弹窗引用

// 重置密码事件
const handleResetPassword = (row) => {
  resetPasswordDialog.value.openDialog(row.id)
}

// 删除用户事件
const handleUserDelete = (row) => {
  // 弹窗确认
  const confirmDia = DialogPlugin({
    theme: 'info',
    header: '删除用户',
    body: '确定要删除选中的用户吗?',
    confirmBtn: '确定',
    cancelBtn: '取消',
    onConfirm: async ({ e }) => {
      // 执行删除逻辑
      await userDeleteApi(row.id)
      MessagePlugin.success('用户删除成功')

      // 刷新数据
      await fetchData()

      // 隐藏弹窗
      console.log('删除用户:', row)
      confirmDia.hide()
    },
    onClose: ({ e, trigger }) => {
      confirmDia.hide()
    },
  })
}

// 批量删除用户事件
const handleUserBatchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    MessagePlugin.error('请先选择要删除的用户')
    return
  }

  // 弹窗确认
  const confirmDia = DialogPlugin({
    theme: 'info',
    header: '批量删除用户',
    body: '确定要删除选中的用户吗?',
    confirmBtn: '确定',
    cancelBtn: '取消',
    onConfirm: async ({ e }) => {
      // 执行批量删除逻辑
      await userDeleteApi(selectedRowKeys.value.join(','))
      console.log('批量删除用户:', selectedRowKeys.value.join(','))

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

// 切换用户状态
const onChangeUserStatus = (row) => {
  let body = ''

  if (row.status === true) {
    body = '确定要更新用户为启用状态吗?'
  } else {
    body = '确定要更新用户为禁用状态吗?'
  }

  // 弹窗确认
  const confirmDia = DialogPlugin({
    theme: 'info',
    header: '更新用户状态',
    body: body,
    confirmBtn: '确定',
    cancelBtn: '取消',
    onConfirm: async ({ e }) => {
      // 执行更新角色状态逻辑
      await userUpdateStatusApi(row.id, row.status)
      MessagePlugin.success('用户状态更新成功')

      // 隐藏弹窗
      console.log('用户状态更新:', row)
      confirmDia.hide()
    },
    onClose: async ({ e, trigger }) => {
      // 刷新数据
      await fetchData()
      confirmDia.hide()
    },
  })
}
</script>

<style lang="scss" scoped></style>
