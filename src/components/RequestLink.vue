<template>
  <el-dialog
    title="验证用户名和TikTok账号"
    v-model="isDialogVisible"
    width="400px"
    :before-close="handleClose"
  >
    <el-form :model="form">
      <el-form-item label="平台账号">
        <el-input v-model="form.username" placeholder="请输入用户名" style="width: 200px;" />
        <el-button
          type="primary"
          @click="validateUsername"
          :loading="isUsernameLoading"
          :disabled="isUsernameValidated"
          style="margin-left: 10px;"
        >
          验证
        </el-button>
      </el-form-item>
      <el-form-item label="TikTok账号">
        <el-input v-model="form.tiktokAccount" placeholder="请输入TikTok账号" style="width: 180px;" />
        <el-button
          type="primary"
          @click="validateTiktokAccount"
          :loading="isTiktokLoading"
          :disabled="isTiktokValidated"
          style="margin-left: 10px;"
        >
          验证
        </el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button
        type="primary"
        @click="submit"
        :disabled="!isUsernameValidated || !isTiktokValidated"
      >
        提交
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { findIdByPhoneFromTbuser } from '@/api/tbuser'
import { checkTiktok } from '@/api/tiktok'
import { submitForLink } from '@/api/application'

export default {
  props: {
    processId: {
      type: Number,
      required: true
    }
  },
  setup(props, { emit, expose }) {
    const isDialogVisible = ref(false)
    const form = ref({
      username: '',
      tiktokAccount: ''
    })
    const isUsernameLoading = ref(false)
    const isTiktokLoading = ref(false)
    const isUsernameValidated = ref(false)
    const isTiktokValidated = ref(false)
    const userId = ref(null)

    // 监听用户名变化
    watch(
      () => form.value.username,
      () => {
        isUsernameValidated.value = false
      }
    )

    // 监听TikTok账号变化
    watch(
      () => form.value.tiktokAccount,
      () => {
        isTiktokValidated.value = false
      }
    )

    const validateUsername = async () => {
      if (!form.value.username) {
        ElMessage.error('请输入用户名')
        return
      }
      isUsernameLoading.value = true

      try {
        const response = await findIdByPhoneFromTbuser(form.value.username)
        if (response.data.success && response.data.data.platformId) {
          userId.value = response.data.data.platformId
          isUsernameValidated.value = true
          ElMessage.success('用户名验证成功')
        } else {
          isUsernameValidated.value = false
          ElMessage.error('用户名验证失败')
        }
      } catch (error) {
        isUsernameValidated.value = false
        ElMessage.error('用户名验证失败')
      } finally {
        isUsernameLoading.value = false
      }
    }

    const validateTiktokAccount = async () => {
      if (!form.value.tiktokAccount) {
        ElMessage.error('请输入TikTok账号')
        return
      }
      isTiktokLoading.value = true

      try {
        console.log('form.value.tiktokAccount:', form.value.tiktokAccount)
        const response = await checkTiktok(form.value.tiktokAccount)
        console.log('response:', response)
        if (response.data.success) {
          isTiktokValidated.value = true
          ElMessage.success('TikTok账号允许创建')
        } else {
          isTiktokValidated.value = false
          ElMessage.error('TikTok账号已存在')
        }
      } catch (error) {
        isTiktokValidated.value = false
        ElMessage.error('TikTok账号验证失败')
      } finally {
        isTiktokLoading.value = false
      }
    }

    const submit = async () => {
      try {
        const response = await submitForLink({
          processId: props.processId,
          platformId: userId.value,
          username: form.value.username,
          tiktokAccount: form.value.tiktokAccount
        })
        if (response.data.success) {
          ElMessage.success('提交成功')
          handleClose()
          emit('linkSubmitted') // 通知父组件
        } else {
          ElMessage.error('提交失败')
        }
      } catch (error) {
        ElMessage.error('提交失败')
      }
    }

    const resetForm = () => {
      form.value.username = ''
      form.value.tiktokAccount = ''
      isUsernameValidated.value = false
      isTiktokValidated.value = false
    }

    const handleClose = () => {
      resetForm()
      isDialogVisible.value = false
    }

    expose({ openDialog: () => (isDialogVisible.value = true) })

    return {
      isDialogVisible,
      form,
      isUsernameLoading,
      isTiktokLoading,
      isUsernameValidated,
      isTiktokValidated,
      validateUsername,
      validateTiktokAccount,
      submit,
      handleClose
    }
  }
}
</script>
