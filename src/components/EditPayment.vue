<!-- src/components/EditPayment.vue -->
<template>
  <!-- 编辑支付记录对话框 -->
  <el-dialog
    title="修改支付记录"
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
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行：支付金额、手续费 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="支付金额" prop="paymentAmount">
            <el-input-number
              v-model="form.paymentAmount"
              :min="0"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手续费" prop="fee">
            <el-input-number
              v-model="form.fee"
              :min="0"
              style="width: 100%"
            />
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
      <el-form-item label="上传文件">
        <!-- 显示已存在的文件列表 -->
        <el-upload
          class="upload-demo"
          drag
          action="#"
          list-type="picture-card"
          :file-list="fileList"
          :before-remove="handleRemove"
          :on-preview="handlePreview"
          :on-change="handleFileChange"
          :auto-upload="false"
          accept="image/*"
          multiple
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
    </el-form>

    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览"
      v-model="imagePreviewVisible"
      width="60%"
      :before-close="closeImagePreviewDialog"
      :style="{ maxWidth: '90vw', maxHeight: '90vh' }"
    >
      <el-image
        :src="imagePreviewUrl"
        fit="contain"
        style="width: 100%; height: 100%;"
      ></el-image>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveImage">保存图片</el-button>
        <el-button @click="imagePreviewVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 按钮组 -->
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import {
  updatePaymentRecord,
  downloadFile
} from '@/api/application'
import { fetchAllRegions } from '@/api/utils'
import { ElMessage, ElLoading } from 'element-plus'

// 接收外部传入的 props
const props = defineProps({
  processId: {
    type: Number,
    required: true,
  },
  paymentData: {
    type: Object,
    required: true,
  },
})

// 定义 emits
const emit = defineEmits(['paymentEdited'])

// 对话框可见性
const dialogVisible = ref(false)

// 表单数据
const form = ref({
  paymentId: props.paymentData.paymentId,
  processId: props.processId,
  regionName: props.paymentData.regionName,
  currency: props.paymentData.currency,
  paymentMethod: props.paymentData.paymentMethod,
  paymentAmount: props.paymentData.paymentAmount,
  fee: props.paymentData.fee,
  actual: props.paymentData.actual,
  paymentTime: new Date(props.paymentData.paymentTime),
  comments: props.paymentData.comments,
  projectName: props.paymentData.projectName || '',
  projectAmount: props.paymentData.projectAmount || 0,
})

// 表单验证规则
const rules = {
  paymentAmount: [
    { required: true, message: '请输入支付金额', trigger: 'blur' },
    { type: 'number', message: '支付金额必须为数字', trigger: 'blur' },
  ],
  fee: [
    { required: true, message: '请输入手续费', trigger: 'blur' },
    { type: 'number', message: '手续费必须为数字', trigger: 'blur' },
  ],
  paymentTime: [
    {
      type: 'date',
      required: true,
      message: '请选择支付时间',
      trigger: 'change',
    },
  ],
}

// 表单引用
const paymentForm = ref(null)

// 定义数据结构
const regions = ref([])
const regionOptions = ref([])
const currencyOptions = ref([])
const projectMap = ref({})
const projectNameOptions = ref([])
const paymentMethodOptions = [
  { label: '全额支付', value: '全额支付' },
  { label: '分期付款', value: '分期付款' },
]

// 图片预览相关
const imagePreviewVisible = ref(false)
const imagePreviewUrl = ref('')
const imageOriginalFileName = ref('')

// 已存在的文件列表
const fileList = ref([])

// 新增的文件列表
const newFileList = ref([])

// 需要删除的文件列表
const deleteFiles = ref([])

// 添加一个 ref 来存储 Blob URL
const blobUrls = ref([])

// 加载地区、币种、项目名称和项目金额
const loadAllTypes = async () => {
  try {
    const response = await fetchAllRegions()
    if (response.data.success) {
      const data = response.data.data

      // 处理地区数据
      regions.value = data.map((region) => ({
        regionName: region.regionName,
        currency: region.currency,
      }))

      // 提取所有地区选项
      regionOptions.value = [
        ...new Set(data.map((region) => region.regionName)),
      ]

      // 提取所有货币选项
      currencyOptions.value = [
        ...new Set(data.map((region) => region.currency)),
      ]

      // 处理项目名称和金额映射
      data.forEach((region) => {
        region.regionProjectDTOs.forEach((project) => {
          if (!projectMap.value[project.projectName]) {
            projectMap.value[project.projectName] = {}
          }
          projectMap.value[project.projectName][region.currency] =
            project.projectAmount
        })
      })

      // 提取唯一项目名称列表
      const projectSet = new Set()
      data.forEach((region) => {
        region.regionProjectDTOs.forEach((project) => {
          projectSet.add(project.projectName)
        })
      })

      projectNameOptions.value = [...projectSet]
    } else {
      ElMessage.error('获取地区数据失败')
    }
  } catch (error) {
    ElMessage.error('获取地区数据失败')
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

// 加载已存在的文件
const loadExistingFiles = async () => {
  blobUrls.value.forEach((url) => URL.revokeObjectURL(url))
  blobUrls.value = []

  const existingPaths = props.paymentData.paymentFileSummary.filePaths || []
  const newFileListTemp = await Promise.all(
    existingPaths.map(async (path, index) => {
      try {
        const pathParts = path.split('/')
        const fileName = pathParts.pop()
        const targetDir = pathParts.join('/')

        // 使用 POST 方法下载文件
        const response = await downloadFile(
          { targetDir, fileName },
          { responseType: 'blob' }
        )
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        })
        const url = URL.createObjectURL(blob)
        blobUrls.value.push(url)

        return {
          name: fileName,
          url: url,
          uid: `-${index}`,
          status: 'finished',
          response: {
            filePath: path,
          },
        }
      } catch (error) {
        console.error(`Failed to load file ${path}:`, error)
        return null
      }
    })
  )

  fileList.value = newFileListTemp.filter((item) => item !== null)
}

// 打开对话框并初始化数据
const openDialog = async () => {
  dialogVisible.value = true
  await loadAllTypes()
  updateProjectAmount()
}

// 重置表单到初始状态
const resetForm = () => {
  dialogVisible.value = false
  form.value = {
    paymentId: props.paymentData.paymentId,
    processId: props.processId,
    regionName: props.paymentData.regionName,
    currency: props.paymentData.currency,
    paymentMethod: props.paymentData.paymentMethod,
    paymentAmount: props.paymentData.paymentAmount,
    fee: props.paymentData.fee,
    actual: props.paymentData.actual,
    paymentTime: new Date(props.paymentData.paymentTime),
    comments: props.paymentData.comments,
    projectName: props.paymentData.projectName || '',
    projectAmount: props.paymentData.projectAmount || 0,
  }
  newFileList.value = []
  deleteFiles.value = []
  updateProjectAmount()
}

// 监听 props 变化，更新表单数据
watch(
  () => props.paymentData,
  async (newData) => {
    if (newData) {
      form.value = {
        paymentId: newData.paymentId,
        processId: props.processId,
        regionName: newData.regionName,
        currency: newData.currency,
        paymentMethod: newData.paymentMethod,
        paymentAmount: newData.paymentAmount,
        fee: newData.fee,
        actual: newData.actual,
        paymentTime: new Date(newData.paymentTime),
        comments: newData.comments,
        projectName: newData.projectName || '',
        projectAmount: newData.projectAmount || 0,
      }
      await loadExistingFiles()
      newFileList.value = []
      deleteFiles.value = []
    }
  },
  { immediate: true }
)

// 处理文件移除
const handleRemove = (file, fileListRef) => {
  if (file.status === 'finished' && file.response && file.response.filePath) {
    deleteFiles.value = [...new Set([...deleteFiles.value, file.response.filePath])]
  } else {
    newFileList.value = newFileList.value.filter((f) => f.uid !== file.uid)
  }
}

// 处理文件预览
const handlePreview = async (file) => {
  if (file.status === 'finished' && file.response && file.response.filePath) {
    await handleDownloadFile(props.paymentData, file.response.filePath)
  } else {
    imagePreviewUrl.value = file.url || URL.createObjectURL(file.raw)
    imageOriginalFileName.value = file.name
    imagePreviewVisible.value = true
  }
}

// 文件变化处理
const handleFileChange = (newFile, fileListRef) => {
  if (newFile.status === 'ready') {
    newFileList.value.push(newFile)
  }
}

// 下载文件逻辑
const handleDownloadFile = async (record, filePath) => {
  ElLoading.service({
    lock: true,
    text: '下载中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  try {
    const pathParts = filePath.split('/')
    const fileName = pathParts.pop()
    const targetDir = pathParts.join('/')
    const response = await downloadFile(
      { targetDir, fileName },
      { responseType: 'blob' }
    )
    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    })
    const url = window.URL.createObjectURL(blob)
    const fileExtension = fileName.split('.').pop().toLowerCase()

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
    const supportedImage = imageExtensions.includes(fileExtension)

    if (supportedImage) {
      imageOriginalFileName.value = fileName
      imagePreviewUrl.value = url
      imagePreviewVisible.value = true
    } else {
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      ElMessage.success('下载成功')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('下载失败')
  } finally {
    ElLoading.service().close()
  }
}

// 提交表单
const onSubmit = async () => {
  paymentForm.value.validate(async (valid) => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: '提交中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      const payload = {
        processId: form.value.processId,
        paymentId: form.value.paymentId,
        regionName: form.value.regionName,
        currency: form.value.currency,
        paymentMethod: form.value.paymentMethod,
        paymentAmount: form.value.paymentAmount,
        paymentTime: formatDate(form.value.paymentTime),
        comments: form.value.comments,
        deleteFiles: deleteFiles.value,
        projectName: form.value.projectName,
        projectAmount: form.value.projectAmount,
      }

      try {
        const formData = new FormData()
        for (const key in payload) {
          formData.append(key, payload[key])
        }
        formData.append('fee', form.value.fee)
        if (newFileList.value.length > 0) {
          newFileList.value.forEach((file) => {
            formData.append('files', file.raw)
          })
        }

        await updatePaymentRecord(formData)
        ElMessage.success('提交成功')
        resetForm()
        emit('paymentEdited')
      } catch (error) {
        console.error(error)
        ElMessage.error('提交失败')
      } finally {
        loading.close()
      }
    } else {
      ElMessage.error('请完善表单')
      return false
    }
  })
}

// 保存图片到本地
const saveImage = () => {
  if (!imagePreviewUrl.value) {
    ElMessage.error('没有图片可以保存')
    return
  }

  const link = document.createElement('a')
  link.href = imagePreviewUrl.value
  let filename = imageOriginalFileName.value || '下载的图片'
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  ElMessage.success('图片已保存')
}

// 关闭图片预览对话框时清理相关数据
const closeImagePreviewDialog = () => {
  imagePreviewVisible.value = false
  imagePreviewUrl.value = ''
  imageOriginalFileName.value = ''
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return null
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 组件卸载时释放 Blob URL
onUnmounted(() => {
  blobUrls.value.forEach((url) => URL.revokeObjectURL(url))
})

// 暴露 openDialog 方法给父组件
defineExpose({
  openDialog,
})
</script>

<style scoped>
.upload-demo i {
  font-size: 28px;
  color: #1890ff;
}
</style>
