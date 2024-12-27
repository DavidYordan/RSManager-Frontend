<template>
  <el-dialog
    v-if="isDialogVisible"
    title="平台收益明细"
    v-model="isDialogVisible"
    :width="dialogWidth"
    :before-close="handleClose"
    :modal-append-to-body="false"
    :fullscreen="false"
    class="dialog-container"
  >
    <div class="table-container">
      <div class="table-row">
        <!-- 动态渲染表格 -->
        <el-table
          v-for="(tableData, index) in tableDataArray"
          :key="index"
          :data="tableData"
          class="table-item"
          :header-cell-style="{ position: 'sticky', top: '0', background: '#fff', zIndex: 1 }"
          :default-sort="{ prop: 'date', order: 'descending' }"
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
            sortable
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed, toRefs } from 'vue'
import {
  ElDialog,
  ElTable,
  ElTableColumn,
} from 'element-plus'

// 定义组件接收的 props
const props = defineProps({
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

// 定义字段中文名称
const fieldLabels = {
  date: '日期',
  sum: '收益',
}

// 定义要显示的字段
const displayFields = [
  'date',
  'sum'
]

const isDialogVisible = ref(false)

// 解构 props
const { data, maxWidth, maxHeight } = toRefs(props)

// 对数据按日期降序排序
const sortedData = computed(() => {
  return data.value.slice().sort((a, b) => {
    return new Date(b.date) - new Date(a.date)
  })
})

// 计算需要的表格数量
const numTables = computed(() => {
  const length = sortedData.value.length
  if (length > 40) {
    return 3
  } else if (length > 20) {
    return 2
  } else {
    return 1
  }
})

// 根据表格数量调整对话框宽度
const dialogWidth = computed(() => {
  if (numTables.value === 1) {
    return '30%'
  } else if (numTables.value === 2) {
    return '60%'
  } else {
    return '80%'
  }
})

// 将数据平均分割成 numTables 份
const tableDataArray = computed(() => {
  const dataLength = sortedData.value.length
  const num = numTables.value
  const perTable = Math.ceil(dataLength / num)
  const tables = []
  for (let i = 0; i < num; i++) {
    tables.push(sortedData.value.slice(i * perTable, (i + 1) * perTable))
  }
  return tables
})

// 关闭对话框时触发
const handleClose = (done) => {
  isDialogVisible.value = false
}

// 方法：根据字段名称返回显示标签
const fieldLabel = (field) => {
  return fieldLabels[field] || field
}

// 方法：根据字段名称返回格式化函数
const formatField = (field) => {
  return null
}

const openDialog = () => {
  isDialogVisible.value = true
}

defineExpose({
  openDialog,
})
</script>

<style scoped>
.table-container {
  max-height: 60vh; /* 与 maxHeight 保持一致 */
  overflow: auto;
}

.table-row {
  display: flex;
  justify-content: space-between;
}

.table-item {
  flex: 1;
  margin-right: 10px;
}

.table-item:last-child {
  margin-right: 0;
}
</style>
