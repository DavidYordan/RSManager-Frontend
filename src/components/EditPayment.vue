<!-- src/components/EditPayment.vue -->
<template>
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

      <!-- 第二行：项目名称（可选）、项目金额（禁用） -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="form.projectName" placeholder="输入项目名称" disabled/>
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
            <el-input v-model="form.paymentMethod" placeholder="输入支付方式" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="支付时间" prop="paymentDate">
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
import { ref, watch, computed, onUnmounted } from 'vue'
import {
  updatePaymentRecord,
  downloadFile
} from '@/api/application'
import { fetchAllRegions } from '@/api/utils'
import { searchPaymentAccount as apiSearchPaymentAccount } from '@/api/finance'
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
const isSubmitting = ref(false)

const getPaymentAccountId = () => {
  if (!props.paymentData.paymentAccountStr) {
    return null
  }
  const accountStr = props.paymentData.paymentAccountStr;
  const delimiterIndex = accountStr.indexOf("|");
  if (delimiterIndex === -1) {
    return null;
  }
  return parseInt(accountStr.substring(0, delimiterIndex), 10);
}

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
      form.value.paymentAccount = getPaymentAccountId()
    } else {
      ElMessage.error("获取支付账户失败")
    }
  } catch (error) {
    ElMessage.error("获取支付账户失败:" + error)
  }
}

// 表单数据
const form = ref({
  paymentId: props.paymentData.paymentId,
  processId: props.processId,
  regionName: props.paymentData.regionName,
  currencyName: props.paymentData.currencyName,
  paymentMethod: props.paymentData.paymentMethod,
  paymentAmount: props.paymentData.paymentAmount,
  fee: props.paymentData.fee,
  actual: props.paymentData.actual,
  paymentDate: new Date(props.paymentData.paymentDate),
  comments: props.paymentData.comments,
  projectName: props.paymentData.projectName || '',
  projectAmount: props.paymentData.projectAmount || 0,
  paymentAccount: getPaymentAccountId(),
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
  paymentDate: [
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
const regionOptions = ref([])
const projectMap = ref({})
const currencyNameOptions = ref([])
const paymentMethodOptions = [
  { label: '全额支付', value: '全额支付' },
  { label: '分期付款', value: '分期付款' },
]

// 图片预览相关
const imagePreviewVisible = ref(false)
const imagePreviewUrl = ref('')
const imageOriginalFileName = ref('')
const previewVisible = ref(false)
const previewImage = ref('')

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
      regionOptions.value = data.map((region) => ({
        regionName: region.regionName,
        regionCode: region.regionCode,
        roleId: region.roleId,
        currencyName: region.currencyName,
        currencyNameCode: region.currencyNameCode,
        projectId: region.projectId,
        projectName: region.projectName,
        projectAmount: region.projectAmount
      }))

      // 提取所有地区选项
      regionOptions.value = [
        ...new Set(data.map((region) => region.regionName)),
      ]

      // 提取所有货币选项
      currencyNameOptions.value = [
        ...new Set(data.map((region) => region.currencyName)),
      ]

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
      ElMessage.error('获取地区数据失败')
    }
  } catch (error) {
    ElMessage.error('获取地区数据失败' + error)
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
  await fetchPaymentAccounts()
  updateProjectAmount()
}

// 重置表单到初始状态
const resetForm = () => {
  dialogVisible.value = false
  form.value = {
    paymentId: props.paymentData.paymentId,
    processId: props.processId,
    regionName: props.paymentData.regionName,
    currencyName: props.paymentData.currencyName,
    paymentMethod: props.paymentData.paymentMethod,
    paymentAmount: props.paymentData.paymentAmount,
    fee: props.paymentData.fee,
    actual: props.paymentData.actual,
    paymentDate: new Date(props.paymentData.paymentDate),
    comments: props.paymentData.comments,
    projectName: props.paymentData.projectName || '',
    projectAmount: props.paymentData.projectAmount || 0,
    projectAccount: props.paymentData.projectAccount || '',
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
        currencyName: newData.currencyName,
        paymentMethod: newData.paymentMethod,
        paymentAmount: newData.paymentAmount,
        fee: newData.fee,
        actual: newData.actual,
        paymentDate: new Date(newData.paymentDate),
        comments: newData.comments,
        projectName: newData.projectName || '',
        projectAmount: newData.projectAmount || 0,
        projectAccount: newData.projectAccount || '',
      }
      await loadExistingFiles()
      newFileList.value = []
      deleteFiles.value = []
    }
  },
  { immediate: true }
)

// 上传前处理
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error("只能上传图片文件")
  } else {
    form.value.uploadFile = file
  }
  return isImage
}

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
        currencyName: form.value.currencyName,
        paymentMethod: form.value.paymentMethod,
        paymentAmount: form.value.paymentAmount,
        fee: form.value.fee,
        paymentDate: formatDate(form.value.paymentDate),
        comments: form.value.comments,
        deleteFiles: deleteFiles.value,
        projectName: form.value.projectName,
        projectAmount: form.value.projectAmount,
        paymentAccountId: form.value.paymentAccount,
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
