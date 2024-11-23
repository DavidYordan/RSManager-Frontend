<template>
  <el-dialog
    :title="dialogTitle"
    v-model="isDialogVisible"
    width="400px"
    :before-close="handleClose"
    @opened="resetForm"
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="用户ID">
        <el-input
          v-model="form.userId"
          placeholder="请输入用户ID"
          @input="handleInput('userId')"
          style="width: 200px;"
        />
      </el-form-item>

      <el-form-item label="用户名">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
          @input="handleInput('username')"
          style="width: 200px;"
        />
      </el-form-item>

      <el-form-item label="姓名">
        <el-input
          v-model="form.fullname"
          placeholder="请输入姓名"
          @input="handleInput('fullname')"
          style="width: 200px;"
        />
      </el-form-item>

      <el-form-item label="生效日期">
        <el-date-picker
          v-model="form.startDate"
          type="date"
          placeholder="选择生效日期"
          style="width: 200px;"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="findUser"
          :loading="isFinding"
          :disabled="isValidated"
        >
          {{ isValidated ? '已验证' : '验证' }}
        </el-button>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button
        type="primary"
        @click="submitForm"
        :disabled="!isValidated"
      >
        提交
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { findUser as apiFindUser, updateUser } from '@/api/user'

export default {
  name: 'FindUser',
  props: {
    fieldKey: {
      type: String,
      required: true,
      validator: (value) => ['managerName', 'teacherName'].includes(value),
    },
    currentUserId: {
      type: Number,
      required: true,
    },
  },
  emits: ['updateSuccess'],
  setup(props, { emit }) {
    const isDialogVisible = ref(false)
    const form = ref({
      userId: '',
      username: '',
      fullname: '',
      startDate: new Date()
    })
    const isFinding = ref(false)
    const isValidated = ref(false)

    // Dialog title based on role
    const dialogTitle = ref('');

    // Watch for role changes to update dialog title
    watch(() => props.fieldKey, (newFieldKey) => {
      if (newFieldKey === 'managerName') {
        dialogTitle.value = '查找并设置主管';
      } else if (newFieldKey === 'teacherName') {
        dialogTitle.value = '查找并设置导师';
      }
    }, { immediate: true });

    // 打开对话框的方法
    const openDialog = () => {
      isDialogVisible.value = true
    }

    // 重置表单
    const resetForm = () => {
      form.value.userId = ''
      form.value.username = ''
      form.value.fullname = ''
      form.value.startDate = new Date()
      isValidated.value = false
    }

    // 处理对话框关闭
    const handleClose = () => {
      resetForm()
      isDialogVisible.value = false
    }

    // 监听输入变化
    const handleInput = (field) => {
      if (isValidated.value) {
        // 清空其他字段
        if (field === 'userId') {
          form.value.username = ''
          form.value.fullname = ''
        } else if (field === 'username') {
          form.value.userId = ''
          form.value.fullname = ''
        } else if (field === 'fullname') {
          form.value.userId = ''
          form.value.username = ''
        }
        isValidated.value = false
      }
    }

    // 查找用户
    const findUser = async () => {
      const { userId, username, fullname } = form.value
      // 确保至少有一个字段有值
      if (!userId && !username && !fullname) {
        ElMessage.error('请至少填写一个字段进行验证')
        return
      }

      isFinding.value = true

      try {
        // 按顺序选择第一个有值的字段
        let queryParam = {}
        if (userId) {
          queryParam.userId = userId
        } else if (username) {
          queryParam.username = username
        } else if (fullname) {
          queryParam.fullname = fullname
        }

        const response = await apiFindUser(queryParam)
        if (response.data.success && response.data.data) {
          // 假设返回的数据结构包含 userId, username, fullname
          form.value.userId = response.data.data.userId || ''
          form.value.username = response.data.data.username || ''
          form.value.fullname = response.data.data.fullname || ''
          isValidated.value = true
          ElMessage.success('用户验证成功')
        } else {
          ElMessage.error('未找到匹配的用户')
        }
      } catch (error) {
        ElMessage.error('用户验证失败，请重试')
      } finally {
        isFinding.value = false
      }
    }

    // 提交表单
    const submitForm = async () => {
      const { userId } = form.value
      let payload = {
        userId: props.currentUserId,
        // 日期要转换为"yyyy-MM-dd"格式
        startDate: form.value.startDate.toISOString().split('T')[0]
      }
      if (props.fieldKey === 'managerName') {
        payload.managerId = userId
      } else if (props.fieldKey === 'teacherName') {
        payload.teacherId = userId
      }
      try {
        const response = await updateUser(payload)
        if (response.data.success) {
          ElMessage.success('提交成功')
          emit('updateSuccess', {
            userId: form.value.userId,
            username: form.value.username,
            fullname: form.value.fullname
          })
          handleClose()
        } else {
          ElMessage.error('提交失败')
        }
      } catch (error) {
        ElMessage.error('提交失败，请重试' + error.message)
      }
    }

    return {
      isDialogVisible,
      form,
      isFinding,
      isValidated,
      dialogTitle,
      openDialog,
      handleClose,
      findUser,
      submitForm,
      handleInput,
      resetForm
    }
  }
}
</script>

<style scoped>
/* 可根据需要添加样式 */
</style>
