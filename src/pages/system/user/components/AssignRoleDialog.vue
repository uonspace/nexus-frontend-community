<template>
  <!-- 对话框 -->
  <t-dialog v-model:visible="visible" header="分配角色" width="28%" :closeOnOverlayClick="false" :closeOnEscKeydown="false" :on-close="onClose" :on-confirm="onConfirm">
    <!-- 传送框 -->
    <t-transfer
      class="flex justify-center mt-4"
      v-model="targetValue"
      :data="data"
      :checked-value="checked"
      :pagination="pagination"
      :search="true"
      @change="onChange"
      @checked-change="handleCheckedChange"
    >
      <template #title="props">
        <div>{{ props.type === 'target' ? '已有角色' : '全部角色' }}</div>
      </template>
    </t-transfer>
  </t-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { roleListAllApi, roleListByUserIdApi, roleAssignApi } from '@/api/role'

const userId = ref(0) // 用户Id

const data = ref([]) // 传送框数据

const targetValue = ref([]) // 传送框目标数据

const checked = ref([]) // 传送框选择数据

const pagination = ref({
  pageSize: 10,
  defaultCurrent: 1,
}) // 传送框分页

// 传送框选中事件
const handleCheckedChange = ({ checked: checkedVal, sourceChecked, targetChecked, type }) => {
  console.log('handleCheckedChange', {
    checkedVal,
    sourceChecked,
    targetChecked,
    type,
  })
  checked.value = checkedVal
}

// 传送框确认事件
const onChange = (newTargetValue) => {
  console.log('newTargetValue', newTargetValue, 'targetValue', targetValue.value)
}

// 获取传送框数据
const fetchData = async () => {
  try {
    // 获取数据
    let response = await roleListAllApi()

    // 填充左侧传送框
    response.data.data.forEach((role) => {
      data.value.push({
        value: role.id,
        label: role.name,
      })
    })

    // 获取数据
    response = await roleListByUserIdApi(userId.value)
    console.log(response.data)
    response.data.forEach((role) => {
      targetValue.value.push(role.id)
    })
  } catch (e) {
    console.log(e)
  }
}

const visible = ref(false) // 弹窗显隐状态

// 弹窗确定按钮
const onConfirm = async (ctx) => {
  console.log('弹窗点击了确认按钮', ctx)

  // 分配角色
  try {
    // 调用接口
    await roleAssignApi({ userId: userId.value, roleIds: targetValue.value })
    MessagePlugin.success('用户分配角色成功')

    // 关闭窗口
    visible.value = false
  } catch (error) {
    console.log('分配角色失败', error)
  }
}

// 弹窗取消按钮
const onClose = async (ctx) => {
  console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发', ctx)
}

// 打开弹窗
const openDialog = async (id) => {
  visible.value = true
  userId.value = id

  // 清空目标框
  targetValue.value = []
  checked.value = []
  data.value = []

  // 获取数据
  await fetchData()
}

// 暴露函数
defineExpose({
  openDialog,
})
</script>

<style lang="scss"></style>
