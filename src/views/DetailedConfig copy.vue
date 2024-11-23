<template>
  <div class="detailed-config">
    <el-card>
      <!-- 筛选表单 -->
      <el-form :model="filters" layout="inline" class="filter-form" @submit.native.prevent="handleSearch">
        <!-- 第一行筛选字段 -->
        <el-row :gutter="20" style="width: 100%;">
          <el-col :span="6">
            <el-form-item :label="t('DetailedConfig.userId')" prop="userId">
              <el-input v-model.number="filters.userId" placeholder="Enter User ID" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item :label="t('DetailedConfig.username')" prop="username">
              <el-input v-model.number="filters.username" placeholder="Enter User ID" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item :label="t('DetailedConfig.permissionName')" prop="permissionName">
              <el-select
                v-model="filters.permissionName"
                filterable
                allow-create
                clearable
                placeholder="Select or input Permission Name"
              >
                <el-option
                  v-for="item in permissionOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('DetailedConfig.classify')" prop="classify">
              <el-select v-model="filters.classify" placeholder="Select Classify" clearable>
                <el-option label="FRONTEND" value="FRONTEND"></el-option>
                <el-option label="COMPLEX" value="COMPLEX"></el-option>
                <el-option label="BACKEND" value="BACKEND"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行筛选字段 -->
        <el-row :gutter="20" style="width: 100%;">
          <el-col :span="8">
            <el-form-item :label="t('DetailedConfig.rate')" prop="rate">
              <el-input-number v-model="filters.rate" :min="0" :max="100" label="Rate" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('DetailedConfig.isEnabled')" prop="isEnabled">
              <el-select v-model="filters.isEnabled" placeholder="Select Status" clearable>
                <el-option label="Enabled" :value="true"></el-option>
                <el-option label="Disabled" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="display: flex; align-items: center;">
            <el-form-item>
              <el-button type="primary" @click="handleSearch">{{ t('DetailedConfig.search') }}</el-button>
              <el-button @click="handleReset" style="margin-left: 10px;">{{ t('DetailedConfig.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-divider></el-divider>

      <!-- 权限表格 -->
      <el-table
        :data="permissions"
        style="width: 100%"
        height="600"
        v-loading="loading"
        :loading-text="t('DetailedConfig.loading')"
        :border
        stripe
      >
        <el-table-column prop="userId" :label="t('DetailedConfig.userId')" width="100" />
        <el-table-column prop="permissionName" :label="t('DetailedConfig.permissionName')" width="200" />
        <el-table-column prop="classify" :label="t('DetailedConfig.classify')" width="150" />
        
        <el-table-column :label="t('DetailedConfig.rate')" width="150">
          <template #default="scope">
            <div v-if="!scope.row.isEditing">
              {{ scope.row.rate }}
            </div>
            <div v-else>
              <el-input-number v-model="scope.row.rate" :min="0" :max="100" size="small" style="width: 100%;" />
            </div>
          </template>
        </el-table-column>
        
        <el-table-column :label="t('DetailedConfig.isEnabled')" width="150">
          <template #default="scope">
            <div v-if="!scope.row.isEditing">
              <el-switch v-model="scope.row.isEnabled" disabled active-text="Enabled" inactive-text="Disabled" />
            </div>
            <div v-else>
              <el-switch v-model="scope.row.isEnabled" active-text="Enabled" inactive-text="Disabled" />
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="description" :label="t('DetailedConfig.description')" width="250" />
        
        <el-table-column :label="t('DetailedConfig.actions')" width="180">
          <template #default="scope">
            <el-button
              v-if="!scope.row.isEditing"
              type="primary"
              size="mini"
              @click="editPermission(scope.row)"
            >
              {{ t('DetailedConfig.edit') }}
            </el-button>
            <div v-else class="action-buttons">
              <el-button
                type="success"
                size="mini"
                @click="savePermission(scope.row)"
              >
                {{ t('DetailedConfig.save') }}
              </el-button>
              <el-button
                type="warning"
                size="mini"
                @click="cancelEdit(scope.row)"
                style="margin-left: 5px;"
              >
                {{ t('DetailedConfig.cancel') }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页控件 -->
      <el-pagination
        style="margin-top: 20px; text-align: right;"
        background
        layout="prev, pager, next, sizes, total"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalElements"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { searchUserPermissions, updateUserPermission } from '@/api/utils';

// 国际化
const { t } = useI18n();

// 响应式数据
const filters = ref({
  userId: null,
  permissionName: '',
  classify: '',
  rate: null,
  isEnabled: null,
});

const permissions = ref([]);
const loading = ref(false);

// 分页数据
const currentPage = ref(1);
const pageSize = ref(10);
const totalElements = ref(0);

// 编辑状态管理
const editingRows = ref({});

// Permission Name 预设选项
const permissionOptions = ref([
  'PROFIT_LEVEL_1',
  'PROFIT_LEVEL_2',
  'PROFIT_LEVEL_3',
]);

// 获取权限数据
const fetchPermissions = async () => {
  loading.value = true;
  try {
    const response = await searchUserPermissions({
      userId: filters.value.userId,
      permissionName: filters.value.permissionName,
      classify: filters.value.classify,
      rate: filters.value.rate,
      isEnabled: filters.value.isEnabled,
      description: '', // 可根据需要添加描述筛选
    }, currentPage.value - 1, pageSize.value);
    
    if (response.data && response.data.success) {
      permissions.value = response.data.data.content.map(permission => ({
        ...permission,
        isEditing: false,
        original: { rate: permission.rate, isEnabled: permission.isEnabled },
      }));
      totalElements.value = response.data.data.totalElements;
    } else {
      ElMessage.error(response.data.message || t('DetailedConfig.fetchError'));
    }
  } catch (error) {
    ElMessage.error(t('DetailedConfig.fetchError'));
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  fetchPermissions();
};

// 重置
const handleReset = () => {
  filters.value = {
    userId: null,
    permissionName: '',
    classify: '',
    rate: null,
    isEnabled: null,
  };
  currentPage.value = 1;
  fetchPermissions();
};

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1;
  fetchPermissions();
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  fetchPermissions();
};

// 编辑权限
const editPermission = (row) => {
  row.isEditing = true;
};

// 保存权限
const savePermission = async (row) => {
  loading.value = true;
  try {
    const updatedPermission = {
      userId: row.userId,
      permissionName: row.permissionName,
      classify: row.classify,
      rate: row.rate,
      isEnabled: row.isEnabled,
      description: row.description,
    };
    const response = await updateUserPermission(updatedPermission);
    if (response.success) {
      row.isEditing = false;
      ElMessage.success(t('DetailedConfig.updateSuccess'));
      // 更新原始值
      row.original.rate = row.rate;
      row.original.isEnabled = row.isEnabled;
    } else {
      ElMessage.error(response.message || t('DetailedConfig.updateError'));
    }
  } catch (error) {
    ElMessage.error(t('DetailedConfig.updateError'));
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 取消编辑
const cancelEdit = (row) => {
  row.rate = row.original.rate;
  row.isEnabled = row.original.isEnabled;
  row.isEditing = false;
};

// 初始化数据
onMounted(() => {
  fetchPermissions();
});
</script>

<style scoped>
.detailed-config {
  padding: 20px;
}

.el-card {
  width: 100%;
}

.filter-form {
  margin-bottom: 20px;
}

.el-table {
  margin-top: 20px;
}

.el-pagination {
  margin-top: 20px;
}

.action-buttons {
  display: flex;
  align-items: center;
}
</style>
