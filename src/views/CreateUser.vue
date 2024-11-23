<template>
  <div class="create-user-container">
    <div
      class="create-user-form"
      v-loading="isSubmitting"
      :element-loading-text="$t('createUser.submitting')"
      :element-loading-background="'rgba(0, 0, 0, 0.7)'"
    >
      <el-row :gutter="20">
        <el-col :span="24" class="form-column">
          <el-form
            :model="form"
            ref="userForm"
            :rules="rules"
            label-width="140px"
            label-position="left"
          >
            <!-- 第一行：平台账号和平台ID -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('createUser.platformPhone')" prop="platformPhone">
                  <el-input
                    v-model="form.platformPhone"
                    :placeholder="$t('createUser.enterPlatformPhone')"
                    :disabled="isSubmitting"
                  ></el-input>
                  <span v-if="platformPhoneError" class="error-text">
                    {{ $t('createUser.platformPhoneNotFound') }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('createUser.platformId')" prop="platformId">
                  <template #label>
                  <el-button
                    :type="isPlatformValidated ? 'default' : 'primary'"
                    size="small"
                    @click="validatePlatformPhone"
                    :disabled="isPlatformValidated || isPlatformLoading || isSubmitting"
                    :loading="isPlatformLoading"
                    style="margin-left: 10px;"
                  >
                    <span>
                      {{
                        isPlatformValidated
                          ? $t('createUser.platformIdLabel')
                          : $t('createUser.getPlatformId')
                      }}
                    </span>
                  </el-button>
                </template>
                  <el-input
                    v-model="form.platformId"
                    :placeholder="$t('createUser.enterPlatformId')"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第二行：邀请人账号和邀请人ID -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('createUser.inviterName')" prop="inviterName">
                  <el-input
                    v-model="form.inviterName"
                    :disabled="isSubmitting"
                    :placeholder="$t('createUser.enterInviterName')"
                  ></el-input>
                  <span v-if="inviterNameError" class="error-text">
                    {{ $t('createUser.inviterNameNotFound') }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('createUser.inviterId')" prop="inviterId">
                  <template #label>
                  <el-button
                    :type="isInviterValidated ? 'default' : 'primary'"
                    size="small"
                    @click="validateInviterName"
                    :disabled="isInviterValidated || isInviterLoading || isSubmitting"
                    :loading="isInviterLoading"
                    style="margin-left: 10px;"
                  >
                    <span>
                      {{
                        isInviterValidated
                          ? $t('createUser.inviterIdLabel')
                          : $t('createUser.getInviterId')
                      }}
                    </span>
                  </el-button>
                </template>
                  <el-input
                    v-model="form.inviterId"
                    :placeholder="$t('createUser.enterInviterId')"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第三行：管理人账号和管理人ID -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('createUser.managerName')" prop="managerName">
                  <el-input
                    v-model="form.managerName"
                    :disabled="isSubmitting"
                    :placeholder="$t('createUser.enterManagerName')"
                  ></el-input>
                  <span v-if="managerNameError" class="error-text">
                    {{ $t('createUser.managerNameNotFound') }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('createUser.managerId')" prop="managerId">
                  <template #label>
                  <el-button
                    :type="isManagerValidated ? 'default' : 'primary'"
                    size="small"
                    @click="validateManagerName"
                    :disabled="isManagerValidated || isManagerLoading || isSubmitting"
                    :loading="isManagerLoading"
                    style="margin-left: 10px;"
                  >
                    <span>
                      {{
                        isManagerValidated
                          ? $t('createUser.managerIdLabel')
                          : $t('createUser.getManagerId')
                      }}
                    </span>
                  </el-button>
                </template>
                  <el-input
                    v-model="form.managerId"
                    :placeholder="$t('createUser.enterManagerId')"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第四行：Tiktok账号 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Tiktok账号" prop="tiktokAccount">
                  <el-input
                    v-model="form.tiktokAccount"
                    placeholder="输入Tiktok账号"
                    :disabled="isSubmitting"
                  ></el-input>
                  <span v-if="tiktokAccountError" class="error-text">
                    TikTok账号已存在
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="验证Tiktok账号">
                  <template #label>
                  <el-button
                    :type="isTiktokValidated ? 'default' : 'primary'"
                    size="small"
                    @click="validateTiktokAccount"
                    :disabled="isTiktokValidated || isTiktokLoading || isSubmitting"
                    :loading="isTiktokLoading"
                    style="margin-left: 10px;"
                  >
                    <span>
                      {{
                        isTiktokValidated
                          ? "验证通过"
                          : "验证Tiktok账号"
                      }}
                    </span>
                  </el-button>
                </template>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第五行：用户名和级别 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('createUser.username')" prop="username">
                  <el-input
                    v-model="form.username"
                    :placeholder="$t('createUser.enterUsername')"
                    :disabled="isSubmitting"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('createUser.roleId')"
                  prop="roleId"
                >
                  <el-select
                    v-model="form.roleId"
                    :disabled="isSubmitting"
                  >
                    <el-option
                      v-for="option in roleIdOptions"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第六行：全名和权益生效日期 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('createUser.fullname')" prop="fullname">
                  <el-input
                    v-model="form.fullname"
                    :placeholder="$t('createUser.enterFullname')"
                    :disabled="isSubmitting"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('createUser.startDate')" prop="startDate">
                  <el-date-picker
                    v-model="form.startDate"
                    type="date"
                    :placeholder="$t('createUser.selectDate')"
                    :disabled="isSubmitting"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第七行：地区和币种 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="地区" prop="regionName">
                  <el-input
                    v-model="form.regionName"
                    placeholder="输入地区"
                    :disabled="isSubmitting"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="币种" prop="currency">
                  <el-input
                    v-model="form.currency"
                    placeholder="输入币种"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 按钮组 -->
            <el-form-item>
              <div class="button-group">
                <el-button
                  type="primary"
                  @click="saveUser"
                  :disabled="!canCreate || isSubmitting"
                >
                  {{ $t('createUser.createUser') }}
                </el-button>
                <el-button @click="resetForm" :disabled="isSubmitting">
                  {{ $t('createUser.reset') }}
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { superCreate, findIdByPhoneFromUser } from '@/api/user'
import { findIdByPhoneFromTbuser } from '@/api/tbuser'
import { checkTiktok } from '@/api/tiktok'
import { ElMessage } from 'element-plus'

export default {
  name: "CreateUser",
  setup() {
    const { t } = useI18n()

    const isSubmitting = ref(false)
    const platformPhoneError = ref(false)
    const inviterNameError = ref(false)
    const managerNameError = ref(false)
    const tiktokAccountError = ref(false)
    const isPlatformValidated = ref(false)
    const isPlatformLoading = ref(false)
    const isInviterValidated = ref(false)
    const isInviterLoading = ref(false)
    const isManagerValidated = ref(false)
    const isManagerLoading = ref(false)
    const isTiktokValidated = ref(false)
    const isTiktokLoading = ref(false)

    const form = reactive({
      platformId: "",
      inviterId: "",
      managerId: "",
      tiktokAccount: "",
      username: "",
      roleId: 3,
      fullname: "",
      regionName: "",
      currency: "",
      startDate: new Date().toISOString().split("T")[0],
    })

    const rules = {
      username: [
        { required: true, message: t('createUser.requiredField'), trigger: "blur" },
      ],
    }

    const userForm = ref(null)

    const canCreate = computed(() => {
      return userForm.value && !isSubmitting.value
    })

    const validatePlatformPhone = async () => {
      if (!form.platformPhone) {
        ElMessage.error(t('createUser.requiredField'))
        return
      }

      isPlatformLoading.value = true
      platformPhoneError.value = false

      try {
        const response = await findIdByPhoneFromTbuser(form.platformPhone)
        if (response.data.success && response.data.data.platformId) {
          form.platformId = response.data.data.platformId
          form.username = form.platformPhone
          isPlatformValidated.value = true
          ElMessage.success(t('createUser.platformPhoneValidatedSuccessfully'))
        } else {
          form.platformId = ""
          isPlatformValidated.value = false
          platformPhoneError.value = true
          ElMessage.error(t('createUser.platformPhoneNotFound'))
        }
      } catch (error) {
        form.platformId = ""
        isPlatformValidated.value = false
        platformPhoneError.value = true
        ElMessage.error(t('createUser.platformPhoneValidationFailed'))
      } finally {
        isPlatformLoading.value = false
      }
    }

    const validateInviterName = async () => {
      if (!form.inviterName) {
        ElMessage.error(t('createUser.requiredField'))
        return
      }

      isInviterLoading.value = true
      inviterNameError.value = false

      try {
        const response = await findIdByPhoneFromUser(form.inviterName)
        if (response.data.success && response.data.data.userId) {
          form.inviterId = response.data.data.userId
          isInviterValidated.value = true
          ElMessage.success(t('createUser.inviterNameValidatedSuccessfully'))
        } else {
          form.inviterId = ""
          isInviterValidated.value = false
          inviterNameError.value = true
          ElMessage.error(t('createUser.inviterNameNotFound'))
        }
      } catch (error) {
        form.inviterId = ""
        isInviterValidated.value = false
        inviterNameError.value = true
        ElMessage.error(t('createUser.inviterNameValidationFailed'))
      } finally {
        isInviterLoading.value = false
      }
    }

    const validateManagerName = async () => {
      if (!form.managerName) {
        ElMessage.error(t('createUser.requiredField'))
        return
      }

      isManagerLoading.value = true
      managerNameError.value = false

      try {
        const response = await findIdByPhoneFromUser(form.managerName)
        if (response.data.success && response.data.data.userId) {
          form.managerId = response.data.data.userId
          isManagerValidated.value = true
          ElMessage.success(t('createUser.managerNameValidatedSuccessfully'))
        } else {
          form.managerId = ""
          isManagerValidated.value = false
          managerNameError.value = true
          ElMessage.error(t('createUser.managerNameNotFound'))
        }
      } catch (error) {
        form.managerId = ""
        isManagerValidated.value = false
        managerNameError.value = true
        ElMessage.error(t('createUser.managerNameValidationFailed'))
      } finally {
        isManagerLoading.value = false
      }
    }

    const validateTiktokAccount = async () => {
      if (!form.tiktokAccount) {
        ElMessage.error('请输入TikTok账号')
        return
      }
      isTiktokLoading.value = true

      try {
        const response = await checkTiktok(form.tiktokAccount)
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

    const saveUser = async () => {
      userForm.value.validate(async (valid) => {
        if (!valid) {
          ElMessage.error(t('createUser.formValidationFailed'))
          return
        }

        isSubmitting.value = true

        try {
          const userData = {
            platformId: form.platformId,
            inviterId: form.inviterId,
            managerId: form.managerId,
            tiktokAccount: form.tiktokAccount,
            username: form.username,
            fullname: form.fullname,
            roleId: form.roleId,
            regionName: form.regionName,
            currency: form.currency,
            startDate: form.startDate,
          }

          const response = await superCreate(userData)
          if (response.data.success) {
            ElMessage.success(t('createUser.userSavedSuccessfully'))
            resetForm()
          } else {
            ElMessage.error(t('createUser.userSaveFailed'))
          }
        } catch (error) {
          ElMessage.error(t('createUser.userSaveFailed'))
        } finally {
          isSubmitting.value = false
        }
      })
    }

    const roleIdOptions = ref([
      { value: 1, label: '管理员'},
      { value: 2, label: '主管' },
      { value: 3, label: '销售' },
      { value: 7, label: '投手' },
      { value: 8, label: '财务' },
      { value: 9, label: '导师' },
    ])

    watch(() => form.platformPhone, (newVal, oldVal) => {
      form.platformId = ""
      isPlatformValidated.value = false
      platformPhoneError.value = false
    })

    watch(() => form.inviterName, (newVal, oldVal) => {
      form.inviterId = ""
      isInviterValidated.value = false
      inviterNameError.value = false
    })

    watch(() => form.managerName, (newVal, oldVal) => {
      form.managerId = ""
      isManagerValidated.value = false
      managerNameError.value = false
    })

    watch(() => form.tiktokAccount, (newVal, oldVal) => {
      isTiktokValidated.value = false
      tiktokAccountError.value = false
    })

    const resetForm = () => {
      if (userForm.value) {
        userForm.value.resetFields()
      }
      form.platformPhone = ""
      form.platformId = ""
      form.inviterName = ""
      form.inviterId = ""
      form.managerName = ""
      form.managerId = ""
      form.tiktokAccount = ""
      form.username = ""
      form.fullname = ""
      form.roleId = 3
      form.startDate = new Date().toISOString().split("T")[0]
      isPlatformValidated.value = false
      isInviterValidated.value = false
      platformPhoneError.value = false
      inviterNameError.value = false
    }

    return {
      form,
      rules,
      userForm,
      canCreate,
      isSubmitting,
      platformPhoneError,
      inviterNameError,
      managerNameError,
      tiktokAccountError,
      isPlatformValidated,
      isPlatformLoading,
      isInviterValidated,
      isInviterLoading,
      validatePlatformPhone,
      validateInviterName,
      validateManagerName,
      validateTiktokAccount,
      isManagerValidated,
      isManagerLoading,
      isTiktokValidated,
      isTiktokLoading,
      saveUser,
      resetForm,
      t,
      roleIdOptions
    }
  }
}
</script>

<style scoped>
.create-user-container {
  padding: 20px;
  background-color: #f5f5f5;
}

.create-user-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.button-group {
  display: flex;
  gap: 10px;
}

.error-text {
  color: red;
  font-size: 12px;
}
</style>
