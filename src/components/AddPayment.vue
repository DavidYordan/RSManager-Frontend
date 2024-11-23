<!-- src/components/AddPayment.vue -->
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
            <el-select v-model="form.regionName" disabled placeholder="选择区域">
              <el-option
                v-for="option in regionOptions"
                :key="option"
                :label="option"
                :value="option"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="币种" prop="currency">
            <el-select v-model="form.currency" placeholder="选择币种">
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

      <!-- 第二行：项目名称（可选）、项目金额（禁用） -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-select v-model="form.projectName" placeholder="选择项目名称">
              <el-option
                v-for="name in projectNameOptions"
                :key="name"
                :label="name"
                :value="name"
              />
            </el-select>
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
            <el-select v-model="form.paymentMethod" placeholder="选择支付方式">
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
          <el-form-item label="支付时间" prop="paymentTime">
            <el-date-picker
              v-model="form.paymentTime"
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
import { ref, watch } from 'vue'
import { addPayment } from '@/api/application'
import { fetchAllRegions } from '@/api/utils'
import { ElMessage, ElLoading } from 'element-plus'

// 接收外部传入的 props
const props = defineProps({
  processId: {
    type: Number,
    required: true
  },
  currentRegionName: {
    type: String,
    default: ''
  },
  currentCurrency: {
    type: String,
    default: ''
  },
  currentProjectName: {
    type: String,
    default: ''
  },
  currentProjectAmount: {
    type: Number,
    default: 0
  },
  currentPaymentMethod: {
    type: String,
    default: ''
  }
})

// 对话框可见性
const dialogVisible = ref(false)

// 表单数据
const form = ref({
  regionName: props.currentRegionName,
  currency: props.currentCurrency,
  paymentAmount: null,
  fee: null,
  paymentTime: '',
  comments: '新增支付记录',
  uploadFile: null,
  projectName: props.currentProjectName,
  projectAmount: props.currentProjectAmount,
  paymentMethod: props.currentPaymentMethod,
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
  paymentTime: [
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
const currencyOptions = ref([])
const projectMap = ref({})
const projectNameOptions = ref([])
const paymentMethodOptions = [
  { label: '全额支付', value: '全额支付' },
  { label: '分期付款', value: '分期付款' },
]

// 上传文件列表
const fileList = ref([])

// 预览相关
const previewVisible = ref(false)
const previewImage = ref('')

// 加载地区、币种、项目名称和项目金额
const loadAllTypes = async () => {
  try {
    const response = await fetchAllRegions()
    if (response.data.success) {
      const data = response.data.data

      // 提取所有地区选项
      regionOptions.value = [...new Set(data.map(region => region.regionName))]

      // 提取所有货币选项
      currencyOptions.value = [...new Set(data.map(region => region.currency))]

      // 处理项目名称和金额映射
      data.forEach(region => {
        region.regionProjectDTOs.forEach(project => {
          if (!projectMap.value[project.projectName]) {
            projectMap.value[project.projectName] = {}
          }
          projectMap.value[project.projectName][region.currency] = project.projectAmount
        })
      })

      // 提取唯一项目名称列表
      const projectSet = new Set()
      data.forEach(region => {
        region.regionProjectDTOs.forEach(project => {
          projectSet.add(project.projectName)
        })
      })

      projectNameOptions.value = [...projectSet]
    } else {
      ElMessage.error("获取地区数据失败")
    }
  } catch (error) {
    ElMessage.error("获取地区数据失败")
  }
}

// 更新项目金额的方法
const updateProjectAmount = () => {
  const newCurrency = form.value.currency
  const newProjectName = form.value.projectName
  if (
    newCurrency &&
    newProjectName &&
    projectMap.value[newProjectName] &&
    projectMap.value[newProjectName][newCurrency]
  ) {
    form.value.projectAmount = projectMap.value[newProjectName][newCurrency]
  } else {
    form.value.projectAmount = 0
  }
}

// 监听币种和项目名称的变化，更新项目金额
watch(
  () => [form.value.currency, form.value.projectName],
  updateProjectAmount
)

// 打开对话框的方法
const openDialog = async () => {
  dialogVisible.value = true
  await loadAllTypes()
  // 确保在加载完数据后更新项目金额
  updateProjectAmount()
}

// 重置表单
const resetForm = () => {
  dialogVisible.value = false
  form.value = {
    regionName: props.currentRegionName,
    currency: props.currentCurrency,
    paymentAmount: null,
    fee: null,
    paymentTime: null,
    comments: '新增支付记录',
    uploadFile: null,
    projectName: props.currentProjectName || '',
    projectAmount: props.currentProjectAmount || 0,
    paymentMethod: '',
  }
  fileList.value = []
  // 重置后更新项目金额
  updateProjectAmount()
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
      formData.append('paymentTime', formatDate(form.value.paymentTime))
      formData.append('regionName', form.value.regionName)
      formData.append('currency', form.value.currency)
      formData.append('comments', form.value.comments)
      formData.append('paymentMethod', form.value.paymentMethod)
      formData.append('projectName', form.value.projectName)
      formData.append('projectAmount', form.value.projectAmount)
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
        emit('paymentAdded') // 触发父组件事件
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
const emit = defineEmits(['paymentAdded'])

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
