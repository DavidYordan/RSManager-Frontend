<template>
  <div class="view-scholars">
    <!-- 搜索表单 -->
    <el-form :model="form" label-width="120px" :inline="false" class="search-form">
      <el-row :gutter="20">
        <!-- 学员姓名 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewScholars.fullname')">
            <el-input v-model="form.fullname" :placeholder="$t('ViewScholars.placeholders.enterFullname')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 学员账号 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewScholars.username')">
            <el-input v-model="form.username" :placeholder="$t('ViewScholars.placeholders.enterUsername')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 学员邀请码 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewScholars.invitationCode')">
            <el-input v-model="form.invitationCode" :placeholder="$t('ViewScholars.placeholders.enterInvitationCode')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 项目等级 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewScholars.roleId')">
            <el-select v-model="form.roleId" :placeholder="$t('ViewScholars.placeholders.selectRole')" clearable>
              <el-option
                v-for="(label, key) in roleOptions"
                :key="key"
                :label="label"
                :value="parseInt(key, 10)"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 邀请人姓名 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewScholars.inviterFullname')">
            <el-input v-model="form.inviterFullname" :placeholder="$t('ViewScholars.placeholders.enterInviterFullname')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 邀请人账号 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewScholars.inviterName')">
            <el-input v-model="form.inviterName" :placeholder="$t('ViewScholars.placeholders.enterInviterName')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 邀请人邀请码 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewScholars.inviterCode')">
            <el-input v-model="form.invitationCode" :placeholder="$t('ViewScholars.placeholders.enterInviterCode')"></el-input>
          </el-form-item>
        </el-col>

        <!-- Tiktok账号 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewScholars.tiktokAccount')">
            <el-input v-model="form.tiktokAccount" :placeholder="$t('ViewScholars.placeholders.enterTiktokAccount')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 管理人姓名 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewScholars.managerFullname')">
            <el-input v-model="form.managerFullname" :placeholder="$t('ViewScholars.placeholders.enterManagerFullname')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 管理人账号 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewScholars.managerName')">
            <el-input v-model="form.managerName" :placeholder="$t('ViewScholars.placeholders.enterManagerName')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 地区 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewScholars.regionName')">
            <el-select v-model="form.regionName" :placeholder="$t('ViewScholars.placeholders.selectRegionName')" clearable>
              <el-option
                v-for="(label, key) in regionOptions"
                :key="key"
                :label="label"
                :value="label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 币种 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewScholars.currency')">
            <el-select v-model="form.currency" :placeholder="$t('ViewScholars.placeholders.selectCurrency')" clearable>
              <el-option
                v-for="(label, key) in currencyOptions"
                :key="key"
                :label="label"
                :value="label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 是否有邀请人 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewScholars.inviterExists')">
            <el-select v-model="form.inviterExists" :placeholder="$t('ViewScholars.placeholders.selectInviterExists')" clearable>
              <el-option
                v-for="(label, key) in enabledOptions"
                :key="key"
                :label="label"
                :value="key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 申请单创建时间 -->
        <el-col :span="12">
          <el-form-item :label="$t('ViewScholars.createdTimeRange')">
            <el-date-picker
              v-model="form.createdAfter"
              type="date"
              placeholder="开始日期"
              style="margin-right: 10px;"
              @change="formatDate('createdAfter')"
            ></el-date-picker>
            <el-date-picker
              v-model="form.createdBefore"
              type="date"
              placeholder="结束日期"
              @change="formatDate('createdBefore')"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6" class="button-group">
          <el-form-item>
            <el-button type="primary" @click="searchusersHandler">{{ $t('ViewScholars.buttons.query') }}</el-button>
            <el-button @click="resetForm">{{ $t('ViewScholars.buttons.reset') }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 学员表格 -->
    <div class="table-container" style="width: 100%; margin-top: 20px;">
      <el-table
        ref="tableRef"
        :data="scholars"
        :row-key="row => row._uniqueKey"
        :default-sort="{ prop: 'userId', order: 'ascending' }"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        height="600px"
        :border="true"
        stripe
        v-loading="loading"
        :header-cell-style="{ background: '#f5f7fa', 'font-weight': 'bold' }"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :load="loadChildren"
        lazy
      >

        <!-- 表格列定义 -->
        <el-table-column
          :label="$t('ViewScholars.table.userId')"
          
        >
          <template #default="scope">
            <span @click="toggleRow(scope.row)" style="cursor: pointer; display: inline-flex; align-items: center;">
              <component
                :is="tableRef.value && tableRef.value.isRowExpanded(scope.row) ? 'ArrowLeftBold' : 'ArrowRightBold'"
                style="margin-right: 4px;"
              />
              <span>{{ scope.row.userId }}</span>
              <span v-if="scope.row.hasChildren" class="child-count" style="margin-left: 4px;">({{ scope.row.inviteCount }})</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="fullname" :label="$t('ViewScholars.table.fullname')"></el-table-column>
        <el-table-column prop="roleId" :label="$t('ViewScholars.table.role')">
          <template #default="scope">
            {{ roleOptions[scope.row.roleId] }}
          </template>
        </el-table-column>
        <!-- 管理人账号 -->
        <el-table-column prop="managerFullname" :label="$t('ViewScholars.table.managerFullname')"></el-table-column>
        <el-table-column prop="inviterFullname" :label="$t('ViewScholars.table.inviterFullname')">
          <template #default="scope">
            <span
              :style="{ color: ([4, 5, 6].includes(scope.row.roleId) && !scope.row.inviterFullname) ? 'red' : 'inherit' }"
            >
              <span v-html="([4, 5, 6].includes(scope.row.roleId) && !scope.row.inviterFullname) ? `未录入` : scope.row.inviterFullname || ''"></span>
            </span>
          </template>
        </el-table-column>
        <!-- 项目总金额 -->
        <el-table-column prop="projectAmountSum" label="项目总金额">
          <template #default="scope">
            {{ formatCurrency(scope.row.projectAmountSum, scope.row.currency) }}
          </template>
        </el-table-column>
        <!-- 已缴纳学费 -->
        <el-table-column prop="paidStr" label="已缴纳学费">
          <template #default="scope">
            <span v-html="scope.row.paidStr"></span>
          </template>
        </el-table-column>
        <!-- 销售佣金 -->
        <el-table-column label="销售佣金">
          <template #default="scope">
            <span v-html="calculatePayments(scope.row.profits1, scope.row.profits2)"></span>
          </template>
        </el-table-column>
        <!-- 平台总收入 -->
        <el-table-column :label="$t('ViewScholars.form.platformTotalRevenue')">
          <template #default="scope">
            {{ formatCurrency(scope.row.platformTotalRevenue) }}
          </template>
        </el-table-column>
        <!-- 平台总提现 -->
        <el-table-column :label="$t('ViewScholars.form.platformTotalWithdrawal')">
          <template #default="scope">
            {{ formatCurrency(scope.row.platformTotalWithdrawal) }}
          </template>
        </el-table-column>
        <!-- 平台余额 -->
        <el-table-column :label="$t('ViewScholars.form.platformRevenueBalance')">
          <template #default="scope">
            {{ formatCurrency(scope.row.platformRevenueBalance) }}
          </template>
        </el-table-column>
        <!-- 平台钱包 -->
        <el-table-column prop="wallet" :label="$t('ViewScholars.form.platformMoney')">
          <template #default="scope">
            {{ formatCurrency(scope.row.platformMoney) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('ViewScholars.table.actions')"
          width="120"
          fixed="right"
        >
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewScholar(scope.row)">
              {{ $t('ViewScholars.buttons.view') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <ViewScholarDrawer ref="ViewScholarDrawer" />
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
import { ref, reactive, onMounted, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import ViewScholarDrawer from '@/components/ViewScholarDrawer.vue';
import { searchusers } from '@/api/user';
import { fetchAllRegions as apifetchAllRegions } from '@/api/utils'
import { v4 as uuidv4 } from 'uuid';
import { ArrowRightBold, ArrowLeftBold } from '@element-plus/icons-vue'; 

export default {
  name: 'ViewScholars',
  components: { 
    ViewScholarDrawer, 
    ArrowRightBold, 
    ArrowLeftBold 
  },
  setup() {
    const { t } = useI18n();

    // 表单数据
    const form = reactive({
      inviterExists: '',
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
      roleId: null,
      paymentMethod: '',
      createdAfter: null,
      createdBefore: null
    });

    // 角色选项
    const roleOptions = {
      '1': t('ViewScholars.status.1'),
      '2': t('ViewScholars.status.2'),
      '3': t('ViewScholars.status.3'),
      '4': t('ViewScholars.status.4'),
      '5': t('ViewScholars.status.5'),
      '6': t('ViewScholars.status.6'),
      '7': t('ViewScholars.status.7'),
      '8': t('ViewScholars.status.8'),
      '9': t('ViewScholars.status.9')
    };

    const enabledOptions = {
      true: '是',
      false: '否'
    };

    // 表格数据
    const scholars = ref([]);

    // 加载状态
    const loading = ref(false);

    // 分页
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalElements = ref(0);
    const totalPages = ref(1);

    // 地区选项
    const regionOptions = ref([]);
    const currencyOptions = ref([]);

    const ViewScholarDrawer = shallowRef(null);

    // 使用 Map 管理树节点
    const map = new Map();

    const tableRef = ref(null);

    /**
     * 为每一行数据添加唯一的 UUID
     * @param {Array} data - 原始数据数组
     * @returns {Array} - 添加了 _uniqueKey 的数据数组
     */
    const addUniqueKey = (data) => {
      return data.map(item => ({
        ...item,
        _uniqueKey: uuidv4(), // 生成 UUID
        children: item.children ? addUniqueKey(item.children) : undefined // 递归处理子节点
      }));
    };

    /**
     * 获取学者数据
     * @param {Object} payload - 请求参数
     * @param {Object|null} parentRow - 父级行数据
     */
    const fetchScholars = async (payload, parentRow = null) => {
      loading.value = true;
      try {
        const response = await searchusers(payload);
        if (response.data.success) {
          let data = response.data.data.content.map(item => {
            if (item.inviteCount > 0) {
              const { children, ...rest } = item; // 移除 children
              return { ...rest, hasChildren: true };
            } else {
              return { ...item, hasChildren: false };
            }
          });

          // 添加唯一键
          data = addUniqueKey(data);

          if (parentRow) {
            // 如果是子节点，添加到父节点的 children 中
            parentRow.children = data;
          } else {
            // 否则，设置为主表格数据
            scholars.value = data;
            totalElements.value = response.data.data.totalElements;
            totalPages.value = response.data.data.totalPages;
          }
        } else {
          ElMessage.error(t('ViewScholars.messages.fetchError'));
        }
      } catch (error) {
        console.error(error);
        ElMessage.error(t('ViewScholars.messages.fetchError'));
      } finally {
        loading.value = false;
      }
    };

    /**
     * 搜索学者
     */
    const searchusersHandler = () => {
      currentPage.value = 1;
      const payload = {
        ...form,
        roleId: form.roleId ? parseInt(form.roleId, 10) : null,
        inviterExists: form.inviterExists === 'true' ? true : form.inviterExists === 'false' ? false : null,
        page: currentPage.value - 1,
        size: pageSize.value
      };
      fetchScholars(payload);
    };

    /**
     * 重置表单
     */
    const resetForm = () => {
      form.inviterExists = '';
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
      form.roleId = null;
      form.paymentMethod = '';
      form.createdAfter = null;
      form.createdBefore = null;
      searchusersHandler();
    };

    /**
     * 查看学者详情
     * @param {String} userId - 用户ID
     */
    const viewScholar = (userId) => {
      if (ViewScholarDrawer.value) {
        ViewScholarDrawer.value.showDrawer(userId);
      } else {
        console.error('Drawer component is not ready.');
      }
    };

    /**
     * 格式化货币
     * @param {Number} value - 金额
     * @returns {String} 格式化后的金额
     */
    const formatCurrency = (value, currency="美元") => {
      if (value === null || value === undefined) {
        return '-'; // 返回占位符
      }
      return `${parseFloat(value.toFixed(2))} ${currency ? currency : ''}`;
    };

    /**
     * 汇总收入，按币种分组并返回多行字符串
     * @param {Array} profits1 - 收入类别1
     * @param {Array} profits2 - 收入类别2
     * @returns {String} - 按币种分组的收入，换行显示
     */
    const calculatePayments = (profits1, profits2) => {
      const revenueMap = {};

      // 汇总 profits1
      profits1.forEach(item => {
        if (!revenueMap[item.currency]) {
          revenueMap[item.currency] = 0;
        }
        revenueMap[item.currency] += item.profit;
      });

      // 汇总 profits2
      profits2.forEach(item => {
        if (!revenueMap[item.currency]) {
          revenueMap[item.currency] = 0;
        }
        revenueMap[item.currency] += item.profit;
      });

      // 格式化输出字符串
      return Object.entries(revenueMap)
        .map(([currency, total]) => `${total.toFixed(2)} ${currency}`)
        .join('<br>');
    };

    /**
     * 设置行类名（根据需求自定义）
     * @param {Object} param0 - 行数据
     * @returns {String} 行类名
     */
    const tableRowClassName = ({ row, rowIndex }) => {
      // 根据 roleId 或其他条件自定义行样式
      return '';
    };

    /**
     * 处理页码变化
     * @param {Number} page - 当前页码
     */
    const handlePageChange = (page) => {
      currentPage.value = page;
      const payload = {
        ...form,
        roleId: form.roleId ? parseInt(form.roleId, 10) : null,
        page: currentPage.value - 1, // 假设 API 是 0-based
        size: pageSize.value
      };
      fetchScholars(payload);
    };

    /**
     * 处理分页大小变化
     * @param {Number} newSize - 新的分页大小
     */
    const handleSizeChange = (newSize) => {
      pageSize.value = newSize;
      currentPage.value = 1; // 重置为第一页
      searchusersHandler();
    };

    /**
     * 加载子节点
     * @param {Object} row - 当前行数据
     * @param {Object} treeNode - 树节点
     * @param {Function} resolve - 回调函数
     */
    const loadChildren = (row, treeNode, resolve) => {
      if (!row.hasChildren) {
        resolve([]);
        return;
      }

      // 记录当前加载的节点
      map.set(row.userId, { tree: row, treeNode, resolve });

      const payload = {
        inviterId: row.userId, // 修正为 inviterId
        page: 0, // 子节点从第一页开始
        size: 50 // 根据需要调整子节点数量
      };

      searchusers(payload).then(response => {
        if (response.data.success) {
          let children = response.data.data.content.map(item => {
            if (item.inviteCount > 0) {
              const { children, ...rest } = item; // 移除 children
              return { ...rest, hasChildren: true };
            } else {
              return { ...item, hasChildren: false };
            }
          });

          // 添加唯一键
          children = addUniqueKey(children);

          row.children = children; // 设置子节点
          resolve(children);
        } else {
          ElMessage.error(t('ViewScholars.messages.fetchError'));
          resolve([]);
        }
      }).catch(error => {
        console.error(error);
        ElMessage.error(t('ViewScholars.messages.fetchError'));
        resolve([]);
      });
    };

    /**
     * 刷新子节点
     * @param {Number} parentId - 父级ID
     */
    const refresh = (parentId) => {
      if (map.get(parentId)) {
        const { tree, treeNode, resolve } = map.get(parentId);
        if (tree) {
          loadChildren(tree, treeNode, resolve);
        }
      }
    };

    /**
     * 更新表格（例如在新增、编辑、删除子节点后调用）
     */
    const updateTable = () => {
      // 替换为实际的父级ID
      const parentId = 1; // 示例
      refresh(parentId);
    };

    /**
     * 切换行展开/折叠
     * @param {Object} row - 当前行数据
     */
    const toggleRow = (row) => {
      if (!row.hasChildren) {
        return;
      }
      if (tableRef.value.isRowExpanded(row)) {
        tableRef.value.collapseRow(row);
      } else {
        tableRef.value.expandRow(row);
      }
    };

    /**
     * 获取所有类型数据（地区和项目名称）
     */
    const loadAllTypes = async () => {
      try {
        const response = await apifetchAllRegions()
        if (response.data.success) {
          const data = response.data.data

          regionOptions.value = data.map(region => region.regionName);
          currencyOptions.value = [...new Set(data.map(region => region.currency))];

        } else {
          ElMessage.error(t('enrollScholar.FetchTypesFailed'))
        }
      } catch (error) {
        ElMessage.error(t('enrollScholar.FetchTypesFailed'))
      }
    }

    const formatDate = (field) => {
      if (form[field]) {
        const date = new Date(form[field]);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        form[field] = `${year}-${month}-${day}`;
      }
    };

    // 在组件挂载时执行初始搜索
    onMounted(() => {
      loadAllTypes();
      searchusersHandler();
    });

    return {
      t,
      form,
      roleOptions,
      enabledOptions,
      formatDate,
      scholars,
      loading,
      searchusersHandler, // 确保返回名称与模板一致
      resetForm,
      viewScholar,
      formatCurrency,
      tableRowClassName,
      handlePageChange,
      handleSizeChange,
      currentPage,
      pageSize,
      totalElements,
      totalPages,
      ViewScholarDrawer,
      loadChildren,
      refresh, // 添加 refresh 方法
      updateTable, // 添加 updateTable 方法
      toggleRow, // 添加 toggleRow 方法
      tableRef, // 添加 tableRef
      ArrowRightBold,
      ArrowLeftBold,
      calculatePayments,
      regionOptions,
      currencyOptions
    };
  }
};
</script>

<style scoped>
.view-scholars {
  padding: 20px;
}

.search-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 调整按钮组布局 */
.button-group {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

/* 根据状态设置行颜色 */
.row-cancelled {
  background-color: rgba(245, 108, 108, 0.1); /* 浅红色 */
}

.row-finished {
  background-color: rgba(103, 194, 58, 0.1); /* 浅绿色 */
}

.row-submitted {
  background-color: rgba(144, 147, 153, 0.1); /* 浅灰色 */
}

.row-editing {
  background-color: rgba(230, 162, 60, 0.1); /* 浅橙色 */
}

.row-paying {
  background-color: rgba(64, 158, 255, 0.1); /* 浅蓝色 */
}

/* 确保表格容器支持横向滚动 */
.table-container {
  overflow-x: auto;
}

/* 自定义滚动条样式 */
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

/* 确保固定列样式 */
.el-table .cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 子节点数量样式 */
.child-count {
  font-size: 12px;
  color: #999;
  margin-left: 4px;
}
</style>
