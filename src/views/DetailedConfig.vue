<template>
  <div class="detailed-config">
    <el-form :model="searchForm" class="filter-form" @submit.prevent>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="姓名" prop="fullname">
            <el-input v-model="searchForm.fullname" placeholder="输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="账号" prop="username">
            <el-input v-model="searchForm.username" placeholder="输入账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="平台邀请码" prop="invitationCode">
            <el-input v-model="searchForm.invitationCode" placeholder="输入邀请码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="searchForm.roleId" placeholder="选择角色" clearable style="width: 100%;">
              <el-option
                v-for="(label, value) in roleOptions"
                :key="value"
                :label="label"
                :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="邀请人姓名" prop="inviterName">
            <el-input v-model="searchForm.inviterFullname" placeholder="输入邀请人姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="邀请人账号" prop="inviterFullname">
            <el-input v-model="searchForm.inviterName" placeholder="输入邀请人账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="邀请人邀请码" prop="inviterCode">
            <el-input v-model="searchForm.inviterCode" placeholder="输入邀请码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="权限" prop="permissionId">
            <el-select v-model="searchForm.permissionId" placeholder="选择权限" clearable style="width: 100%;">
              <el-option
                v-for="(label, value) in permissionOptions"
                :key="value"
                :label="label"
                :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 管理人 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="管理人姓名" prop="managerFullname">
            <el-input v-model="searchForm.managerFullname" placeholder="输入管理人姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="管理人账号" prop="managerName">
            <el-input v-model="searchForm.managerName" placeholder="输入管理人账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否启用" prop="status">
            <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 100%;">
              <el-option
                v-for="(label, value) in yesNoOptions"
                :key="value"
                :label="label"
                :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否当前" prop="isCurrent">
            <el-select v-model="searchForm.isCurrent" placeholder="请选择" clearable style="width: 100%;">
              <el-option
                v-for="(label, value) in yesNoOptions"
                :key="value"
                :label="label"
                :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="开始日期" prop="startDateAfter">
            <el-date-picker
              v-model="searchForm.startDateAfter"
              type="date"
              placeholder="选择开始日期"
              style="width: 50%;"
            />
            <el-date-picker
              v-model="searchForm.startDateBefore"
              type="date"
              placeholder="选择开始日期"
              style="width: 50%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束日期" prop="endDateBefore">
            <el-date-picker
              v-model="searchForm.endDateAfter"
              type="date"
              placeholder="选择结束日期"
              style="width: 50%;"
            />
            <el-date-picker
              v-model="searchForm.endDateBefore"
              type="date"
              placeholder="选择结束日期"
              style="width: 50%;"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item :label="$t('DetailedConfig.userId')" prop="userId">
            <el-input v-model="searchForm.userId" placeholder="请输入用户ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6"></el-col>
        <el-col :span="6"></el-col>
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
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column
        prop="permissionId"
        :label="$t('DetailedConfig.permissionId')"
        >
        <template #default="scope">
          {{ scope.row.permissionName }}
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
        prop="status"
        label="是否启用"
        >
        <template #default="scope">
          <el-switch v-model="scope.row.status" :disabled="editingRow !== scope.$index"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="startDate"
        label="开始日期"
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
        label="结束日期"
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
              取消
            </el-button>
            <el-button type="primary" size="small" @click="handleSave(scope.row, scope.$index)">
              保存
            </el-button>
          </div>
          <div v-else>
            <el-button type="primary" size="small" @click="handleEdit(scope.$index)">
              编辑
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      :current-page="currentPage"
      :page-size="pageSize"
      show-size-picker
      show-total
      :total="totalElements"
      layout="total, prev, pager, next, jumper, sizes"
      style="margin-top: 20px; text-align: right;"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { searchRolePermissions, updateRolePermission } from '@/api/utils';

// 国际化
const { t } = useI18n();

// 筛选表单数据
const searchForm = reactive({
  username: '',
  fullname: '',
  managerName: '',
  managerFullname: '',
  inviterName: '',
  inviterFullname: '',
  roleId: null,
  permissionId: null,
  status: null,
  isCurrent: null,
  invitationCode: '',
  inviterCode: '',
  startDateAfter: '',
  startDateBefore: '',
  endDateAfter: '',
  endDateBefore: ''
});

// 是否选项映射
const yesNoOptions = {
  true: "是",
  false: "否"
};

const roleOptions = {
  4: "高阶学员",
  5: "中阶学员",
  6: "初阶学员"
};

const permissionOptions = {
  1: "一级抽佣",
  2: "二级抽佣",
  3: "三级抽佣"
};

// 表格数据
const tableData = ref([]);

// 加载状态
const loading = ref(false);

// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const totalElements = ref(0);
const totalPages = ref(1);

// 当前编辑的行索引
const editingRow = ref(null);

// 原始行数据，用于取消编辑时恢复
const originalRow = ref(null);

// 查询函数
const handleQuery = async () => {
  loading.value = true;
  const payload = {
    ...searchForm,
    page: currentPage.value - 1,
    size: pageSize.value
  };
  try {
    const response = await searchRolePermissions(payload);
    if (response.data.success) {
      tableData.value = response.data.data.content;
      totalElements.value = response.data.data.totalElements;
      totalPages.value = response.data.data.totalPages;
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
  searchForm.username = '';
  searchForm.fullname = '';
  searchForm.managerName = '';
  searchForm.managerFullname = '';
  searchForm.inviterName = '';
  searchForm.inviterFullname = '';
  searchForm.roleId = null;
  searchForm.permissionId = null;
  searchForm.status = null;
  searchForm.isCurrent = null;
  searchForm.invitationCode = '';
  searchForm.inviterCode = '';
  searchForm.startDateAfter = '';
  searchForm.startDateBefore = '';
  searchForm.endDateAfter = '';
  searchForm.endDateBefore = '';
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
    const response = await updateRolePermission(row);
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
    ElMessage.error("请输入 0 到 1 之间的数字");
    return false;
  }
  return true;
};

/**
 * 处理页码变化
 * @param {Number} page - 当前页码
 */
const handlePageChange = async (page) => {
  currentPage.value = page;
  const payload = {
    ...searchForm,
    page: currentPage.value - 1,
    size: pageSize.value
  };
  await handleQuery(payload);
};

/**
 * 处理分页大小变化
 * @param {Number} newSize - 新的分页大小
 */
const handleSizeChange = async (newSize) => {
  pageSize.value = newSize;
  const payload = {
    ...searchForm,
    page: 0,
    size: pageSize.value
  };
  await handleQuery(payload);
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
