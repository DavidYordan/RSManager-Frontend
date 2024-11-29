<template>
  <div class="view-payment-account">
    <!-- 搜索表单 -->
    <el-form :model="form" label-width="120px" :inline="false" class="search-form">
      <!-- 第一行搜索项 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="账户名称">
            <el-input v-model="form.accountName" placeholder="输入账户名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="账户号码">
            <el-input v-model="form.accountNumber" placeholder="输入用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="类型">
            <el-input v-model="form.accountType" placeholder="输入类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="地区">
            <el-input v-model="form.accountRegion" placeholder="输入地区"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <!-- 第二行搜索项 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="开户行">
            <el-input v-model="form.accountBank" placeholder="输入开户行"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开户人">
            <el-input v-model="form.accountHolder" placeholder="输入开户人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="币种">
            <el-input v-model="form.accountCurrency" placeholder="输入币种"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align: right;">
          <el-form-item>
            <el-button type="primary" @click="searchPaymentAccount">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 财务表格 -->
    <div class="table-container" style="width: 100%; margin-top: 20px;">
      <el-table
        :data="paymentAccountData"
        :default-sort="{ prop: 'accountId', order: 'ascending' }"
        style="width: 100%"
        height="600px"
        :border="true"
        stripe
        v-loading="loading"
      >
        <!-- 表格列定义 -->
        <el-table-column prop="accountId" label="ID"></el-table-column>
        <el-table-column prop="accountName" label="账户名称">
          <template #default="scope">
            <div v-if="!scope.row.isEditing">{{ scope.row.accountName }}</div>
            <el-input v-else v-model="scope.row.accountName"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="accountNumber" label="账户号码">
          <template #default="scope">
            <div v-if="!scope.row.isEditing">{{ scope.row.accountNumber }}</div>
            <el-input v-else v-model="scope.row.accountNumber"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="accountType" label="类型">
          <template #default="scope">
            <div v-if="!scope.row.isEditing">{{ scope.row.accountType }}</div>
            <el-input v-else v-model="scope.row.accountType"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="accountBank" label="开户行">
          <template #default="scope">
            <div v-if="!scope.row.isEditing">{{ scope.row.accountBank }}</div>
            <el-input v-else v-model="scope.row.accountBank"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="accountHolder" label="开户人">
          <template #default="scope">
            <div v-if="!scope.row.isEditing">{{ scope.row.accountHolder }}</div>
            <el-input v-else v-model="scope.row.accountHolder"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="accountRegion" label="地区">
          <template #default="scope">
            <div v-if="!scope.row.isEditing">{{ scope.row.accountRegion }}</div>
            <el-input v-else v-model="scope.row.accountRegion"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="accountCurrency" label="币种">
          <template #default="scope">
            <div v-if="!scope.row.isEditing">{{ scope.row.accountCurrency }}</div>
            <el-input v-else v-model="scope.row.accountCurrency"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="accountStatus" label="状态">
          <template #default="scope">
            <div v-if="!scope.row.isEditing">{{ statusMap[scope.row.accountStatus] }}</div>
            <el-select v-else v-model="scope.row.accountStatus">
              <el-option label="停用" value="0"></el-option>
              <el-option label="在用" value="1"></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="accountComments" label="备注">
          <template #default="scope">
            <div v-if="!scope.row.isEditing">{{ scope.row.accountComments }}</div>
            <el-input v-else v-model="scope.row.accountComments"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="150"
          fixed="right"
        >
          <template #default="scope">
            <el-button v-if="!scope.row.isEditing" type="success" size="small" @click="editAccount(scope.row)">
              编辑
            </el-button>
            <el-button v-if="scope.row.isEditing" type="primary" size="small" @click="updatePaymentAccount(scope.row)">
              更新
            </el-button>
            <el-button v-if="scope.row.isEditing" type="danger" size="small" @click="cancelEdit(scope.row)">
              取消
            </el-button>
            <el-button v-if="!scope.row.isEditing" type="danger" size="small" @click="deletePaymentAccount(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  updatePaymentAccount as apiUpdatePaymentAccount,
  searchPaymentAccount as apiSearchPaymentAccount,
  deletePaymentAccount as apiDeletePaymentAccount
} from '@/api/finance'

export default {
  name: 'ViewPaymentAccount',
  setup() {
    const loading = ref(false);
    const paymentAccountData = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalElements = ref(0);

    // 状态映射
    const statusMap = {
      "false": "停用",
      "true": "在用"
    };

    const form = reactive({
      accountName: '',
      accountNumber: '',
      accountType: '',
      accountRegion: '',
      accountBank: '',
      accountHolder: '',
      accountCurrency: '',
      accountCurrencyCode: '',
      accountComments: ''
    });

    const fetchPaymentAccounts = async () => {
      loading.value = true;
      try {
        const payload = {
          page: currentPage.value - 1,
          size: pageSize.value,
          accountName: form.accountName,
          accountNumber: form.accountNumber,
          accountType: form.accountType,
          accountRegion: form.accountRegion,
          accountBank: form.accountBank,
          accountHolder: form.accountHolder,
          accountCurrency: form.accountCurrency,
          accountCurrencyCode: form.accountCurrencyCode,
          accountRegion: form.accountRegion,
        };
        const response = await apiSearchPaymentAccount(payload);
        if (response.data.success) {
          paymentAccountData.value = response.data.data.content;
          totalElements.value = response.data.data.totalElements;
        } else {
          ElMessage.error("获取账户列表失败");
        }
      } catch (error) {
        ElMessage.error("获取账户列表失败");
      } finally {
        loading.value = false;
      }
    };

    const editAccount = (row) => {
      row.isEditing = true;
    };

    const cancelEdit = (row) => {
      row.isEditing = false;
    };

    const updatePaymentAccount = async (row) => {
      ElMessageBox.confirm("确定更新该账户吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const payload = {
          accountId: row.accountId,
          accountName: row.accountName,
          accountNumber: row.accountNumber,
          accountType: row.accountType,
          accountRegion: row.accountRegion,
          accountBank: row.accountBank,
          accountHolder: row.accountHolder,
          accountCurrency: row.accountCurrency,
          accountStatus: row.accountStatus == '1' ? true : false,
          accountComments: row.accountComments
        };
        try {
          const response = await apiUpdatePaymentAccount(payload);
          if (response.data.success) {
            ElMessage.success("更新账户成功");
            fetchPaymentAccounts();
          } else {
            ElMessage.error("更新账户失败");
          }
        } catch (error) {
          ElMessage.error("更新账户失败");
        }
      });
    };

    const deletePaymentAccount = async (row) => {
      ElMessageBox.confirm("确定删除该账户吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        try {
          const response = await apiDeletePaymentAccount({ accountId: row.accountId });
          if (response.data.success) {
            ElMessage.success("删除账户成功");
            fetchPaymentAccounts();
          } else {
            ElMessage.error("删除账户失败");
          }
        } catch (error) {
          ElMessage.error("删除账户失败");
        }
      });
    };

    const searchPaymentAccount = () => {
      currentPage.value = 1;
      fetchPaymentAccounts();
    };

    const resetForm = () => {
      form.accountName = '';
      form.accountNumber = '';
      form.accountType = '';
      form.accountRegion = '';
      form.accountBank = '';
      form.accountHolder = '';
      form.accountCurrency = '';
      form.accountCurrencyCode = '';
      form.accountComments = '';
      searchPaymentAccount();
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchPaymentAccounts();
    };

    const handleSizeChange = (size) => {
      pageSize.value = size;
      fetchPaymentAccounts();
    };

    onMounted(() => {
      fetchPaymentAccounts();
    });

    return {
      form,
      paymentAccountData,
      loading,
      currentPage,
      pageSize,
      totalElements,
      fetchPaymentAccounts,
      searchPaymentAccount,
      updatePaymentAccount,
      deletePaymentAccount,
      resetForm,
      handlePageChange,
      handleSizeChange,
      editAccount,
      cancelEdit,
      statusMap
    };
  }
}
</script>

<style scoped>
.table-container {
  width: 100%;
  margin-top: 20px;
}

.search-form {
  padding: 10px 0;
}
</style>
