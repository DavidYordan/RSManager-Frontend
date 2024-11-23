<template>
  <div class="detailed-config">
    <!-- 筛选查询部分 -->
    <el-form :model="searchForm" class="filter-form" @submit.prevent>
      <el-row :gutter="20">
        <!-- 第一行筛选项 -->
        <el-col :span="6">
          <el-form-item :label="$t('DetailedConfig.fullname')" prop="fullname">
            <el-input v-model="searchForm.fullname" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('DetailedConfig.username')" prop="username">
            <el-input v-model="searchForm.username" placeholder="请输入用户账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('DetailedConfig.roleId')" prop="roleId">
            <el-select v-model="searchForm.roleId" placeholder="请选择角色" clearable style="width: 100%;">
              <el-option
                v-for="(label, value) in roleOptions"
                :key="value"
                :label="label"
                :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('DetailedConfig.permissionId')" prop="permissionId">
            <el-select v-model="searchForm.permissionId" placeholder="请选择权限名称" clearable style="width: 100%;">
              <el-option
                v-for="(label, value) in permissionIdOptions"
                :key="value"
                :label="label"
                :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px;">
        <!-- 第二行筛选项 -->
        <el-col :span="6">
          <el-form-item :label="$t('DetailedConfig.isEnabled')" prop="isEnabled">
            <el-select v-model="searchForm.isEnabled" placeholder="是否启用" clearable style="width: 100%;">
              <el-option :label="$t('DetailedConfig.optionYes')" :value="true"></el-option>
              <el-option :label="$t('DetailedConfig.optionNo')" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('DetailedConfig.userId')" prop="userId">
            <el-input v-model="searchForm.userId" placeholder="请输入用户ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
        </el-col>
        <el-col :span="6" class="button-group">
          <el-button type="primary" @click="handleQuery">{{ $t('DetailedConfig.query') }}</el-button>
          <el-button style="margin-left: 10px;" @click="handleReset">{{ $t('DetailedConfig.reset') }}</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 表格展示部分 -->
    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 20px;"
      v-loading="loading"
      :border="true"
      :default-sort="{prop: 'userId', order: 'ascending'}">
      <el-table-column
        prop="userId"
        :label="$t('DetailedConfig.userId')"
        >
      </el-table-column>
      <el-table-column
        prop="username"
        :label="$t('DetailedConfig.username')"
        >
        <template #default="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column
        prop="fullname"
        :label="$t('DetailedConfig.fullname')"
        >
        <template #default="scope">
          {{ scope.row.fullname }}
        </template>
      </el-table-column>
      <el-table-column
        prop="roleId"
        :label="$t('DetailedConfig.roleId')"
        >
        <template #default="scope">
          {{ getRoleName(scope.row.roleId) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="permissionId"
        :label="$t('DetailedConfig.permissionId')"
        >
        <template #default="scope">
          {{ getPermissionId(scope.row.permissionId) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="rate1"
        :label="$t('DetailedConfig.rate1')"
      >
        <template #default="scope">
          <div v-if="editingRow === scope.$index">
            <el-input
              v-model="scope.row.rate1"
              placeholder="0-1"
              style="width: 100%;"
            />
          </div>
          <div v-else>
            {{ scope.row.rate1 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="rate2"
        :label="$t('DetailedConfig.rate2')"
      >
        <template #default="scope">
          <div v-if="editingRow === scope.$index">
            <el-input
              v-model="scope.row.rate2"
              placeholder="0-1"
              style="width: 100%;"
            />
          </div>
          <div v-else>
            {{ scope.row.rate2 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="isEnabled"
        :label="$t('DetailedConfig.isEnabled')"
        >
        <template #default="scope">
          <el-switch v-model="scope.row.isEnabled" :disabled="editingRow !== scope.$index"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="startDate"
        :label="$t('DetailedConfig.startDate')"
        >
        <template #default="scope">
          <div v-if="editingRow === scope.$index">
            <el-date-picker
              v-model="scope.row.startDate"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
              @change="formatDate('startDate')"
            />
          </div>
          <div v-else>
            {{ scope.row.startDate }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="endDate"
        :label="$t('DetailedConfig.endDate')"
        >
        <template #default="scope">
          <div v-if="editingRow === scope.$index">
            <el-date-picker
              v-model="scope.row.endDate"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
              @change="formatDate('endDate')"
            />
          </div>
          <div v-else>
            {{ scope.row.endDate }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('DetailedConfig.actions')"
        >
        <template #default="scope">
          <div v-if="editingRow === scope.$index">
            <el-button size="small" @click="handleCancel">
              {{ $t('DetailedConfig.cancel') }}
            </el-button>
            <el-button type="primary" size="small" @click="handleSave(scope.row, scope.$index)">
              {{ $t('DetailedConfig.save') }}
            </el-button>
          </div>
          <div v-else>
            <el-button type="primary" size="small" @click="handleEdit(scope.$index)">
              {{ $t('DetailedConfig.edit') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { searchUserPermissions, updateuserpermission } from '@/api/utils';

// 国际化
const { t } = useI18n();

// 筛选表单数据
const searchForm = reactive({
  userId: '',
  username: '',
  fullname: '',
  roleId: '',
  permissionId: null,
  isEnabled: null
});

// 角色选项映射
const roleOptions = {
  2: t('DetailedConfig.roleOptions.MANAGER'),
  3: t('DetailedConfig.roleOptions.MINISTER'),
  4: t('DetailedConfig.roleOptions.AGENT1L'),
  5: t('DetailedConfig.roleOptions.AGENT2L')
};

const roleMaps = {
  1: t('DetailedConfig.roleOptions.SUPER_ADMIN'),
  2: t('DetailedConfig.roleOptions.MANAGER'),
  3: t('DetailedConfig.roleOptions.MINISTER'),
  4: t('DetailedConfig.roleOptions.AGENT1L'),
  5: t('DetailedConfig.roleOptions.AGENT2L'),
  6: t('DetailedConfig.roleOptions.AGENT3L'),
  7: t('DetailedConfig.roleOptions.PITCHER'),
  8: t('DetailedConfig.roleOptions.FINANCE')
};

// 权限名称映射（仅包含四个）
const permissionIdOptions = {
  1: t('DetailedConfig.permissionIdOptions.PROFIT_LEVEL_1'),
  2: t('DetailedConfig.permissionIdOptions.PROFIT_LEVEL_2'),
  3: t('DetailedConfig.permissionIdOptions.PROFIT_LEVEL_3')
};

// 表格数据
const tableData = ref([]);

// 加载状态
const loading = ref(false);

// 当前编辑的行索引
const editingRow = ref(null);

// 原始行数据，用于取消编辑时恢复
const originalRow = ref(null);

// 查询函数
const handleQuery = async () => {
  // 构建查询参数
  const params = {
    userId: searchForm.userId,
    username: searchForm.username,
    fullname: searchForm.fullname,
    roleId: searchForm.roleId,
    permissionId: searchForm.permissionId,
    isEnabled: searchForm.isEnabled
  };

  loading.value = true;
  try {
    const response = await searchUserPermissions(params);
    if (response.data.success) {
      tableData.value = response.data.data.content;
    } else {
      ElMessage.error(response.message || t('DetailedConfig.queryFailed'));
    }
  } catch (error) {
    ElMessage.error(t('DetailedConfig.queryFailed'));
  } finally {
    loading.value = false;
  }
};

// 重置函数
const handleReset = () => {
  searchForm.userId = '';
  searchForm.username = '';
  searchForm.fullname = '';
  searchForm.roleId = '';
  searchForm.permissionId = '';
  searchForm.isEnabled = null;
};

// 编辑函数
const handleEdit = (index) => {
  editingRow.value = index;
  // 深拷贝当前行数据以便取消时恢复
  originalRow.value = { ...tableData.value[index] };
};

// 保存函数
const handleSave = async (row, index) => {
  // 在提交时验证 rate1 和 rate2
  if (!validateRateField(row, 'rate1') || !validateRateField(row, 'rate2')) {
    return;
  }

  try {
    const response = await updateuserpermission(row);
    if (response.data.success) {
      ElMessage.success(t('DetailedConfig.updateSuccess'));
      editingRow.value = null;
    } else {
      ElMessage.error(response.message || t('DetailedConfig.updateFailed'));
    }
  } catch (error) {
    ElMessage.error(t('DetailedConfig.updateFailed'));
  }
};

const formatDate = (field) => {
  if (tableData.value[editingRow.value][field]) {
    const date = new Date(tableData.value[editingRow.value][field]);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    tableData.value[editingRow.value][field] = `${year}-${month}-${day}`;
  }
};

// 取消函数
const handleCancel = () => {
  if (editingRow.value !== null && originalRow.value) {
    tableData.value[editingRow.value] = originalRow.value;
    editingRow.value = null;
  }
};

// 验证 rate1 和 rate2 的输入范围
const validateRateField = (row, field) => {
  const value = parseFloat(row[field]);

  if (isNaN(value) || value < 0 || value > 1) {
    ElMessage.error(t('DetailedConfig.rateValidationError')); // 提示用户输入不合法
    return false;
  }
  return true;
};

// 获取角色名称的显示名称，若无对应翻译则返回原值
const getRoleName = (value) => {
  return roleMaps[value] || value;
};

// 获取权限名称的显示名称，若无对应翻译则返回原值
const getPermissionId = (value) => {
  return permissionIdOptions[value] || value;
};

// 初始化查询
onMounted(() => {
  handleQuery();
});
</script>

<style scoped>
.detailed-config {
  text-align: center;
  padding: 20px;
  background-color: #f5f7fa;
}

.filter-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.rate1-range {
  display: flex;
  align-items: center;
}

.rate1-range .separator {
  margin: 0 8px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  align-items: top;
}

.el-table th, .el-table td {
  text-align: center;
}

.el-button--text {
  padding: 0;
}

.el-select .el-input__inner {
  min-width: 200px; /* 增加宽度确保文字可见 */
}

.el-form-item__label {
  width: 120px; /* 调整标签宽度 */
}

@media (max-width: 768px) {
  .el-form-item__label {
    width: 100px;
  }
  .el-select .el-input__inner {
    min-width: 150px;
  }
}
</style>
