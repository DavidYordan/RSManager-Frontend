<!-- src/components/AddPaymentS.vue -->
<template>
  <el-dialog
    title="新增支付记录"
    v-model="dialogVisible"
    width="600px"
    @close="resetForm"
  >
    <el-form :model="form" :rules="rules" ref="paymentForm" label-width="120px">
      <!-- 第一行：区域（禁用）、币种 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="区域" prop="regionName">
            <el-input v-model="form.regionName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="币种" prop="currencyName">
            <el-select v-model="form.currencyName" placeholder="选择币种">
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

      <!-- 第二行：项目名称（禁用）、项目金额（禁用） -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="form.projectName" placeholder="选择项目名称" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目金额" prop="projectAmount">
            <el-input v-model="form.projectAmount" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行：支付方式、支付时间 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="支付方式" prop="paymentMethod">
            <el-select v-model="form.paymentMethod" placeholder="选择支付方式" disabled>
              <el-option
                v-for="option in paymentMethodOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款日期" prop="paymentDate">
            <el-date-picker
              v-model="form.paymentDate"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行：支付金额、手续费 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="支付金额" prop="paymentAmount">
            <el-input-number v-model="form.paymentAmount" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手续费" prop="fee">
            <el-input-number v-model="form.fee" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="收款账户" prop="paymentAccount" required>
            <el-select
              v-model="form.paymentAccount"
              :disabled="isSubmitting"
              placeholder="选择收款账户"
            >
              <el-option
                v-for="option in paymentAccountOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>


      <!-- 第五行：备注 -->
      <el-form-item label="备注" prop="comments">
        <el-input
          type="textarea"
          v-model="form.comments"
          placeholder="请输入备注"
          :rows="4"
        ></el-input>
      </el-form-item>

      <!-- 第六行：上传文件模块 -->
      <el-form-item label="上传文件" prop="uploadFile">
        <el-upload
          class="upload-demo"
          drag
          action="#"
          list-type="picture-card"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :on-remove="handleRemove"
          :on-preview="handlePreview"
          :on-change="handleFileChange"
          :auto-upload="false"
          accept="image/*"
          multiple
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog v-model="previewVisible" width="50%">
          <img
            style="width: 100%"
            :src="previewImage"
            alt="Preview"
          />
        </el-dialog>
      </el-form-item>
    </el-form>

    <!-- 按钮组 -->
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { addPayment } from '@/api/application'
import { fetchAllRegions as apifetchAllRegions } from '@/api/utils'
import { searchPaymentAccount as apiSearchPaymentAccount } from '@/api/finance'
import { ElMessage, ElLoading } from 'element-plus'

// 接收外部传入的 props
const props = defineProps({
  processId: {
    type: Number,
    required: true
  },
  applicationData: {
    type: Object,
    required: true
  },
})

// 对话框可见性
const dialogVisible = ref(false)

const isSubmitting = ref(false)

const actionStr = ref({})

// 表单数据
const form = ref({
  regionName: '',
  currencyName: '',
  paymentAmount: null,
  fee: null,
  paymentDate: '',
  comments: '',
  uploadFile: null,
  projectName: '',
  projectAmount: null,
  paymentMethod: '',
  paymentAccount: '',
  roleId: null,
  fullname: '',
  rateA: '',
  rateB: '',
  startDate: '',
})

// 表单验证规则
const rules = {
  paymentAmount: [
    { required: true, message: "请输入支付金额", trigger: 'blur' },
    { type: 'number', message: "支付金额必须为数字", trigger: 'blur' },
  ],
  fee: [
    { required: true, message: "请输入手续费", trigger: 'blur' },
    { type: 'number', message: "手续费必须为数字", trigger: 'blur' },
  ],
  paymentDate: [
    { type: 'date', required: true, message: "请选择支付时间", trigger: 'change' },
  ],
  uploadFile: [
    { required: true, message: "请上传文件", trigger: 'change' },
  ],
}

// 表单引用
const paymentForm = ref(null)

// 数据定义
const regionOptions = ref([])
const projectMap = ref({})
const paymentMethodOptions = [
  { label: '全额支付', value: '全额支付' },
  { label: '分期付款', value: '分期付款' },
]

// 上传文件列表
const fileList = ref([])

// 预览相关
const previewVisible = ref(false)
const previewImage = ref('')

const currencyNameOptions = ref([])

// 加载地区、币种、项目名称和项目金额
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
        currencyNameCode: region.currencyNameCode,
        projectId: region.projectId,
        projectName: region.projectName,
        projectAmount: region.projectAmount
      }))

      // 提取所有货币选项
      currencyNameOptions.value = [...new Set(data.map(region => region.currencyName))]

      // 处理项目名称和金额映射
      data.forEach(region => {
        const uniqueId1 = region.regionName + region.currencyName + region.projectName
        const uniqueId2 = region.currencyName + region.projectName
        if (!projectMap[uniqueId1]) {
          projectMap[uniqueId1] = {}
          projectMap[uniqueId1]['projectName'] = region.projectName
          projectMap[uniqueId1]['projectAmount'] = region.projectAmount
        } else {
            projectMap[uniqueId1]['projectName'] = region.projectName
            projectMap[uniqueId1]['projectAmount'] = region.projectAmount
        }
        if (!projectMap[uniqueId2]) {
          projectMap[uniqueId2] = {}
          projectMap[uniqueId2]['projectName'] = region.projectName
          projectMap[uniqueId2]['projectAmount'] = region.projectAmount
        } else {
            projectMap[uniqueId2]['projectName'] = region.projectName
            projectMap[uniqueId2]['projectAmount'] = region.projectAmount
        }
      })


    } else {
      ElMessage.error("获取类型数据失败")
    }
  } catch (error) {
    ElMessage.error("获取类型数据失败:" + error)
  }
}

const projectNameOptions = computed(() => {
  return regionOptions.value
    .filter(region => region.regionName === form.value.regionName)
    .map(region => region.projectName)
})

const paymentAccountOptions = ref([])
const paymentAccountMap = ref({})

const fetchPaymentAccounts = async () => {
  try {
    const response = await apiSearchPaymentAccount({ accountStatus: true})
    if (response.data.success) {
      const data = response.data.data.content
      paymentAccountOptions.value = data.map(account => ({
        label: account.accountRegion + '-' + account.accountName + '-' + account.accountBank + '-' + account.accountNumber + '-' + account.accountComments,
        value: account.accountId
      }))
      data.forEach(account => {
        paymentAccountMap.value[account.accountId] = account
      })
    } else {
      ElMessage.error("获取支付账户失败")
    }
  } catch (error) {
    ElMessage.error("获取支付账户失败:" + error)
  }
}

// 监听货币变化，自动更新项目金额
watch(() => form.value.currencyName, (newcurrencyName) => {
  updateProjectAmount()
})

watch(() => form.value.projectName, (newProjectName) => {
  updateProjectAmount()
})

const updateProjectAmount = () => {
  const uniqueId1 = form.value.regionName + form.value.currencyName + form.value.projectName
  const uniqueId2 = form.value.currencyName + form.value.projectName
  if (projectMap[uniqueId1]) {
    form.value.projectAmount = projectMap[uniqueId1].projectAmount
  } else if (projectMap[uniqueId2]) {
    form.value.projectAmount = projectMap[uniqueId2].projectAmount
  } else {
  }
}

// 打开对话框的方法
const openDialog = async () => {
  dialogVisible.value = true
  actionStr.value = JSON.parse(props.applicationData.actionStr)
  console.log('actionStr.value', actionStr.value)
  initializeForm();
  await loadAllTypes()
  await fetchPaymentAccounts()
  // 确保在加载完数据后更新项目金额
  updateProjectAmount()
}

// 重置表单
const resetForm = () => {
  initializeForm();
  updateProjectAmount()
}

const isInitializing = ref(false)
const oldStatus = ref(null)

const initializeForm = () => {
  isInitializing.value = true;
  if (props.applicationData) {
    oldStatus.value = actionStr.value.oldStatus
    form.value.roleId = actionStr.value.roleId
    form.value.fullname = actionStr.value.fullname
    form.value.regionName = props.applicationData.regionName
    form.value.currencyName = actionStr.value.currencyName
    form.value.projectName = actionStr.value.projectName
    form.value.projectAmount = actionStr.value.projectAmount
    form.value.rateA = actionStr.value.rateA
    form.value.rateB = actionStr.value.rateB
    form.value.paymentDate = new Date(actionStr.value.startDate)
    form.value.paymentMethod = actionStr.value.paymentMethod
    form.value.comments = actionStr.value.comments
  }

  updateProjectAmount();

  nextTick(() => {
    isInitializing.value = false;
  });
}



// 上传前处理
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error("只能上传图片文件")
  } else {
    // 添加到表单数据
    form.value.uploadFile = file
  }
  return isImage
}

// 移除文件
const handleRemove = (file, fileList) => {
  form.value.uploadFile = null
}

// 预览文件
const handlePreview = (file) => {
  previewImage.value = file.url || URL.createObjectURL(file.raw)
  previewVisible.value = true
}

const handleFileChange = (file) => {
  if (file.status === 'success' || file.status === 'ready') {
    form.value.uploadFile = file.raw; // 将原始文件赋值到表单
  }
}

const formatDate = (date) => {
  if (!date) return null
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 提交表单
const onSubmit = () => {
  paymentForm.value.validate(async (valid) => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: '提交中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      // 准备数据
      const formData = new FormData()
      formData.append('processId', props.processId)
      formData.append('paymentAmount', form.value.paymentAmount)
      formData.append('fee', form.value.fee)
      formData.append('paymentDate', formatDate(form.value.paymentDate))
      formData.append('regionName', form.value.regionName)
      formData.append('currencyName', form.value.currencyName)
      formData.append('comments', form.value.comments)
      formData.append('paymentMethod', form.value.paymentMethod)
      formData.append('projectName', form.value.projectName)
      formData.append('projectAmount', form.value.projectAmount)
      formData.append('paymentAccountId', form.value.paymentAccount)
      if (form.value.uploadFile) {
        formData.append('files', form.value.uploadFile)
      } else {
        ElMessage.error("请上传文件")
        loading.close()
        return
      }

      try {
        await addPayment(formData)
        ElMessage.success("提交成功")
        resetForm()
        dialogVisible.value = false
        emit('paymentSAdded') // 触发父组件事件
      } catch (error) {
        ElMessage.error("提交失败")
      } finally {
        loading.close()
      }
    } else {
      ElMessage.error("请完善表单")
      return false
    }
  })
}

// 定义 emits
const emit = defineEmits(['paymentSAdded'])

// 暴露 openDialog 方法给父组件
defineExpose({
  openDialog
})
</script>

<style scoped>
.upload-demo i {
  font-size: 28px;
  color: #1890ff;
}
</style>
