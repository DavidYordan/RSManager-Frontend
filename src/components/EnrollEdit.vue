<!-- src/views/EnrollEdit.vue -->

<template>
  <el-dialog
    v-if="isDialogVisible"
    v-model="isDialogVisible"
    width="800px"
    @close="resetForm"
  >
    <el-row :gutter="20">
      <!-- 左侧表单 -->
      <el-col :span="24" class="form-column">
        <el-form
          :model="form"
          ref="enrollForm"
          :rules="rules"
          label-width="140px"
        >
          <!-- 第一行：邀请人姓名和验证按钮 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                :label="t('enrollScholar.inviterName')"
                prop="inviterName"
              >
                <el-input
                  v-model="form.inviterName"
                  :disabled="isSubmitting"
                  :placeholder="t('enrollScholar.enterInviterName')"
                ></el-input>
                <span
                  v-if="inviterNameError"
                  class="error-text"
                >{{ $t('enrollScholar.inviterNameNotFound') }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="validation-container">
              <el-form-item>
                <template #label>
                  <el-button
                    :type="isInviterValidated ? 'default' : 'primary'"
                    size="small"
                    @click="validateInviterName"
                    :disabled="isInviterValidated || isInviterLoading || isSubmitting"
                    :loading="isInviterLoading"
                  >
                    <span>
                      {{
                        isInviterValidated
                          ? t('enrollScholar.inviterIdLabel')
                          : t('enrollScholar.getInviterId')
                      }}
                    </span>
                  </el-button>
                  <el-icon
                    v-if="isInviterValidated"
                    class="validation-icon"
                    color="green"
                    size="20"
                  >
                    <Check />
                  </el-icon>
                </template>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第二行：管理人姓名和验证按钮 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                :label="t('enrollScholar.managerName')"
                prop="managerName"
              >
                <el-input
                  v-model="form.managerName"
                  :disabled="isSubmitting"
                  :placeholder="t('enrollScholar.engerManagerName')"
                ></el-input>
                <span
                  v-if="managerNameError"
                  class="error-text"
                >{{ $t('enrollScholar.managerNameNotFound') }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <template #label>
                  <el-button
                    :type="isManagerValidated ? 'default' : 'primary'"
                    size="small"
                    @click="validateManagerName"
                    :disabled="isManagerValidated || isManagerLoading || isSubmitting"
                    :loading="isManagerLoading"
                  >
                    <span>
                      {{
                        isManagerValidated
                          ? t('enrollScholar.managerIdLabel')
                          : t('enrollScholar.getManagerId')
                      }}
                    </span>
                  </el-button>
                  <el-icon
                    v-if="isManagerValidated"
                    class="validation-icon"
                    color="green"
                    size="20"
                  >
                    <Check />
                  </el-icon>
                </template>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第三行：学员姓名和学员等级 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                :label="t('enrollScholar.fullname')"
                prop="fullname"
              >
                <el-input
                  v-model="form.fullname"
                  :placeholder="t('enrollScholar.enterFullname')"
                  :disabled="isSubmitting"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="t('enrollScholar.roleId')"
                prop="roleId"
              >
                <el-select
                  v-model="form.roleId"
                  :disabled="isSubmitting"
                  :placeholder="t('enrollScholar.selectroleId')"
                >
                  <el-option
                    v-for="option in roleOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第四行：地区和货币 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                :label="t('enrollScholar.regionName')"
                prop="regionName"
              >
                <el-select
                  v-model="form.regionName"
                  :disabled="isSubmitting"
                  :placeholder="t('enrollScholar.selectRegion')"
                >
                  <el-option
                      v-for="option in regionOptions"
                      :key="option.regionCode"
                      :label="option.regionName"
                      :value="option.regionName"
                    />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="t('enrollScholar.currencyName')"
                prop="currencyName"
              >
                <el-select
                  v-model="form.currencyName"
                  placeholder="选择币种"
                  :disabled="isSubmitting"
                >
                  <el-option
                    v-for="option in currencyNameOptions"
                    :key="option"
                    :label="option"
                    :value="option"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第五行：项目名称和项目金额 -->
          <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              :label="t('enrollScholar.projectName')"
              prop="projectName"
            >
              <el-select
                v-model="form.projectName"
                :disabled="isSubmitting"
                placeholder="选择项目"
              >
                <el-option
                  v-for="option in projectOptions"
                  :key="option.projectId"
                  :label="option.projectName"
                  :value="option.projectName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="t('enrollScholar.projectAmount')"
              prop="projectAmount"
            >
              <el-input
                v-model="form.projectAmount"
                :placeholder="t('enrollScholar.projectAmountPlaceholder')"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

          <!-- 第六行：比率和权益生效日期 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                :label="t('enrollScholar.rateOptions')"
                prop="rateOption"
              >
                <el-select
                  v-model="form.rateOption"
                  :disabled="isSubmitting"
                  :placeholder="t('enrollScholar.selectRateOption')"
                >
                  <el-option
                    v-for="option in computedRateOptions"
                    :key="option.key"
                    :label="option.label"
                    :value="option.key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="生效日期"
                prop="startDate"
                required
              >
                <el-date-picker
                  v-model="form.startDate"
                  type="date"
                  placeholder="选择生效日期"
                  :disabled="isSubmitting"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第七行：付款方式 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                :label="t('enrollScholar.paymentMethod')"
                prop="paymentMethod"
                required
              >
                <el-select
                  v-model="form.paymentMethod"
                  :placeholder="t('enrollScholar.selectPaymentMethod')"
                  :disabled="isSubmitting"
                >
                  <el-option :label="t('enrollScholar.fullPayment')" :value="'全额支付'"></el-option>
                  <el-option :label="t('enrollScholar.installment')" :value="'分期付款'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第八行：备注 -->
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item
                :label="t('enrollScholar.comments')"
                prop="comments"
              >
                <el-input
                  type="textarea"
                  v-model="form.comments"
                  :placeholder="t('enrollScholar.enterComments')"
                  :rows="4"
                  :disabled="isSubmitting"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第九行：按钮组 -->
          <el-row :gutter="20">
            <el-form-item>
              <div class="button-group">
                <el-button
                  type="primary"
                  @click="saveApplication"
                  :disabled="!canSaveApplication || isSubmitting"
                >
                  {{ $t('enrollScholar.save') }}
                </el-button>
                <el-button
                  type="info"
                  @click="resetForm"
                  :disabled="isSubmitting"
                >
                  {{ $t('enrollScholar.reset') }}
                </el-button>
                <el-button
                  @click="handleClose"
                  :disabled="isSubmitting"
                >
                  {{ $t('enrollScholar.close') }}
                </el-button>
              </div>
            </el-form-item>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { ref, reactive, computed, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { checkInviter, userExists } from '@/api/user'
import { updateApplication } from '@/api/application' // 假设的保存 API
import { fetchAllRegions as apifetchAllRegions } from '@/api/utils'
import { ElMessage } from 'element-plus'

// 导入 Element Plus 的 Check 图标
import { Check } from '@element-plus/icons-vue'

export default {
  name: 'EnrollEdit',
  components: {
    Check
  },
  props: {
    applicationData: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit, expose }) {
    const { t } = useI18n()

    // 表单模型
    const form = reactive({
      processId: null,
      fullname: '',
      inviterName: '',
      managerId: '',
      managerName: '',
      managerFullname: '',
      roleId: null,
      regionName: '',
      currencyName: '',
      projectName: '',
      projectAmount: '',
      rateA: '',
      rateB: '',
      rateOption: '',
      startDate: '',
      paymentMethod: '',
      comments: ''
    })

    // 邀请人姓名验证相关
    const isInviterValidated = ref(true)
    const inviterNameError = ref(false)
    const isInviterLoading = ref(false)

    // 管理人姓名验证相关
    const isManagerValidated = ref(true)
    const managerNameError = ref(false)
    const isManagerLoading = ref(false)

    const isDialogVisible = ref(false)

    // 是否正在提交
    const isSubmitting = ref(false)

    // 申请单Id
    const processId = ref(null)

    // 是否可以保存申请单
    const canSaveApplication = ref(true)

    // 表单引用
    const enrollForm = ref(null)

    // 表单验证规则
    const rules = {
      inviterName: [
        { required: true, message: t('enrollScholar.PleaseEnterInviterName'), trigger: 'blur' }
      ],
      managerName: [
        { required: true, message: t('enrollScholar.PleaseEnterManagerName'), trigger: 'blur' }
      ],
      fullname: [
        { required: true, message: t('enrollScholar.PleaseEnterFullname'), trigger: 'blur' }
      ],
      roleId: [
        { required: true, message: t('enrollScholar.PleaseSelectroleId'), trigger: 'change' }
      ],
      projectName: [
        { required: true, message: t('enrollScholar.PleaseEnterProjectName'), trigger: 'blur' }
      ],
      projectAmount: [
        { required: true, message: t('enrollScholar.PleaseEnterProjectAmount'), trigger: 'blur' }
      ],
      startDate: [
        { required: true, message: "请选择生效日期", trigger: 'change' }
      ],
      paymentMethod: [
        { required: true, message: t('enrollScholar.PleaseSelectPaymentMethod'), trigger: 'change' }
      ],
      regionName: [
        { required: true, message: t('enrollScholar.PleaseSelectRegion'), trigger: 'change' }
      ],
      currencyName: [
        { required: true, message: "选择币种", trigger: 'change' }
      ]
    }

    /**
     * 验证邀请人姓名的函数
     */
    const validateInviterName = async () => {
      if (!form.inviterName) {
        ElMessage.error(t('enrollScholar.PleaseEnterInviterName'))
        return
      }

      isInviterLoading.value = true

      try {
        const response = await checkInviter(form.inviterName) // 使用新的API
        if (response.data.success) {
          isInviterValidated.value = true
          inviterNameError.value = false
          ElMessage.success(t('enrollScholar.InviterNameValidatedSuccessfully'))
        } else {
          isInviterValidated.value = false
          inviterNameError.value = true
          ElMessage.error(t('enrollScholar.InviterNameValidationFailed'))
        }
      } catch (error) {
        isInviterValidated.value = false
        inviterNameError.value = true
        ElMessage.error(t('enrollScholar.InviterNameValidationFailed'))
      } finally {
        isInviterLoading.value = false
      }
    }

    /**
     * 验证管理人姓名的函数
     */
    const validateManagerName = async () => {
      if (!form.managerName) {
        ElMessage.error(t('enrollScholar.PleaseEnterManagerName'))
        return
      }

      isManagerLoading.value = true

      try {
        const response = await userExists(form.managerName) // 使用新的API
        if (response.data.success) {
          isManagerValidated.value = true
          managerNameError.value = false
          ElMessage.success(t('enrollScholar.ManagerNameValidatedSuccessfully'))
        } else {
          isManagerValidated.value = false
          managerNameError.value = true
          ElMessage.error(t('enrollScholar.ManagerNameValidationFailed'))
        }
      } catch (error) {
        isManagerValidated.value = false
        managerNameError.value = true
        ElMessage.error(t('enrollScholar.ManagerNameValidationFailed'))
      } finally {
        isManagerLoading.value = false
      }
    }

    /**
     * 保存申请单的函数
     */
    const saveApplication = async () => {
      // 校验表单
      try {
        await enrollForm.value.validate()
      } catch (error) {
        ElMessage.error(t('enrollScholar.formValidationFailed'))
        return
      }

      isSubmitting.value = true

      // 准备保存的数据

      const saveData = {
        processId: processId.value,
        inviterName: form.inviterName,
        managerName: form.managerName,
        fullname: form.fullname,
        roleId: form.roleId,
        regionName: form.regionName,
        currencyName: form.currencyName,
        projectName: form.projectName,
        projectAmount: form.projectAmount,
        rateA: form.rateA,
        rateB: form.rateB,
        paymentMethod: form.paymentMethod,
        startDate: form.startDate,
        comments: form.comments
      }

      try {
        const response = await updateApplication(saveData)
        if (response.data.success) { // 根据 ApiResponse 结构调整
          ElMessage.success(t('enrollScholar.ApplicationSavedSuccessfully'))
          canSaveApplication.value = false
          emit('enrollEditSubmitted') // 发送回调给父组件
          handleClose() // 关闭对话框
        } else {
          ElMessage.error(t('enrollScholar.ApplicationSaveFailed'))
        }
      } catch (error) {
        ElMessage.error(t('enrollScholar.ApplicationSaveFailed'))
      } finally {
        isSubmitting.value = false
      }
    }

    /**
     * 重置表单的函数
     */
    const resetForm = () => {
      canSaveApplication.value = true
      inviterNameError.value = false
      managerNameError.value = false
      isInviterValidated.value = true
      isManagerValidated.value = true
      if (enrollForm.value) {
        enrollForm.value.resetFields()
      }
      initializeForm()
    }

    /**
     * 关闭对话框的函数
     */
    const handleClose = () => {
      isDialogVisible.value = false
      resetForm()
    }

    // 抽佣等级选项
    const rateOptions = {
      4: {
        1: { rateA: "*0.95*0.5", rateB: "" },
        2: { rateA: "*0.95*0.4", rateB: "*0.95*0.1" }
      },
      5: {
        1: { rateA: "*0.95*0.3", rateB: "" },
        2: { rateA: "*0.95*0.4", rateB: "" },
        3: { rateA: "*0.95*0.5", rateB: "" }
      },
    }

    /**
     * 学员等级选项
     */
     const roleOptions = ref([
      { value: 4, label: "高阶学员" },
      { value: 5, label: "中阶学员" },
      { value: 6, label: "初阶学员" }
    ])

    /**
     * 计算 rateOptions 选择项
     */
     const computedRateOptions = computed(() => {
      if (form.roleId === 6) return []

      if (!form.roleId || !rateOptions[form.roleId]) return []
      const options = rateOptions[form.roleId]
      return Object.keys(options).map(key => ({
        key: key,
        label: `${options[key].rateA}${options[key].rateB ? ' + ' + options[key].rateB : ''}`
      }))
    })

    /**
     * 监听 roleId 变化，设置 rateA 和 rateB
     */
    watch(() => form.roleId, (newLevel) => {
      if (newLevel === 6) {
        form.rateA = ''
        form.rateB = ''
        form.rateOption = ''
      } else if (rateOptions[newLevel]) {
        const firstOptionKey = Object.keys(rateOptions[newLevel])[0]
        form.rateOption = firstOptionKey
        form.rateA = rateOptions[newLevel][firstOptionKey].rateA
        form.rateB = rateOptions[newLevel][firstOptionKey].rateB
      } else {
        form.rateA = ''
        form.rateB = ''
      }
    })

    /**
     * 监听 rateOption 变化，设置 rateA 和 rateB
     */
    watch(() => form.rateOption, (newOption) => {
      if (form.roleId === 6) {
        form.rateA = ''
        form.rateB = ''
        form.rateOption = ''
      } else if (rateOptions[form.roleId] && rateOptions[form.roleId][newOption]) {
        form.rateA = rateOptions[form.roleId][newOption].rateA
        form.rateB = rateOptions[form.roleId][newOption].rateB
      } else {
        form.rateA = ''
        form.rateB = ''
      }
    })

    // 监听邀请人姓名的变化
    watch(() => form.inviterName, (newVal, oldVal) => {
      if (isInitializing.value) return;
      if (form.inviterName === props.applicationData.inviterName) {
        isInviterValidated.value = true
        inviterNameError.value = false
      } else {
        isInviterValidated.value = false
        inviterNameError.value = false
      }
    })

    // 监听管理人姓名的变化
    watch(() => form.managerName, (newVal, oldVal) => {
      if (isInitializing.value) return;
      if (form.managerName === props.applicationData.managerName) {
        isManagerValidated.value = true
        managerNameError.value = false
      } else {
        isManagerValidated.value = false
        managerNameError.value = false
      }
    })


    // 初始化表单数据
    const isInitializing = ref(false);

    // 地区数据
    const regionOptions = ref([])

    // 货币选项
    const currencyNameOptions = ref([])

    // 项目名称和金额映射，根据 roleId
    const projectMap = ref({})

    const projectOptions = computed(() => {
      const uniqueId1 = form.regionName + form.currencyName + form.roleId
      const uniqueId2 = form.currencyName + form.roleId

      let projects = []

      if (projectMap.value[uniqueId1]) {
        projects = Object.values(projectMap.value[uniqueId1])
      } else if (projectMap.value[uniqueId2]) {
        projects = Object.values(projectMap.value[uniqueId2])
      }

      return projects.map(project => ({
        projectId: project.projectId,
        projectName: project.projectName,
        projectAmount: project.projectAmount
      }))
    })

    // 监听学员等级变化，更新项目名称和金额
    watch(() => form.roleId, (newVal) => {
      let region = regionOptions.value.find(region => region.roleId === form.roleId && region.regionName === form.regionName && region.currencyName === form.currencyName)
      if (region) {
        form.projectName = region.projectName
      } else {
        region = regionOptions.value.find(region => region.roleId === form.roleId && region.currencyName === form.currencyName)
        if (region) {
          form.projectName = region.projectName
        } else {
          form.projectName = ''
        }
      }
      updateProjectInfo()
    })

    // 监听地区变化，自动填充货币
    watch(() => form.regionName, (newRegionName) => {
      const region = regionOptions.value.find(region => region.regionName === newRegionName)
      if (region) {
        form.currencyName = region.currencyName
      }
      updateProjectInfo()
    })

    // 监听货币变化，自动更新项目金额
    watch(() => form.currencyName, (newCurrencyName) => {
      updateProjectInfo()
    })

    // 监听项目变化，自动更新项目金额
    watch(() => form.projectName, (newProjectName) => {
      const project = projectOptions.value.find(project => project.projectName === newProjectName)
      if (project) {
        form.projectAmount = project.projectAmount
      } else {
        form.projectAmount = ''
      }
    })

    const updateProjectInfo = () => {
      const uniqueId1 = form.regionName + form.currencyName + form.roleId
      const uniqueId2 = form.currencyName + form.roleId
      if (projectMap.value[uniqueId1]) {
        // 取出第一个
        form.projectName = projectMap.value[uniqueId1][Object.keys(projectMap.value[uniqueId1])[0]].projectName
      } else if (projectMap.value[uniqueId2]) {
        form.projectName = projectMap.value[uniqueId2][Object.keys(projectMap.value[uniqueId2])[0]].projectName
      } else {
        form.projectAmount = ''
      }
    }

    /**
     * 获取所有类型数据（地区和项目名称）
     */
     const loadAllTypes = async () => {
      try {
        const response = await apifetchAllRegions()
        if (response.data.success) {
          const data = response.data.data

          // 处理地区数据
          regionOptions.value = data.map(region => ({
            regionName: region.regionName,
            regionCode: region.regionCode,
            roleId: region.roleId,
            currencyName: region.currencyName,
            currencyCode: region.currencyCode,
            projectId: region.projectId,
            projectName: region.projectName,
            projectAmount: region.projectAmount
          }))

          // 提取所有货币选项
          currencyNameOptions.value = [...new Set(data.map(region => region.currencyName))]

          // 处理项目名称和金额映射
          data.forEach(region => {
              const uniqueId1 = region.regionName + region.currencyName + region.roleId
              const uniqueId2 = region.currencyName + region.roleId
              if (!projectMap.value[uniqueId1]) {
                projectMap.value[uniqueId1] = {}
              }
              // 将项目添加到 uniqueId1 下
              projectMap.value[uniqueId1][region.projectId] = {
                projectId: region.projectId,
                projectName: region.projectName,
                projectAmount: region.projectAmount
              }

              // 初始化 uniqueId2 下的项目列表
              if (!projectMap.value[uniqueId2]) {
                projectMap.value[uniqueId2] = {}
              }
              // 将项目添加到 uniqueId2 下
              projectMap.value[uniqueId2][region.projectId] = {
                projectId: region.projectId,
                projectName: region.projectName,
                projectAmount: region.projectAmount
              }
          })
        } else {
          ElMessage.error("获取类型数据失败")
        }
      } catch (error) {
        ElMessage.error("获取类型数据失败:" + error)
      }
    }

    /**
     * 初始化表单数据
     */
    const initializeForm = () => {
      isInitializing.value = true;
      if (props.applicationData) {
        processId.value = props.applicationData.processId
        form.roleId = props.applicationData.roleId
        form.fullname = props.applicationData.fullname
        form.inviterName = props.applicationData.inviterName
        form.managerName = props.applicationData.managerName
        form.regionName = props.applicationData.regionName
        form.currencyName = props.applicationData.currencyName
        form.projectName = props.applicationData.projectName
        form.projectAmount = props.applicationData.projectAmount
        form.rateA = props.applicationData.rateA
        form.rateB = props.applicationData.rateB
        form.startDate = props.applicationData.startDate
        form.paymentMethod = props.applicationData.paymentMethod
        form.comments = props.applicationData.comments
        // 根据 rateA 和 rateB 计算 rateOption
        if (form.roleId && rateOptions[form.roleId]) {
          const rateOptionKey = findRateOptionKey(form.roleId, form.rateA, form.rateB);
          if (rateOptionKey) {
            form.rateOption = rateOptionKey;
          } else {
            form.rateOption = Object.keys(rateOptions[form.roleId])[0];
          }
        }
      }

      updateProjectInfo();

      nextTick(() => {
        isInitializing.value = false;
      });
    }

    const findRateOptionKey = (roleId, rateA, rateB) => {
      if (roleId === 6) return null;
      const options = rateOptions[roleId];
      for (const key in options) {
        if (
          options[key].rateA === rateA &&
          options[key].rateB === rateB
        ) {
          return key;
        }
      }
      return null;
    };

    // 监听 applicationData prop 的变化
    watch(() => props.applicationData, () => {
      initializeForm()
    }, { immediate: true })

    const openDialog = async() => {
      isDialogVisible.value = true;
      await loadAllTypes();
      initializeForm();
    };

    expose({ openDialog })

    return {
      t,
      form,
      rules,
      validateInviterName,
      validateManagerName,
      saveApplication,
      resetForm,
      handleClose,
      isDialogVisible,
      isInviterValidated,
      isManagerValidated,
      canSaveApplication,
      currencyNameOptions,
      inviterNameError,
      managerNameError,
      isSubmitting,
      enrollForm,
      roleOptions,
      computedRateOptions,
      projectOptions,
      regionOptions,
      isInviterLoading,
      isManagerLoading,
    }
  }
}
</script>

<style scoped>
/* 左侧表单样式 */
.form-column {
  padding-right: 20px;
  /* border-right: 1px solid #e0e0e0; */ /* 移除右边框 */
}

/* 错误文本样式 */
.error-text {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

/* 按钮组样式 */
.button-group {
  display: flex;
  justify-content: flex-start;
  gap: 20px; /* 调整间距 */
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .enroll-scholar-container {
    padding: 20px 10px;
  }

  .form-column {
    padding: 0;
    /* border: none; */ /* 无需移除边框 */
  }

  .button-group {
    flex-direction: column;
    align-items: stretch;
  }

  .button-group .el-button {
    width: 100%;
  }

  .el-row {
    flex-direction: column;
  }
}

/* 验证通过图标样式 */
.validation-container {
  display: flex;
  align-items: center;
}

.validation-icon {
  margin-left: 10px;
}
</style>
