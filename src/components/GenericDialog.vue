<!-- GenericDialog.vue -->
<template>
    <el-dialog
      :title="title"
      v-model="visible"
      :width="dialogWidth"
      :before-close="handleClose"
      :modal-append-to-body="false"
      :fullscreen="false"
      :close-on-click-modal="false"
    >
      <div class="search-container" v-if="searchableFields && searchableFields.length">
        <el-form :inline="true" class="search-form" @submit.prevent>
          <el-form-item
            v-for="field in searchableFields"
            :key="field"
            :label="fieldLabel(field)"
          >
            <el-input
              v-model="searchCriteria[field]"
              placeholder="请输入"
              @input="handleSearch"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-container">
        <el-table
          :data="filteredData"
          style="width: 100%;"
          :header-cell-style="{ position: 'sticky', top: '0', background: '#fff', zIndex: 1 }"
          :max-height="tableMaxHeight"
          :span-method="spanMethod"
        >
          <el-table-column
            v-for="field in displayFields"
            :key="field"
            :prop="field"
            :label="fieldLabel(field)"
            :min-width="100"
          >
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button @click="visible = false">关闭</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { computed, reactive, watch, toRefs } from 'vue'
  import {
    ElDialog,
    ElTable,
    ElTableColumn,
    ElButton,
    ElForm,
    ElFormItem,
    ElInput,
  } from 'element-plus'
  
  // 定义组件接收的 props
  const props = defineProps({
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: '数据表',
    },
    data: {
      type: Array,
      required: true,
    },
    fields: {
      type: Array,
      default: () => [],
    },
    searchableFields: {
      type: Array,
      default: () => [],
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
  
  // 定义组件发出的事件
  const emit = defineEmits(['update:visible'])
  
  // 解构 props
  const { visible, title, data, fields, searchableFields, maxWidth, maxHeight } = toRefs(props)
  
  // 计算对话框宽度
  const dialogWidth = computed(() => {
    return maxWidth.value
  })
  
  // 计算表格最大高度
  const tableMaxHeight = computed(() => {
    return maxHeight.value
  })
  
  // 计算要显示的字段
  const displayFields = computed(() => {
    if (fields.value && fields.value.length > 0) {
      return fields.value
    } else if (data.value.length > 0) {
      return Object.keys(data.value[0])
    } else {
      return []
    }
  })
  
  // 定义搜索条件的响应式对象
  const searchCriteria = reactive({})
  
  // 初始化搜索条件
  searchableFields.value.forEach((field) => {
    if (!(field in searchCriteria)) {
      searchCriteria[field] = ''
    }
  })
  
  // 计算过滤后的数据
  const filteredData = computed(() => {
    return data.value.filter((item) => {
      return searchableFields.value.every((field) => {
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
  
  // 处理搜索事件
  const handleSearch = () => {
    // 触发 filteredData 的重新计算
  }
  
  // 重置搜索条件
  const resetSearch = () => {
    searchableFields.value.forEach((field) => {
      searchCriteria[field] = ''
    })
  }
  
  // 关闭对话框时触发
  const handleClose = (done) => {
    emit('update:visible', false)
  }
  
  // 可选：定义表格单元格跨行或跨列的方法（如果需要）
  const spanMethod = (params) => {
    // 示例：不进行任何跨行或跨列处理
    return {
      rowspan: 1,
      colspan: 1,
    }
  }
  
  // 方法：根据字段名称返回显示标签，可以根据需要自定义
  const fieldLabel = (field) => {
    // 简单地将字段名称首字母大写作为标签
    return field.charAt(0).toUpperCase() + field.slice(1)
  }
  </script>
  
  <style scoped>
  .table-container {
    max-height: 60vh; /* 与 tableMaxHeight 保持一致 */
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
  