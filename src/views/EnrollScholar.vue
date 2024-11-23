<!-- src/views/EnrollScholar.vue -->

<template>
  <div class="enroll-scholar-container">
    <div
      class="enroll-scholar"
      v-loading="isSubmitting"
      :element-loading-text="t('enrollScholar.submitting')"
      :element-loading-background="'rgba(0, 0, 0, 0.7)'"
    >
      <el-row :gutter="20">
        <!-- 左侧表单 -->
        <el-col :span="16" class="form-column">
          <el-form
            :model="form"
            ref="enrollForm"
            :rules="rules"
            label-width="140px"
          >
            <!-- 第一行：邀请人姓名 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  :label="$t('enrollScholar.inviterName')"
                  prop="inviterName"
                >
                  <el-input
                    v-model="form.inviterName"
                    :disabled="isSubmitting"
                    :placeholder="$t('enrollScholar.enterInviterName')"
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

            <!-- 第二行：管理人账号 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  :label="$t('enrollScholar.managerName')"
                  prop="managerName"
                >
                  <el-input
                    v-model="form.managerName"
                    :disabled="isSubmitting"
                    :placeholder="$t('enrollScholar.enterManagerName')"
                  ></el-input>
                  <span
                    v-if="managerNameError"
                    class="error-text"
                  >{{ $t('enrollScholar.managerNameNotFound') }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="validation-container">
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

            <!-- 第三行：学员姓名 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  :label="$t('enrollScholar.fullname')"
                  prop="fullname"
                >
                  <el-input
                    v-model="form.fullname"
                    :placeholder="$t('enrollScholar.enterFullname')"
                    :disabled="isSubmitting"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="validation-container">
                <el-form-item>
                  <template #label>
                    <el-button
                      :type="isFullnameValidated ? 'default' : 'primary'"
                      size="small"
                      @click="validateFullname"
                      :disabled="isFullnameValidated || isFullnameLoading || isSubmitting"
                      :loading="isFullnameLoading"
                    >
                      <span>
                        {{
                          isFullnameValidated
                            ? t('enrollScholar.fullnameValidated')
                            : t('enrollScholar.validateFullname')
                        }}
                      </span>
                    </el-button>
                    <el-icon
                      v-if="isFullnameValidated"
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

            <!-- 第四行：地区和货币 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  :label="$t('enrollScholar.regionName')"
                  prop="regionName"
                >
                  <el-select
                    v-model="form.regionName"
                    :disabled="isSubmitting"
                    :placeholder="$t('enrollScholar.selectRegion')"
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
                  :label="$t('enrollScholar.currency')"
                  prop="currency"
                >
                  <el-select
                    v-model="form.currency"
                    :placeholder="$t('enrollScholar.selectCurrency')"
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
                  :label="$t('enrollScholar.projectName')"
                  prop="projectName"
                >
                  <el-input
                    v-model="form.projectName"
                    :placeholder="$t('enrollScholar.projectNamePlaceholder')"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('enrollScholar.projectAmount')"
                  prop="projectAmount"
                >
                  <el-input
                    v-model="form.projectAmount"
                    :placeholder="$t('enrollScholar.projectAmountPlaceholder')"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第六行：付款方式和学员等级 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  :label="$t('enrollScholar.paymentMethod')"
                  prop="paymentMethod"
                  required
                >
                  <el-select
                    v-model="form.paymentMethod"
                    :placeholder="$t('enrollScholar.selectPaymentMethod')"
                    :disabled="isSubmitting"
                  >
                    <el-option :label="$t('enrollScholar.fullPayment')" :value="'全额支付'"></el-option>
                    <el-option :label="$t('enrollScholar.installment')" :value="'分期付款'"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('enrollScholar.scholarLevel')"
                  prop="scholarLevel"
                >
                  <el-select
                    v-model="form.scholarLevel"
                    :disabled="isSubmitting"
                    :placeholder="$t('enrollScholar.selectScholarLevel')"
                  >
                    <el-option
                      v-for="option in scholarLevelOptions"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第七行：付款方式和付款金额 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  :label="$t('enrollScholar.paymentAmount')"
                  prop="paymentAmount"
                  required
                >
                  <el-input
                    type="number"
                    v-model="form.paymentAmount"
                    :placeholder="$t('enrollScholar.enterPaymentAmount')"
                    :disabled="isSubmitting"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('enrollScholar.fee')"
                  prop="fee"
                  required
                >
                  <el-input
                    type="number"
                    v-model="form.fee"
                    :placeholder="$t('enrollScholar.enterFee')"
                    :disabled="isSubmitting"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第八行：比率和付款时间 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  :label="$t('enrollScholar.rateOptions')"
                  prop="rateOption"
                >
                  <el-select
                    v-model="form.rateOption"
                    :disabled="isSubmitting"
                    :placeholder="$t('enrollScholar.selectRateOption')"
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
                  :label="$t('enrollScholar.paymentTime')"
                  prop="paymentTime"
                  required
                >
                  <el-date-picker
                    v-model="form.paymentTime"
                    type="date"
                    :placeholder="t('enrollScholar.selectPaymentTime')"
                    :disabled="isSubmitting"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    style="width: 100%;"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第九行：备注 -->
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item
                  :label="$t('enrollScholar.comments')"
                  prop="comments"
                >
                  <el-input
                    type="textarea"
                    v-model="form.comments"
                    :placeholder="$t('enrollScholar.enterComments')"
                    :rows="4"
                    :disabled="isSubmitting"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第十行：按钮组 -->
            <el-row :gutter="20">
              <el-form-item>
                <div class="button-group">
                  <el-button
                    type="primary"
                    @click="saveApplication"
                    :disabled="!canSaveApplication || isSubmitting"
                  >
                    {{ $t('enrollScholar.saveApplication') }}
                  </el-button>
                  <el-button
                    type="success"
                    @click="submitAudit"
                    :disabled="!canSubmitAudit || isSubmitting"
                  >
                    {{ $t('enrollScholar.submitAudit') }}
                  </el-button>
                  <el-button
                    @click="resetForm"
                    :disabled="isSubmitting"
                  >
                    {{ $t('enrollScholar.reset') }}
                  </el-button>
                </div>
              </el-form-item>
            </el-row>
          </el-form>
        </el-col>

        <!-- 右侧文件上传 -->
        <el-col :span="8" class="upload-column">
          <el-form>
            <el-form-item
              :label="$t('enrollScholar.files')"
              prop="files"
            >
              <el-upload
                class="upload-demo"
                drag
                :file-list="fileList"
                :auto-upload="false"
                :before-upload="beforeUpload"
                multiple
                :on-change="handleFileChange"
                :on-remove="handleFileRemove"
                :limit="10"
                :on-exceed="handleExceed"
                accept="image/*"
                list-type="picture-card"
                :disabled="isSubmitting"
                :on-preview="handlePreview"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">{{ $t('enrollScholar.dragFiles') }}</div>
              </el-upload>
              <span v-if="fileError" class="error-text">{{ fileErrorMessage }}</span>
              <!-- 图片预览弹窗 -->
              <el-dialog v-model="previewVisible" width="50%">
                <img
                  style="width: 100%"
                  :src="previewImage"
                  alt="Preview"
                />
              </el-dialog>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch, effect } from 'vue'
import { useStore } from '../store/index.js';
import { useI18n } from 'vue-i18n'
import { checkInviter, userExists } from '@/api/user'
import {
  createApplication as apiCreateApplication,
  submitApplication as apiSubmitApplication,
  checkFullname as apiCheckFullname,
} from '@/api/application'
import { fetchAllRegions as apifetchAllRegions } from '@/api/utils'
import { ElMessage, ElLoading } from 'element-plus'

// 导入 Element Plus 的 Check 图标
import { Check } from '@element-plus/icons-vue'

export default {
  name: 'EnrollScholar',
  components: {
    Check
  },
  setup() {
    const { t } = useI18n()
    const store = useStore()

    // 表单模型（移除projectAmount和多个TikTok账号）
    const form = reactive({
      fullname: '',
      scholarLevel: null,
      projectName: '',
      projectAmount: '',
      rateA: '',
      rateB: '',
      paymentMethod: '全额支付',
      paymentAmount: '',
      fee: '',
      paymentTime: null,
      inviterName: '',
      managerName: store.username,
      regionName: '',
      currency: '',
      comments: '',
      files: []
    })

    // 文件列表
    const fileList = ref([])

    // 文件错误信息
    const fileError = ref(false)
    const fileErrorMessage = ref('')

    // 学员姓名验证相关
    const isFullnameValidated = ref(false)
    const fullnameError = ref(false)
    const isFullnameLoading = ref(false)

    // 邀请人姓名验证相关
    const isInviterValidated = ref(false)
    const inviterNameError = ref(false)
    const isInviterLoading = ref(false)

    // 管理人姓名验证相关
    const isManagerValidated = ref(true)
    const managerNameError = ref(false)
    const isManagerLoading = ref(false)

    // 是否正在提交
    const isSubmitting = ref(false)

    // 创建的申请单 ID
    const applicationId = ref(null)

    // 申请单的流程状态
    const processStatus = ref(null)

    // 是否可以保存申请单
    const canSaveApplication = ref(true)

    // 是否可以提交审核
    const canSubmitAudit = computed(() => processStatus.value === 3)

    // 表单引用
    const enrollForm = ref(null)

    // 图片预览相关
    const previewVisible = ref(false)
    const previewImage = ref('')

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

    // 表单验证规则（移除projectAmount和TikTok账号的多个验证）
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
      scholarLevel: [
        { required: true, message: t('enrollScholar.PleaseSelectScholarLevel'), trigger: 'change' }
      ],
      projectName: [
        { required: true, message: t('enrollScholar.PleaseEnterProjectName'), trigger: 'blur' }
      ],
      projectAmount: [
        { required: true, message: t('enrollScholar.PleaseEnterProjectAmount'), trigger: 'blur' }
      ],
      paymentMethod: [
        { required: true, message: t('enrollScholar.PleaseSelectPaymentMethod'), trigger: 'change' }
      ],
      paymentAmount: [
        { required: true, message: t('enrollScholar.PleaseEnterPaymentAmount'), trigger: 'blur' }
      ],
      fee: [
        { required: true, message: t('enrollScholar.PleaseEnterFee'), trigger: 'blur' }
      ],
      paymentTime: [
        { required: true, message: t('enrollScholar.PleaseSelectPaymentTime'), trigger: 'change' }
      ],
      files: [
        { required: true, message: t('enrollScholar.PleaseUploadAtLeastOneFile'), trigger: 'change' },
        { validator: validateTotalFileSize, trigger: 'change' }
      ],
      regionName: [
        { required: true, message: t('enrollScholar.PleaseSelectRegion'), trigger: 'change' }
      ],
      currency: [
        { required: true, message: t('enrollScholar.PleaseEnterCurrency'), trigger: 'blur' }
      ]
    }

    /**
     * 自定义验证器，用于验证总文件大小不超过100MB
     * @param {Object} rule 
     * @param {Array} value 
     * @param {Function} callback 
     */
    function validateTotalFileSize(rule, value, callback) {
      let totalSize = 0
      if (value && value.length > 0) {
        value.forEach(file => {
          totalSize += file.size
        })
        if (totalSize > 100 * 1024 * 1024) {
          return callback(new Error(t('enrollScholar.TotalFileSizeExceeds')))
        }
      }
      callback()
    }

    /**
     * 处理文件变化事件
     * @param {Object} file 
     * @param {Array} newFileList 
     */
     const handleFileChange = (file, newFileList) => {
      form.files = newFileList.map(file => file.raw)
      fileList.value = newFileList

      // 验证文件总大小和数量
      let totalSize = 0
      if (newFileList.length < 1) {
        fileError.value = true
        fileErrorMessage.value = t('enrollScholar.PleaseUploadAtLeastOneFile')
        return
      }
      newFileList.forEach(file => {
        totalSize += file.size
      })
      if (totalSize > 100 * 1024 * 1024) {
        fileError.value = true
        fileErrorMessage.value = t('enrollScholar.TotalFileSizeExceeds')
      } else {
        fileError.value = false
        fileErrorMessage.value = ''
      }
    }

    /**
     * 处理文件移除事件
     * @param {Object} file 
     * @param {Array} currentFileList 
     */
     const handleFileRemove = (file, currentFileList) => {
      form.files = currentFileList.map(file => file.raw)
      fileList.value = currentFileList

      // 验证文件总大小和数量
      let totalSize = 0
      if (currentFileList.length < 1) {
        fileError.value = true
        fileErrorMessage.value = t('enrollScholar.PleaseUploadAtLeastOneFile')
        return
      }
      currentFileList.forEach(file => {
        totalSize += file.size
      })
      if (totalSize > 100 * 1024 * 1024) {
        fileError.value = true
        fileErrorMessage.value = t('enrollScholar.TotalFileSizeExceeds')
      } else {
        fileError.value = false
        fileErrorMessage.value = ''
      }
    }

    /**
     * 处理文件超出限制事件
     * @param {Array} files 
     * @param {Array} fileList 
     */
    const handleExceed = (files, fileList) => {
      ElMessage.error(t('enrollScholar.FileLimitExceeded'))
    }

    /**
     * 上传前的钩子，用于验证文件大小
     * @param {Object} file 
     * @returns {Boolean}
     */
    const beforeUpload = (file) => {
      // 不允许超过10MB的单个文件
      if (file.size > 10 * 1024 * 1024) {
        ElMessage.error(t('enrollScholar.FileSizeExceeds'))
        return false
      }
      return true
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
     * 验证学员姓名的函数
     */
    const validateFullname = async () => {
      if (!form.fullname) {
        ElMessage.error(t('enrollScholar.PleaseEnterFullname'))
        return
      }

      isFullnameLoading.value = true

      try {
        const response = await apiCheckFullname(form.fullname)
        if (response.data.success) {
          isFullnameValidated.value = true
          fullnameError.value = false
          ElMessage.success(t('enrollScholar.FullnameValidatedSuccessfully'))
        } else {
          isFullnameValidated.value = false
          fullnameError.value = true
          ElMessage.error(response.data.message || t('enrollScholar.FullnameValidationFailed'))
        }
      } catch (error) {
        isFullnameValidated.value = false
        fullnameError.value = true
        ElMessage.error(t('enrollScholar.FullnameValidationFailed'))
      } finally {
        isFullnameLoading.value = false
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

      // 校验文件总大小
      let totalSize = 0
      form.files.forEach(file => {
        totalSize += file.size
      })
      if (totalSize > 100 * 1024 * 1024) { // 100MB
        ElMessage.error(t('enrollScholar.TotalFileSizeExceeds'))
        return
      }
      if (form.files.length < 1) {
        ElMessage.error(t('enrollScholar.PleaseUploadAtLeastOneFile'))
        return
      }

      // 格式化 paymentTime 为 YYYY-MM-DD
      const formattedPaymentTime = form.paymentTime ? form.paymentTime : ''

      const formData = new FormData();

      formData.append('fullname', form.fullname);
      formData.append('roleId', form.scholarLevel);
      formData.append('projectName', form.projectName);
      formData.append('projectAmount', parseFloat(form.projectAmount));
      formData.append('inviterName', form.inviterName);
      formData.append('managerName', form.managerName);
      formData.append('rateA', form.rateA);
      formData.append('rateB', form.rateB);
      formData.append('paymentMethod', form.paymentMethod);
      formData.append('paymentAmount', parseFloat(form.paymentAmount));
      formData.append('fee', parseFloat(form.fee));
      formData.append('paymentTime', formattedPaymentTime);
      formData.append('regionName', form.regionName);
      formData.append('currency', form.currency);
      formData.append('comments', form.comments);

      form.files.forEach(file => {
        formData.append('files', file);
      });

      isSubmitting.value = true

      try {
        const response = await apiCreateApplication(formData)
        if (response.data.success) { // 根据 ApiResponse 结构调整
          applicationId.value = response.data.data.processId // 确保返回的数据包含 processId
          processStatus.value = 3
          ElMessage.success(t('enrollScholar.ApplicationSavedSuccessfully'))
          canSaveApplication.value = false
        } else {
          ElMessage.error(t('enrollScholar.ApplicationCreationFailed'))
        }
      } catch (error) {
        ElMessage.error(t('enrollScholar.ApplicationCreationFailed'))
      } finally {
        isSubmitting.value = false
      }
    }

    /**
     * 处理图片预览
     * @param {Object} file 
     */
     const handlePreview = (file) => {
      previewImage.value = file.url || URL.createObjectURL(file.raw)
      previewVisible.value = true
    }

    /**
     * 提交审核的函数
     */
    const submitAudit = async () => {
      if (!applicationId.value) {
        ElMessage.error(t('enrollScholar.NoApplicationToSubmit'))
        return
      }

      isSubmitting.value = true

      try {
        const applicationData = {
          processId: applicationId.value,
          comnents: form.comments
        };
        const response = await apiSubmitApplication(applicationData)
        if (response.data.success) {
          ElMessage.success(t('enrollScholar.AuditSubmittedSuccessfully'))
          ElMessage.info(t('enrollScholar.WaitingForFinanceReview'))
          resetForm()
        } else {
          ElMessage.error(t('enrollScholar.AuditSubmissionFailed'))
        }
      } catch (error) {
        ElMessage.error(t('enrollScholar.AuditSubmissionFailed'))
      } finally {
        isSubmitting.value = false
      }
    }

    /**
     * 重置表单的函数
     */
    const resetForm = () => {
      form.fullname = ''
      form.inviterName = ''
      form.managerName = store.username
      form.paymentMethod = '全额支付'
      form.paymentAmount = ''
      form.fee = ''
      form.paymentTime = null
      form.comments = ''
      form.files = []
      fileList.value = []
      canSaveApplication.value = true
      inviterNameError.value = false
      managerNameError.value = false
      isFullnameValidated.value = false
      applicationId.value = null
      processStatus.value = null
      fileError.value = false
      fileErrorMessage.value = ''
      isInviterValidated.value = false
      isManagerValidated.value = true
      isFullnameValidated.value = false
      if (enrollForm.value) {
        enrollForm.value.resetFields()
      }
      form.regionName = regions.value[0].regionName
      form.currency = regions.value[0].currency
      form.scholarLevel = 6
      form.projectName = projectNameMap.value[3]
      form.projectAmount = projectMap.value[3][form.currency]
    }

    // 监听邀请人姓名的变化
    watch(() => form.inviterName, (newVal, oldVal) => {
      isInviterValidated.value = false
      inviterNameError.value = false
    })

    // 监听管理人姓名的变化
    watch(() => form.managerName, (newVal, oldVal) => {
      isManagerValidated.value = false
      managerNameError.value = false
    })

    // 监听学员姓名的变化
    watch(() => form.fullname, (newVal, oldVal) => {
      isFullnameValidated.value = false
      fullnameError.value = false
    })
    
    /**
     * 学员等级选项
     */
    const scholarLevelOptions = ref([
      { value: 4, label: t('enrollScholar.advanced') },
      { value: 5, label: t('enrollScholar.intermediate') },
      { value: 6, label: t('enrollScholar.beginner') },
    ])

    /**
     * 计算 rateOptions 选择项
     */
     const computedRateOptions = computed(() => {
      if (form.scholarLevel === 6) return []

      if (!form.scholarLevel || !rateOptions[form.scholarLevel]) return []
      const options = rateOptions[form.scholarLevel]
      return Object.keys(options).map(key => ({
        key: key,
        label: `${options[key].rateA}${options[key].rateB ? ' + ' + options[key].rateB : ''}`
      }))
    })

    /**
     * 监听 scholarLevel 和 rateOption 变化，设置 rateA 和 rateB
     */
    watch([() => form.scholarLevel, () => form.rateOption], ([newLevel, newOption], [oldLevel, oldOption]) => {
      if (newLevel === 6) {
        form.rateA = ''
        form.rateB = ''
        form.rateOption = ''
      } else if (newLevel !== oldLevel && rateOptions[newLevel]) {
        // 仅在 scholarLevel 变化时设置为第一个选项
        const firstOptionKey = Object.keys(rateOptions[newLevel])[0]
        form.rateOption = firstOptionKey
        form.rateA = rateOptions[newLevel][firstOptionKey].rateA
        form.rateB = rateOptions[newLevel][firstOptionKey].rateB
      } else if (newOption && rateOptions[newLevel] && rateOptions[newLevel][newOption]) {
        // 保持当前 rateOption 的选择
        form.rateA = rateOptions[newLevel][newOption].rateA
        form.rateB = rateOptions[newLevel][newOption].rateB
      } else {
        form.rateA = ''
        form.rateB = ''
      }
    })

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

    // 监听学员等级变化，更新项目名称和金额
    watch(() => form.scholarLevel, (newVal) => {
      const project = projectMap.value[newVal-3]
      form.projectAmount = project ? project[form.currency] : ''
      form.projectName = project ? projectNameMap.value[newVal-3] : ''
    })

    // 监听地区变化，自动填充货币
    watch(() => form.regionName, (newRegionName) => {
      const selectedRegion = regions.value.find(region => region.regionName === newRegionName)
      if (selectedRegion) {
        form.currency = selectedRegion.currency
      }
    })

    // 监听货币变化，自动更新项目金额
    watch(() => form.currency, (newCurrency) => {
      const project = projectMap.value[form.scholarLevel-3]
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
          form.scholarLevel = 6
        } else {
          ElMessage.error(t('enrollScholar.FetchTypesFailed'))
        }
      } catch (error) {
        ElMessage.error(t('enrollScholar.FetchTypesFailed'))
      }
    }

    onMounted(() => {
      loadAllTypes()
    })

    return {
      form,
      rules,
      handleFileChange,
      handleFileRemove,
      handleExceed,
      beforeUpload,
      validateInviterName,
      validateManagerName,
      validateFullname,
      saveApplication,
      submitAudit,
      resetForm,
      fileList,
      isInviterValidated,
      isManagerValidated,
      isFullnameValidated,
      canSaveApplication,
      canSubmitAudit,
      currencyOptions,
      inviterNameError,
      managerNameError,
      fullnameError,
      isSubmitting,
      applicationId,
      processStatus,
      enrollForm,
      handlePreview,
      previewVisible,
      previewImage,
      t,
      isInviterLoading,
      isManagerLoading,
      isFullnameLoading,
      fileError,
      regions,
      scholarLevelOptions,
      computedRateOptions
    }
  }
}
</script>

<style scoped>
.enroll-scholar-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 移除居中 */
  padding: 40px 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.enroll-scholar {
  width: 100%;
  max-width: 1200px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

/* 左侧表单样式 */
.form-column {
  padding-right: 20px;
  border-right: 1px solid #e0e0e0;
}

/* 右侧上传模块样式 */
.upload-column {
  padding-left: 20px;
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

/* 上传模块样式 */
.upload-demo {
  border: 2px dashed #d9d9d9;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  border-radius: 8px;
  transition: border-color 0.3s;
}

.upload-demo:hover {
  border-color: #409EFF;
}

.upload-demo .el-icon-upload {
  font-size: 48px;
  color: #409EFF;
}

.el-upload__text {
  font-size: 18px;
  color: #555;
  margin-top: 10px;
}

.el-upload__tip {
  font-size: 14px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .enroll-scholar-container {
    padding: 20px 10px;
  }

  .form-column, .upload-column {
    padding: 0;
    border: none;
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
