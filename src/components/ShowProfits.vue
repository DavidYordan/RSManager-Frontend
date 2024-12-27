<!-- ShowProfits.vue -->
<template>
  <el-dialog
    v-if="isDialogVisible"
    :title="title"
    v-model="isDialogVisible"
    :width="dialogWidth"
    :before-close="handleClose"
    :modal-append-to-body="false"
    :fullscreen="false"
    class="dialog-container"
  >
    <div class="search-container" v-if="searchableFields.length">
      <el-form :inline="true" class="search-form" @submit.prevent>
        <el-form-item
          v-for="field in searchableFields"
          :key="field"
          :label="fieldLabel(field)"
        >
          <component
            :is="getComponentType(field)"
            v-model="searchCriteria[field]"
            :placeholder="'请输入' + fieldLabel(field)"
            @input="handleSearch"
            clearable
            v-bind="getComponentProps(field)"
          >
            <el-option
              v-if="field === 'inviterRoleId'"
              v-for="(label, value) in roleIdMapping"
              :key="value"
              :label="label"
              :value="value"
            ></el-option>
          </component>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table
        :data="sortedData"
        style="width: 100%;"
        :header-cell-style="{ position: 'sticky', top: '0', background: '#fff', zIndex: 1 }"
        :max-height="tableMaxHeight"
        :span-method="spanMethod"
        :default-sort="{ prop: 'paymentDate', order: 'descending' }"
        stripe
        :border="true"
      >
        <el-table-column
          v-for="field in displayFields"
          :key="field"
          :prop="field"
          :label="fieldLabel(field)"
          :min-width="100"
          :formatter="formatField(field)"
          :sortable="true"
        >
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed, reactive, watch, toRefs } from 'vue'
import {
  ElDialog,
  ElTable,
  ElTableColumn,
  ElButton,
  ElForm,
  ElFormItem,
  ElOption,
} from 'element-plus'

// 定义组件接收的 props
const props = defineProps({
  title: {
    type: String,
    default: '数据表',
  },
  data: {
    type: Array,
    required: true,
  },
  maxWidth: {
    type: String,
    default: '80%', // 默认最大宽度
  },
  maxHeight: {
    type: String,
    default: '60vh', // 默认最大高度
  },
})

// 定义角色 ID 映射
const roleIdMapping = {
  0: '无',
  4: '高阶学员',
  5: '中阶学员',
  6: '初阶学员',
}

// 定义字段中文名称
const fieldLabels = {
  regionName: '区域',
  userFullname: '姓名',
  currencyName: '币种',
  paymentDate: '付款日期',
  paymentAmount: '支付金额',
  fee: '手续费',
  actual: '实收金额',
  rate: '分佣比率',
  profit: '分佣',
  projectName: '项目名称',
  projectAmount: '项目金额',
  inviterFullname: '邀请人姓名',
  inviterRoleId: '分佣角色',
}

// 定义要显示的字段
const displayFields = [
  'regionName',
  'userFullname',
  'currencyName',
  'paymentDate',
  'projectName',
  'projectAmount',
  'paymentAmount',
  'fee',
  'actual',
  'profit',
  'rate',
  'inviterFullname',
  'inviterRoleId',
]

// 定义可搜索的字段
const searchableFields = ['userFullname', 'regionName', 'currencyName']

const isDialogVisible = ref(false)

// 解构 props
const { title, data, maxWidth, maxHeight } = toRefs(props)

// 计算对话框宽度
const dialogWidth = computed(() => {
  return maxWidth.value
})

// 计算表格最大高度
const tableMaxHeight = computed(() => {
  return maxHeight.value
})

// 定义搜索条件的响应式对象
const searchCriteria = reactive({
  userFullname: '',
  regionName: '',
  currencyName: '',
})

// 计算过滤后的数据
const filteredData = computed(() => {
  return data.value.filter((item) => {
    return searchableFields.every((field) => {
      if (!searchCriteria[field]) return true
      const fieldValue = item[field]
      if (fieldValue === null || fieldValue === undefined) return false
      return fieldValue
        .toString()
        .toLowerCase()
        .includes(searchCriteria[field].toString().toLowerCase())
    })
  })
})

// 计算排序后的数据，默认按付款日期倒序
const sortedData = computed(() => {
  return [...filteredData.value].sort((a, b) => {
    return new Date(b.paymentDate) - new Date(a.paymentDate)
  })
})

// 处理搜索事件
const handleSearch = () => {
  // 触发 filteredData 的重新计算
}

// 重置搜索条件
const resetSearch = () => {
  searchableFields.forEach((field) => {
    searchCriteria[field] = ''
  })
}

// 关闭对话框时触发
const handleClose = (done) => {
  isDialogVisible.value = false
}

// 可选：定义表格单元格跨行或跨列的方法（如果需要）
const spanMethod = (params) => {
  // 示例：不进行任何跨行或跨列处理
  return {
    rowspan: 1,
    colspan: 1,
  }
}

// 方法：根据字段名称返回显示标签
const fieldLabel = (field) => {
  return fieldLabels[field] || field
}

// 方法：根据字段名称返回格式化函数
const formatField = (field) => {
  if (field === 'inviterRoleId') {
    return (row) => roleIdMapping[row[field]] || row[field]
  }
  return null
}

// 方法：根据字段名称返回组件类型
const getComponentType = (field) => {
  if (field === 'inviterRoleId') {
    return 'el-select'
  }
  return 'el-input'
}

// 方法：根据字段名称返回组件的额外属性
const getComponentProps = (field) => {
  if (field === 'inviterRoleId') {
    return {
      clearable: true,
    }
  }
  return {}
}

const openDialog = () => {
  isDialogVisible.value = true
}

defineExpose({
  openDialog,
})
</script>

<style lang="scss" scoped>
.table-container {
  max-height: 80%;
  overflow: auto;
}

.search-container {
  margin-bottom: 16px;
  overflow: auto;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
}

.search-form .el-form-item {
  margin-right: 16px;
  margin-bottom: 12px;
}
</style>
