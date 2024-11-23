<template>
  <div class="view-applications">
    <!-- 搜索表单 -->
    <el-form :model="form" label-width="120px" :inline="false" class="search-form">
      <el-row :gutter="20">
        <!-- 学员姓名 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewApplications.fullname')">
            <el-input v-model="form.fullname" :placeholder="$t('ViewApplications.placeholders.enterFullname')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 学员账号 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewApplications.username')">
            <el-input v-model="form.username" :placeholder="$t('ViewApplications.placeholders.enterUsername')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 学员邀请码 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewApplications.invitationCode')">
            <el-input v-model="form.invitationCode" :placeholder="$t('ViewApplications.placeholders.enterInvitationCode')"></el-input>
          </el-form-item>
        </el-col>

        <!-- Tiktok账号 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewApplications.tiktokAccount')">
            <el-input v-model="form.tiktokAccount" :placeholder="$t('ViewApplications.placeholders.enterTiktokAccount')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 邀请人姓名 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewApplications.inviterFullname')">
            <el-input v-model="form.inviterFullname" :placeholder="$t('ViewApplications.placeholders.enterInviterFullname')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 邀请人账号 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewApplications.inviterName')">
            <el-input v-model="form.inviterName" :placeholder="$t('ViewApplications.placeholders.enterInviterName')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 邀请人邀请码 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewApplications.inviterCode')">
            <el-input v-model="form.invitationCode" :placeholder="$t('ViewApplications.placeholders.enterInviterCode')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 申请单状态 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewApplications.processStatuses')">
            <el-select v-model="form.processStatuses" multiple :placeholder="$t('ViewApplications.placeholders.selectProcessStatuses')" clearable>
              <el-option
                v-for="(label, key) in processStatusOptions"
                :key="key"
                :label="label"
                :value="parseInt(key, 10)"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 管理人姓名 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewApplications.managerFullname')">
            <el-input v-model="form.managerFullname" :placeholder="$t('ViewApplications.placeholders.enterManagerFullname')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 管理人账号 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewApplications.managerName')">
            <el-input v-model="form.managerName" :placeholder="$t('ViewApplications.placeholders.enterManagerName')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 权益创建时间 -->
        <el-col :span="12">
          <el-form-item label="生效日期">
            <el-date-picker
              v-model="form.effectiveAfter"
              type="date"
              placeholder="开始日期"
              style="margin-right: 10px;"
            ></el-date-picker>
            <el-date-picker
              v-model="form.effectiveBefore"
              type="date"
              placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <!-- 地区 -->
        <!-- <el-col :span="6">
          <el-form-item :label="$t('ViewApplications.regionName')">
            <el-input v-model="form.regionName" :placeholder="$t('ViewApplications.placeholders.enterRegionName')"></el-input>
          </el-form-item>
        </el-col> -->

        <!-- 币种 -->
        <!-- <el-col :span="6">
          <el-form-item :label="$t('ViewApplications.currency')">
            <el-input v-model="form.currency" :placeholder="$t('ViewApplications.placeholders.enterCurrency')"></el-input>
          </el-form-item>
        </el-col> -->
      </el-row>

      <el-row :gutter="20">
        <!-- 项目等级 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewApplications.roleId')">
            <el-select v-model="form.roleId" :placeholder="$t('ViewApplications.placeholders.selectRole')" clearable>
              <el-option
                v-for="(label, key) in roleOptions"
                :key="key"
                :label="label"
                :value="parseInt(key, 10)"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 支付方式 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewApplications.paymentMethod')">
            <el-select v-model="form.paymentMethod" :placeholder="$t('ViewApplications.placeholders.selectPaymentMethod')" clearable>
              <el-option
                v-for="(label, key) in paymentOptions"
                :key="key"
                :label="label"
                :value="label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 申请单创建时间 -->
        <el-col :span="12">
          <el-form-item :label="$t('ViewApplications.createdTimeRange')">
            <el-date-picker
              v-model="form.createdAfter"
              type="date"
              placeholder="开始日期"
              style="margin-right: 10px;"
            ></el-date-picker>
            <el-date-picker
              v-model="form.createdBefore"
              type="date"
              placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="6">
        </el-col>
        <el-col :span="6">
        </el-col>
        <el-col :span="6">
        </el-col>
        <!-- 操作按钮 -->
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="searchTodoApplications">{{ $t('ViewApplications.query') }}</el-button>
            <el-button @click="resetForm">{{ $t('ViewApplications.reset') }}</el-button>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>

    <!-- 应用表格 -->
    <div class="table-container">
      <el-table
        :data="applications"
        :default-sort="{ prop: 'processId', order: 'ascending' }"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        height="600px"
        :border="true"
        stripe
        scrollbar-always-on
        v-loading="loading"
        :header-cell-style="{ background: '#f5f7fa', 'font-weight': 'bold' }"
      >
        <el-table-column prop="processStatus" fixed :label="$t('ViewApplications.table.processStatus')">
          <template #default="scope">
            {{ processStatusOptions[scope.row.processStatus] }}
          </template>
        </el-table-column>
        <el-table-column prop="fullname" fixed :label="$t('ViewApplications.table.fullname')"></el-table-column>
        <el-table-column prop="managerFullname" :label="$t('ViewApplications.table.managerFullname')"></el-table-column>
        <el-table-column prop="inviterFullname" :label="$t('ViewApplications.table.inviterName')">
          <template #default="scope">
            {{ scope.row.inviterFullname || scope.row.inviterName }}
          </template>
        </el-table-column>
        <el-table-column prop="regionName" :label="$t('ViewApplications.table.regionName')"></el-table-column>
        <el-table-column prop="currency" :label="$t('ViewApplications.table.currency')"></el-table-column>
        <el-table-column prop="projectName" :label="$t('ViewApplications.table.projectName')"></el-table-column>
        <el-table-column prop="projectAmount" :label="$t('ViewApplications.table.projectAmount')">
          <template #default="scope">
            {{ formatCurrency(scope.row.projectAmount, scope.row.currency) }}
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" :label="$t('ViewApplications.table.paymentMethod')"></el-table-column>
        <el-table-column prop="paidStr" :label="$t('ViewApplications.table.paidStr')">
          <template #default="scope">
            <span v-html = "scope.row.paidStr"></span>
          </template>
        </el-table-column>
        <el-table-column prop="rateA" :label="$t('ViewApplications.table.rateA')"></el-table-column>
        <el-table-column prop="rateB" :label="$t('ViewApplications.table.rateB')"></el-table-column>
        <el-table-column prop="startDate" :label="$t('ViewApplications.table.startDate')"></el-table-column>
        <el-table-column prop="createdAt" :label="$t('ViewApplications.table.createdAt')">
          <template #default="scope">
            {{ scope.row.createdAt }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('ViewApplications.table.actions')"
          width="120"
          fixed="right"
        >
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewApplication(scope.row.processId)">
              {{ $t('ViewApplications.table.view') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <ViewApplicationDrawer
        ref="drawerRef"
        @update="handleApplicationUpdate"
      />
    </div>

    <!-- 分页 -->
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
    >
    </el-pagination>
  </div>
</template>

<script>
import { ref, reactive, onMounted, shallowRef, effect } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import ViewApplicationDrawer from '@/components/ViewApplicationDrawer.vue';
import { searchTodoApplications } from '@/api/application';

export default {
  name: 'ViewApplications',
  components: { ViewApplicationDrawer },
  setup() {
    const { t } = useI18n();

    // Form data
    const form = reactive({
      fullname: '',
      username: '',
      invitationCode: '',
      tiktokAccount: '',
      inviterFullname: '',
      inviterName: '',
      inviterCode: '',
      processStatuses: [],
      managerFullname: '',
      managerName: '',
      effectiveAfter: null,
      effectiveBefore: null,
      roleId: null,
      paymentMethod: '',
      createdAfter: null,
      createdBefore: null
    });

    // Process Status options
    const processStatusOptions = {
      '5': t('ViewApplications.status.5'),
      '1': t('ViewApplications.status.1'),
      '2': t('ViewApplications.status.2'),
      '3': t('ViewApplications.status.3'),
      '4': t('ViewApplications.status.4'),
      '99': t('ViewApplications.status.99'),
      '6': t('ViewApplications.status.6'),
      '7': t('ViewApplications.status.7'),
      '0': t('ViewApplications.status.0')
    };

    // Role options
    const roleOptions = {
      '4': '高阶',
      '5': '中阶',
      '6': '初阶'
    };

    // Payment options
    const paymentOptions = [
      '全额支付',
      '分期付款'
    ];

    // Table data
    const applications = ref([]);

    // Loading state
    const loading = ref(false);

    // Pagination
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalElements = ref(0);
    const totalPages = ref(1);

    const drawerRef = shallowRef(null);

    // Fetch applications data
    const fetchApplications = async (payload) => {
      loading.value = true;
      try {
        const response = await searchTodoApplications(payload);
        if (response.data.success) {
          applications.value = response.data.data.content;
          totalElements.value = response.data.data.totalElements;
          totalPages.value = response.data.data.totalPages;
        } else {
          ElMessage.error(t('ViewApplications.messages.fetchError'));
        }
      } catch (error) {
        console.error(error);
        ElMessage.error(t('ViewApplications.messages.fetchError'));
      } finally {
        loading.value = false;
      }
    };

    // Search applications
    const searchTodoApplicationsHandler = () => {
      currentPage.value = 1;
      const payload = {
        fullname: form.fullname || null,
        username: form.username || null,
        invitationCode: form.invitationCode || null,
        tiktokAccount: form.tiktokAccount || null,
        inviterFullname: form.inviterFullname || null,
        inviterName: form.inviterName || null,
        inviterCode: form.inviterCode || null,
        processStatuses: form.processStatuses,
        managerFullname: form.managerFullname || null,
        managerName: form.managerName || null,
        effectiveAfter: form.effectiveAfter,
        effectiveBefore: form.effectiveBefore,
        roleId: form.roleId,
        paymentMethod: form.paymentMethod || null,
        createdAfter: form.createdAfter,
        createdBefore: form.createdBefore,
        page: currentPage.value - 1,
        size: pageSize.value
      };
      fetchApplications(payload);
    };

    // Reset form
    const resetForm = () => {
      form.fullname = '';
      form.username = '';
      form.invitationCode = '';
      form.tiktokAccount = '';
      form.inviterFullname = '';
      form.inviterName = '';
      form.inviterCode = '';
      form.processStatuses = [];
      form.managerFullname = '';
      form.managerName = '';
      form.effectiveAfter = null;
      form.effectiveBefore = null;
      form.roleId = null;
      form.paymentMethod = '';
      form.createdAfter = null;
      form.createdBefore = null;
      searchTodoApplicationsHandler();
    };

    // 处理更新
    const handleApplicationUpdate = (updatedApplication) => {
      const index = applications.value.findIndex(
        (app) => app.processId === updatedApplication.processId
      );
      if (index !== -1) {
        // 更新对应的行
        applications.value[index] = { ...applications.value[index], ...updatedApplication };
      }
    };

    // View application details
    const viewApplication = (processId) => {
      if (drawerRef.value) {
        drawerRef.value.showDrawer(processId);
      } else {
        // Optional: Handle the case where the dialog is not ready
        console.error('Dialog component is not ready.');
      }
    };

    // Format currency based on currency type
    const formatCurrency = (value, currency) => {
      if (value === null || value === undefined) {
        return '-';
      }
      return `${parseFloat(value.toFixed(2))} ${currency}`;
    };

    const tableRowClassName = ({ row, rowIndex }) => {
      switch (row.processStatus) {
        case 0:
          return 'canceled';
        case 1:
          return 'editing';
        case 2:
          return 'financial';
        case 3:
          return 'requestlink';
        case 4:
          return 'approving';
        case 5:
          return 'paying';
        case 6:
          return 'finished';
        case 7:
          return 'archived';
        case 99:
          return 'updating';
      }
    };

    // Handle page change
    const handlePageChange = (page) => {
      currentPage.value = page;
      const payload = {
        fullname: form.fullname || null,
        username: form.username || null,
        invitationCode: form.invitationCode || null,
        tiktokAccount: form.tiktokAccount || null,
        inviterFullname: form.inviterFullname || null,
        inviterName: form.inviterName || null,
        inviterCode: form.inviterCode || null,
        processStatuses: form.processStatuses,
        managerFullname: form.managerFullname || null,
        managerName: form.managerName || null,
        effectiveAfter: form.effectiveAfter,
        effectiveBefore: form.effectiveBefore,
        roleId: form.roleId,
        paymentMethod: form.paymentMethod || null,
        createdAfter: form.createdAfter,
        createdBefore: form.createdBefore,
        page: page - 1,
        size: pageSize.value
      };
      fetchApplications(payload);
    };

    /**
     * 处理分页大小变化
     * @param {Number} newSize - 新的分页大小
     */
     const handleSizeChange = (newSize) => {
      pageSize.value = newSize;
      currentPage.value = 1; // 重置为第一页
      handlePageChange(1);
    };

    const initialize = () => {
      searchTodoApplicationsHandler();
    };

    onMounted(() => {
      initialize();
    });

    return {
      t,
      form,
      processStatusOptions,
      roleOptions,
      paymentOptions,
      applications,
      loading,
      searchTodoApplications: searchTodoApplicationsHandler,
      handleApplicationUpdate,
      resetForm,
      viewApplication,
      formatCurrency,
      tableRowClassName,
      currentPage,
      pageSize,
      totalElements,
      totalPages,
      handlePageChange,
      handleSizeChange,
      drawerRef
    };
  }
};
</script>

<style scoped>
.view-applications {
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
}

/* Adjust button group layout */
.button-group {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

/* Row colors based on processStatus */
.row-finished {
  background-color: rgba(103, 194, 58, 0.1); /* Light green */
}

.row-submitted {
  background-color: rgba(144, 147, 153, 0.1); /* Light gray */
}

.row-editing {
  background-color: rgba(230, 162, 60, 0.1); /* Light orange */
}

/* Ensure table container supports horizontal scrolling */
.table-container {
  overflow-x: auto;
}

/* Style the scrollbar */
.table-container::-webkit-scrollbar {
  height: 12px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.table-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 6px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Ensure fixed column styles */
.el-table .cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-table .canceled {
  --el-table-tr-bg-color: #9E9E9E;
}

.el-table .editing {
  --el-table-tr-bg-color: #FFB74D;
}

.el-table .financial {
  --el-table-tr-bg-color: #64B5F6;
}

.el-table .requestlink {
  --el-table-tr-bg-color: #81C784;
}

.el-table .approving {
  --el-table-tr-bg-color: #4DB6AC;
}

.el-table .paying {
  --el-table-tr-bg-color: #FFD54F;
}

.el-table .finished {
  --el-table-tr-bg-color: #66BB6A;
}

.el-table .archived {
  --el-table-tr-bg-color: #BDBDBD;
}

.el-table .updating {
  --el-table-tr-bg-color: #FF8A65;
}

</style>
