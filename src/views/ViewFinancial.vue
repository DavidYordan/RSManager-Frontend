<template>
  <div class="view-financial">
    <!-- 搜索表单 -->
    <el-form :model="form" label-width="120px" :inline="false" class="search-form">
      <!-- 第一行搜索项 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="姓名">
            <el-input v-model="form.fullname" placeholder="输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户名">
            <el-input v-model="form.username" placeholder="输入用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="邀请人姓名">
            <el-input v-model="form.inviterFullname" placeholder="输入邀请人姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="邀请人用户名">
            <el-input v-model="form.inviterName" placeholder="输入邀请人用户名"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <!-- 第二行搜索项 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="管理人姓名">
            <el-input v-model="form.managerFullname" placeholder="输入管理人姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="管理人用户名">
            <el-input v-model="form.managerName" placeholder="输入管理人用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="form.createdAfter"
              type="date"
              placeholder="开始日期"
            ></el-date-picker>
            <el-date-picker
              v-model="form.createdBefore"
              type="date"
              placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      
      <!-- 第三行搜索项 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="form.state" placeholder="选择状态" clearable>
              <el-option
                v-for="(label, value) in stateOptions"
                :key="value"
                :label="label"
                :value="value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="提现时间">
            <el-date-picker
              v-model="form.outAfter"
              type="date"
              placeholder="开始日期"
            ></el-date-picker>
            <el-date-picker
              v-model="form.outBefore"
              type="date"
              placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      
        <el-col :span="6" style="text-align: right;">
          <el-form-item>
            <el-button type="primary" @click="searchCashOuts">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
            <el-button type="success" @click="exportData">导出</el-button>
            <el-button @click="syncData">同步</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 财务表格 -->
    <div class="table-container" style="width: 100%; margin-top: 20px;">
      <el-table
        ref="tableRef"
        :data="cashouts"
        :default-sort="{ prop: 'userId', order: 'ascending' }"
        style="width: 100%"
        height="600px"
        :border="true"
        stripe
        v-loading="loading"
        :header-cell-style="{ background: '#f5f7fa', 'font-weight': 'bold' }"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        lazy
      >
        <!-- 表格列定义 -->
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="fullname" label="姓名"></el-table-column>
        <el-table-column prop="inviterFullname" label="邀请人"></el-table-column>
        <el-table-column prop="managerFullname" label="管理人"></el-table-column>
        <el-table-column prop="platformId" label="平台ID"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="money" label="金额"></el-table-column>
        <el-table-column prop="createAt" label="创建时间"></el-table-column>
        <el-table-column prop="outAt" label="提现时间"></el-table-column>
        <el-table-column prop="orderNumber" label="订单号"></el-table-column>
        <el-table-column prop="state" label="状态">
          <template #default="scope">
            {{ stateMap[scope.row.state] || scope.row.state }}
          </template>
        </el-table-column>
        <el-table-column prop="refund" label="备注"></el-table-column>
        <el-table-column prop="rate" label="费率"></el-table-column>
        <el-table-column prop="recipient" label="收款人"></el-table-column>
        <el-table-column prop="bankNumber" label="银行卡号"></el-table-column>
        <el-table-column prop="bankName" label="银行名称"></el-table-column>
        <el-table-column prop="bankAddress" label="银行地址"></el-table-column>
        <el-table-column prop="bankCode" label="银行代码"></el-table-column>
        <el-table-column
          label="操作"
          width="150"
          fixed="right"
        >
          <template #default="scope">
            <el-button v-if="scope.row.state === 0" type="success" size="small" @click="completeData(scope.row)">
              完成
            </el-button>
            <el-button v-if="scope.row.state === 0" type="danger" size="small" @click="rejectData(scope.row)">
              拒绝
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
import { useI18n } from 'vue-i18n';
import { ElMessage, ElMessageBox } from 'element-plus';
import { saveAs } from 'file-saver';
import {
  searchCashOut,
  exportCashOut,
  syncCashOut,
  completeCashOut,
  rejectCashOut
} from '@/api/finance'

export default {
  name: 'ViewFinancial',
  setup() {
    const { t } = useI18n();

    const loading = ref(false);
    const cashouts = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalElements = ref(0);

    // 状态映射
    const stateMap = {
      "-1": "已拒绝",
      "0": "待转账",
      "1": "已支付"
    };

    const stateOptions = {
      "-1": "已拒绝",
      "0": "待转账",
      "1": "已支付"
    };

    const form = reactive({
      fullname: '',
      username: '',
      inviterFullname: '',
      inviterName: '',
      managerFullname: '',
      managerName: '',
      createdAfter: null,
      createdBefore: null,
      outAfter: null,
      outBefore: null,
      state: null
    });

    const fetchCashOuts = async () => {
      loading.value = true;
      try {
        // 格式化日期
        const payload = {
          page: currentPage.value - 1,
          size: pageSize.value,
          fullname: form.fullname,
          username: form.username,
          inviterFullname: form.inviterFullname,
          inviterName: form.inviterName,
          managerFullname: form.managerFullname,
          managerName: form.managerName,
          createdAfter: form.createdAfter ? new Date(form.createdAfter).toISOString() : null,
          createdBefore: form.createdBefore ? new Date(form.createdBefore).toISOString() : null,
          outAfter: form.outAfter ? new Date(form.outAfter).toISOString() : null,
          outBefore: form.outBefore ? new Date(form.outBefore).toISOString() : null,
          state: form.state
        };
        const response = await searchCashOut(payload);
        if (response.data.success) {
          cashouts.value = response.data.data.content;
          totalElements.value = response.data.data.totalElements;
        } else {
          ElMessage.error("获取提现列表失败");
        }
      } catch (error) {
        ElMessage.error("获取提现列表失败");
      } finally {
        loading.value = false;
      }
    };

    const searchCashOuts = () => {
      currentPage.value = 1;
      fetchCashOuts();
    };

    const resetForm = () => {
      form.fullname = '';
      form.username = '';
      form.inviterFullname = '';
      form.inviterName = '';
      form.managerFullname = '';
      form.managerName = '';
      form.createdAfter = null;
      form.createdBefore = null;
      form.outAfter = null;
      form.outBefore = null;
      form.state = null;
      searchCashOuts();
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchCashOuts();
    };

    const handleSizeChange = (size) => {
      pageSize.value = size;
      fetchCashOuts();
    };

    const exportData = async () => {
      loading.value = true;
      try {
        const payload = {
          fullname: form.fullname,
          username: form.username,
          inviterFullname: form.inviterFullname,
          inviterName: form.inviterName,
          managerFullname: form.managerFullname,
          managerName: form.managerName,
          createdAfter: form.createdAfter ? new Date(form.createdAfter).toISOString() : null,
          createdBefore: form.createdBefore ? new Date(form.createdBefore).toISOString() : null,
          outAfter: form.outAfter ? new Date(form.outAfter).toISOString() : null,
          outBefore: form.outBefore ? new Date(form.outBefore).toISOString() : null,
          state: form.state
        };
        const response = await exportCashOut(payload);
        if (response.status === 200) {
          // 获取文件名
          const disposition = response.headers['content-disposition'];
          let fileName = 'cash_out_export.xlsx';
          if (disposition && disposition.indexOf('attachment') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) { 
              fileName = matches[1].replace(/['"]/g, '');
            }
          }

          // 使用 FileSaver.js 的 saveAs 方法触发下载
          const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          saveAs(blob, fileName);
          ElMessage.success("导出成功");
        } else {
          ElMessage.error("导出失败");
        }
      } catch (error) {
        ElMessage.error("导出失败");
      } finally {
        loading.value = false;
      }
    };

    const syncData = async () => {
      loading.value = true;
      try {
        const response = await syncCashOut();
        if (response.data.success) {
          ElMessage.success("同步成功");
          fetchCashOuts();
        } else {
          ElMessage.error("同步失败");
        }
      } catch (error) {
        ElMessage.error("同步失败");
      } finally {
        loading.value = false;
      }
    };

    const completeData = async (row) => {
      ElMessageBox.confirm(
        `确定要完成该提现申请吗？<br/>姓名: ${row.fullname}<br/>金额: ${row.money}`,
        '确认完成',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
        }
      ).then(async () => {
        loading.value = true;
        try {
          const response = await completeCashOut(row.id);
          if (response.data.success) {
            ElMessage.success("操作成功");
            fetchCashOuts();
          } else {
            ElMessage.error(response.data.message || "操作失败");
          }
        } catch (error) {
          ElMessage.error("操作失败");
        } finally {
          loading.value = false;
        }
      }).catch(() => {
        // 用户取消操作
      });
    };

    const rejectData = async (row) => {
      ElMessageBox.prompt(
        `确定要拒绝该提现申请吗？<br/>姓名: ${row.fullname}<br/>金额: ${row.money}`,
        '确认拒绝',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入拒绝备注',
          inputValidator: (value) => {
            if (!value || !value.trim()) {
              return '备注是必填项';
            }
            return true;
          },
          inputErrorMessage: '备注是必填项',
          dangerouslyUseHTMLString: true,
          type: 'warning',
        }
      ).then(async ({ value }) => {
        const remark = value.trim();
        if (!remark) {
          ElMessage.error('备注是必填项');
          return;
        }
        loading.value = true;
        try {
          const payload = { id: row.id, comment: remark };
          const response = await rejectCashOut(payload);
          if (response.data.success) {
            ElMessage.success("操作成功");
            fetchCashOuts();
          } else {
            ElMessage.error(response.data.message || "操作失败");
          }
        } catch (error) {
          ElMessage.error("操作失败");
        } finally {
          loading.value = false;
        }
      }).catch(() => {
        // 用户取消操作
      });
    };

    onMounted(() => {
      fetchCashOuts();
    });

    return {
      form,
      cashouts,
      loading,
      currentPage,
      pageSize,
      totalElements,
      fetchCashOuts,
      searchCashOuts,
      resetForm,
      handlePageChange,
      handleSizeChange,
      exportData,
      syncData,
      stateMap,
      stateOptions,
      completeData,
      rejectData,
      t
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
