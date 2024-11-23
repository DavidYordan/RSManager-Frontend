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

        <!-- 邀请人账号 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewApplications.inviterName')">
            <el-input v-model="form.inviterName" :placeholder="$t('ViewApplications.placeholders.enterInviterName')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 申请单状态 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewApplications.processStatus')">
            <el-select v-model="form.processStatus" :placeholder="$t('ViewApplications.placeholders.selectProcessStatus')" clearable>
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

        <!-- 创建时间 -->
        <!-- <el-col :span="6">
          <el-form-item :label="$t('ViewApplications.createdAt')">
            <el-date-picker
              v-model="form.createdAfter"
              type="date"
              :placeholder="$t('ViewApplications.placeholders.selectCreatedAfter')"
              style="width: 100%"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item>
            <el-date-picker
              v-model="form.createdBefore"
              type="date"
              :placeholder="$t('ViewApplications.placeholders.selectCreatedBefore')"
              style="width: 100%"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col> -->
        <el-col :span="6"></el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="searchApplications">{{ $t('ViewApplications.query') }}</el-button>
            <el-button @click="resetForm">{{ $t('ViewApplications.reset') }}</el-button>
          </el-form-item>
        </el-col>

      </el-row>

      <!-- <el-row :gutter="20" justify="end">
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="searchApplications">{{ $t('ViewApplications.query') }}</el-button>
            <el-button @click="resetForm">{{ $t('ViewApplications.reset') }}</el-button>
          </el-form-item>
        </el-col>
      </el-row> -->
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
        <el-table-column prop="processId" :label="$t('ViewApplications.table.processId')" width="100"></el-table-column>
        <el-table-column prop="fullname" fixed :label="$t('ViewApplications.table.fullname')" width="150"></el-table-column>
        <el-table-column prop="username" :label="$t('ViewApplications.table.username')" width="150"></el-table-column>
        <el-table-column prop="inviterName" :label="$t('ViewApplications.table.inviterName')" width="150"></el-table-column>
        <el-table-column prop="regionName" :label="$t('ViewApplications.table.regionName')" width="120"></el-table-column>
        <el-table-column prop="currency" :label="$t('ViewApplications.table.currency')" width="100"></el-table-column>
        <el-table-column prop="projectName" :label="$t('ViewApplications.table.projectName')" width="150"></el-table-column>
        <el-table-column prop="projectAmount" :label="$t('ViewApplications.table.projectAmount')" width="150">
          <template #default="scope">
            {{ formatCurrency(scope.row.projectAmount, scope.row.currency) }}
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" :label="$t('ViewApplications.table.paymentMethod')" width="150"></el-table-column>
        <el-table-column prop="paidAmount" :label="$t('ViewApplications.table.paidAmount')" width="150">
          <template #default="scope">
            {{ formatCurrency(scope.row.paidAmount, scope.row.currency) }}
          </template>
        </el-table-column>
        <el-table-column prop="rateA" :label="$t('ViewApplications.table.rateA')" width="150"></el-table-column>
        <el-table-column prop="rateB" :label="$t('ViewApplications.table.rateB')" width="150"></el-table-column>
        <el-table-column prop="processStatus" :label="$t('ViewApplications.table.processStatus')" width="150">
          <template #default="scope">
            {{ processStatusOptions[scope.row.processStatus] }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" :label="$t('ViewApplications.table.createdAt')" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
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
      <ViewApplicationDrawer ref="ViewApplicationDrawer" />
    </div>

    <!-- 分页 -->
    <el-pagination
      v-if="totalPages > 1"
      @current-change="handlePageChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next, jumper"
      :total="totalElements"
      style="margin-top: 20px; text-align: right;"
    >
    </el-pagination>
  </div>
</template>

<script>
import { ref, reactive, onMounted, shallowRef } from 'vue';
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
      inviterName: '',
      processStatus: null,
      roleId: null,
      paymentMethod: '',
      createdAfter: null,
      createdBefore: null
    });

    // Process Status options
    const processStatusOptions = {
      '-1': t('ViewApplications.status.-1'),
      '1': t('ViewApplications.status.1'),
      '2': t('ViewApplications.status.2'),
      '3': t('ViewApplications.status.3'),
      '4': t('ViewApplications.status.4'),
      '5': t('ViewApplications.status.5'),
      '6': t('ViewApplications.status.6'),
      '7': t('ViewApplications.status.7')
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

    const ViewApplicationDrawer = shallowRef(null);

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
    const searchApplicationsHandler = () => {
      currentPage.value = 1;
      const payload = {
        fullname: form.fullname || null,
        username: form.username || null,
        inviterName: form.inviterName || null,
        processStatus: form.processStatus,
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
      form.inviterName = '';
      form.processStatus = null;
      form.roleId = null;
      form.paymentMethod = '';
      form.createdAfter = null;
      form.createdBefore = null;
      ElMessage.success(t('ViewApplications.messages.resetSuccess'));
      searchApplicationsHandler();
    };

    // View application details
    const viewApplication = (processId) => {
      if (ViewApplicationDrawer.value) {
        ViewApplicationDrawer.value.showDrawer(processId);
      } else {
        // Optional: Handle the case where the dialog is not ready
        console.error('Dialog component is not ready.');
      }
    };

    // Format currency based on currency type
    const formatCurrency = (value, currency) => {
      let locale = 'en-US';
      let currencyCode = 'USD';

      // 根据 currency 字段调整 locale 和 currencyCode
      switch (currency) {
        case '台币':
          locale = 'zh-TW';
          currencyCode = 'TWD';
          break;
        // 添加其他币种的处理
        default:
          locale = 'en-US';
          currencyCode = 'USD';
      }

      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode
      }).format(value);
    };

    // Format date
    const formatDate = (value) => {
      const date = new Date(value);
      return date.toLocaleString();
    };

    // Set row class based on processStatus
    const tableRowClassName = ({ row, rowIndex }) => {
      switch (row.processStatus) {
        case 1:
          return 'row-finished';
        case 2:
          return 'row-submitted';
        case 3:
          return 'row-editing';
        // 添加其他状态的样式
        default:
          return '';
      }
    };

    // Handle page change
    const handlePageChange = (page) => {
      currentPage.value = page;
      const payload = {
        fullname: form.fullname || null,
        username: form.username || null,
        inviterName: form.inviterName || null,
        processStatus: form.processStatus,
        roleId: form.roleId,
        paymentMethod: form.paymentMethod || null,
        createdAfter: form.createdAfter,
        createdBefore: form.createdBefore,
        page: currentPage.value - 1,
        size: pageSize.value
      };
      fetchApplications(payload);
    };

    onMounted(() => {
      searchApplicationsHandler();
    });

    return {
      t,
      form,
      processStatusOptions,
      roleOptions,
      paymentOptions,
      applications,
      loading,
      searchApplications: searchApplicationsHandler,
      resetForm,
      viewApplication,
      formatCurrency,
      formatDate,
      tableRowClassName,
      currentPage,
      pageSize,
      totalElements,
      totalPages,
      handlePageChange,
      ViewApplicationDrawer
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
</style>
