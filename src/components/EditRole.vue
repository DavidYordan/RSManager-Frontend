<!-- src/views/EditRole.vue -->

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

          <!-- 第三行：学员姓名和学员等级 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="学员姓名"
                prop="fullname"
              >
                <el-input
                  v-model="form.fullname"
                  placeholder="请输入学员姓名"
                  disabled
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
                    v-for="option in roleIdOptions"
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
                label="区域"
                prop="regionName"
              >
                <el-select
                  v-model="form.regionName"
                  disabled
                  placeholder="请选择区域"
                >
                  <el-option
                    v-for="option in regions"
                    :key="option.regionName"
                    :label="option.regionName"
                    :value="option.regionName"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="t('enrollScholar.currency')"
                prop="currency"
              >
                <el-select
                  v-model="form.currency"
                  :placeholder="t('enrollScholar.selectCurrency')"
                  :disabled="isSubmitting"
                >
                  <el-option
                    v-for="option in currencyOptions"
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
              <el-input
                v-model="form.projectName"
                :placeholder="t('enrollScholar.projectNamePlaceholder')"
                disabled
              ></el-input>
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
                label="付款日期"
                prop="startDate"
                required
              >
                <el-date-picker
                  v-model="form.startDate"
                  type="date"
                  placeholder="选择付款日期"
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
import { saveRoleEditing } from '@/api/application' // 假设的保存 API
import { fetchAllRegions as apifetchAllRegions } from '@/api/utils'
import { ElMessage } from 'element-plus'

// 导入 Element Plus 的 Check 图标
import { Check } from '@element-plus/icons-vue'

export default {
  name: 'EditRole',
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
      roleId: null,
      regionName: '',
      currency: '',
      projectName: '',
      projectAmount: '',
      rateA: '',
      rateB: '',
      startDate: '',
      paymentMethod: '',
      comments: ''
    })

    const isDialogVisible = ref(false)

    // 是否正在提交
    const isSubmitting = ref(false)

    // 申请单Id
    const processId = ref(null)

    // 是否可以保存申请单
    const canSaveApplication = ref(true)

    // 表单引用
    const enrollForm = ref(null)

    // 原始状态
    const oldStatus = ref(null)

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

    // 表单验证规则
    const rules = {
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
      currency: [
        { required: true, message: t('enrollScholar.PleaseSelectCurrency'), trigger: 'change' }
      ]
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
        fullname: form.fullname,
        roleId: form.roleId,
        regionName: form.regionName,
        currency: form.currency,
        projectName: form.projectName,
        projectAmount: form.projectAmount,
        rateA: form.rateA,
        rateB: form.rateB,
        paymentMethod: form.paymentMethod,
        startDate: form.startDate,
        comments: form.comments,
        oldStatus: oldStatus.value
      }

      try {
        const response = await saveRoleEditing(saveData)
        if (response.data.success) { // 根据 ApiResponse 结构调整
          ElMessage.success("保存成功")
          canSaveApplication.value = false
          emit('roleEdited') // 发送回调给父组件
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

    /**
     * 学员等级选项
     */
    const roleIdOptions = ref([
      { value: 4, label: t('enrollScholar.advanced') },
      { value: 5, label: t('enrollScholar.intermediate') },
      { value: 6, label: t('enrollScholar.beginner') },
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
     * 监听 roleId 和 rateOption 变化，设置 rateA 和 rateB
     */
     watch(
      [() => form.roleId, () => form.rateOption],
      ([newLevel, newOption], [oldLevel, oldOption]) => {
        if (isInitializing.value) return;
        if (newLevel === 6) {
          form.rateA = '';
          form.rateB = '';
          form.rateOption = '';
        } else if (newLevel !== oldLevel && rateOptions[newLevel]) {
          // 如果已有 rateOption，且在新的 roleId 下有效，则保持不变
          if (form.rateOption && rateOptions[newLevel][form.rateOption]) {
            form.rateA = rateOptions[newLevel][form.rateOption].rateA;
            form.rateB = rateOptions[newLevel][form.rateOption].rateB;
          } else {
            // 否则，设置为第一个选项
            const firstOptionKey = Object.keys(rateOptions[newLevel])[0];
            form.rateOption = firstOptionKey;
            form.rateA = rateOptions[newLevel][firstOptionKey].rateA;
            form.rateB = rateOptions[newLevel][firstOptionKey].rateB;
          }
        } else if (
          newOption &&
          rateOptions[newLevel] &&
          rateOptions[newLevel][newOption]
        ) {
          // 保持当前 rateOption 的选择
          form.rateA = rateOptions[newLevel][newOption].rateA;
          form.rateB = rateOptions[newLevel][newOption].rateB;
        } else {
          form.rateA = '';
          form.rateB = '';
        }
      }
    );

    /**
     * 项目名称映射
     */
    const projectNameMap = ref({})

    // 地区数据
    const regions = ref([])

    // 货币选项
    const currencyOptions = ref([])

    // 项目名称和金额映射，根据 roleId
    const projectMap = ref({})

    // 初始化表单数据
    const initialForm = ref({})
    const isInitializing = ref(false);

    // 监听学员等级变化，更新项目名称和金额
    watch(() => form.roleId, (newVal) => {
      if (isInitializing.value) return;
      const project = projectMap.value[newVal-3]
      form.projectAmount = project ? project[form.currency] : ''
      form.projectName = project ? projectNameMap.value[newVal-3] : ''
    })

    // 监听地区变化，自动填充货币
    watch(() => form.regionName, (newRegionName) => {
      if (isInitializing.value) return;
      const selectedRegion = regions.value.find(region => region.regionName === newRegionName)
      if (selectedRegion) {
        form.currency = selectedRegion.currency
      }
    })

    // 监听货币变化，自动更新项目金额
    watch(() => form.currency, (newCurrency) => {
      if (isInitializing.value) return;
      const project = projectMap.value[form.roleId-3]
      form.projectAmount = project ? project[newCurrency] : ''
    })

    /**
     * 获取所有类型数据（地区和项目名称）
     */
    const loadAllTypes = async () => {
      try {
        const response = await apifetchAllRegions()
        if (response.data.success) {
          const data = response.data.data

          // 处理地区数据
          regions.value = data.map(region => ({
            regionName: region.regionName,
            currency: region.currency
          }))

          // 提取所有货币选项
          currencyOptions.value = [
            ...new Set(data.map(region => region.currency))
          ]

          // 处理项目名称和金额映射
          data.forEach(region => {
            region.regionProjectDTOs.forEach(project => {
              if (!projectMap.value[project.projectId]) {
                projectMap.value[project.projectId] = {}
              }
              projectMap.value[project.projectId][region.currency] = project.projectAmount
            })
          })

          // 提取唯一项目
          const projectSet = new Set()
          data.forEach(region => {
            region.regionProjectDTOs.forEach(project => {
              projectSet.add(JSON.stringify({ projectId: project.projectId, projectName: project.projectName }))
            })
          })

          // projectNameMap
          projectSet.forEach(project => {
            const projectObj = JSON.parse(project)
            projectNameMap.value[projectObj.projectId] = projectObj.projectName})

          // 初始化项目名称和金额
          form.regionName = regions.value[0].regionName
          form.roleId = 6
        } else {
          ElMessage.error(t('enrollScholar.FetchTypesFailed'))
        }
      } catch (error) {
        ElMessage.error(t('enrollScholar.FetchTypesFailed'))
      }
    }

    /**
     * 初始化表单数据
     */
    const initializeForm = () => {
      isInitializing.value = true;
      if (props.applicationData && Object.keys(props.applicationData).length > 0) {
        Object.assign(form, { ...props.applicationData })
        form.startDate = new Date().toISOString().substring(0, 10)
        initialForm.value = { ...props.applicationData }
        processId.value = props.applicationData.processId
        console.log('action:', JSON.parse(props.applicationData.actionStr))
        try {
          oldStatus.value = JSON.parse(props.applicationData.actionStr).oldStatus
        } catch (error) {
          oldStatus.value = null
        }

        // 根据 rateA 和 rateB 计算 rateOption
        if (form.roleId && rateOptions[form.roleId]) {
          const rateOptionKey = findRateOptionKey(form.roleId, form.rateA, form.rateB);
          if (rateOptionKey) {
            form.rateOption = rateOptionKey;
          } else {
            form.rateOption = '';
          }
        }
      }
      nextTick(() => {
        isInitializing.value = false;
      });
    }

    const findRateOptionKey = (roleId, rateA, rateB) => {
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
      saveApplication,
      resetForm,
      handleClose,
      isDialogVisible,
      canSaveApplication,
      currencyOptions,
      isSubmitting,
      enrollForm,
      roleIdOptions,
      computedRateOptions,
      regions
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
