<template>
  <el-drawer
    v-model="drawerVisible"
    :title="t('ViewScholarDrawer.title')"
    :with-header="true"
    size="70%"
    direction="ltr"
    @close="closeDrawer"
  >
    <div v-if="userData" class="drawer-content">
      <!-- Main Data Section with 2-Column Layout -->
      <div class="main-data-table">
        <!-- Left Table -->
        <el-table :data="leftMainData" :border="true" :show-header="false" stripe max-height="600" class="vertical-table">
          <el-table-column prop="label" :label="t('ViewScholarDrawer.columns.field')"></el-table-column>
          <el-table-column prop="value" :label="t('ViewScholarDrawer.columns.value')">
            <template #default="scope">
              <div class="value-with-button">
                <template v-if="scope.row.isLink">
                  <el-link type="primary" @click="openDialog(scope.row.key)">
                    <span v-html="scope.row.value"></span>
                  </el-link>
                  <el-button 
                  v-if="isEditable(scope.row.key)" 
                    type="primary"
                    size="small" 
                    @click="ge(scope.row.key)">
                    {{ t('ViewScholarDrawer.buttons.change') }}
                  </el-button>
                </template>
                <template v-else>
                  <span v-html="scope.row.value"></span>
                  <el-button 
                    v-if="isEditable(scope.row.key)" 
                    type="info"
                    size="small" 
                    @click="openChangeDialog(scope.row.key)">
                    {{ t('ViewScholarDrawer.buttons.change') }}
                  </el-button>
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- Right Table -->
        <el-table :data="rightMainData" :border="true" :show-header="false" stripe max-height="600" class="vertical-table">
          <el-table-column prop="label" :label="t('ViewScholarDrawer.columns.field')"></el-table-column>
          <el-table-column prop="value" :label="t('ViewScholarDrawer.columns.value')">
            <template #default="scope">
              <div class="value-with-button">
                <!-- 判断是否为链接 -->
                <template v-if="scope.row.isLink">
                  <el-link type="primary" @click="openDialog(scope.row.key)">
                    <span v-html="scope.row.value"></span>
                  </el-link>
                  <el-button 
                    v-if="isEditable(scope.row.key)" 
                    type="primary"
                    size="small" 
                    @click="openChangeDialog(scope.row.key)">
                    {{ t('ViewScholarDrawer.buttons.change') }}
                  </el-button>
                </template>
                <template v-else>
                  <span v-html="scope.row.value"></span>
                  <el-button 
                    v-if="isEditable(scope.row.key)" 
                    type="info"
                    size="small" 
                    @click="openChangeDialog(scope.row.key)">
                    {{ t('ViewScholarDrawer.buttons.change') }}
                  </el-button>
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- TikTok Accounts Section -->
      <el-table
        :data="userData ? [userData] : []"
        style="width: 100%; margin-top: 20px;"
        :border="true"
        stripe
        show-overflow-tooltip
      >
        <el-table-column prop="tiktokAccount" :label="t('ViewScholarDrawer.fields.tiktokAccount')">
          <template #default="scope">
            <div class="value-with-button">
              <el-button 
                v-if="isEditable('tiktokAccount')" 
                type="info"
                size="small" 
                @click="openChangeDialog('tiktokAccount', scope.row)">
                {{ t('ViewScholarDrawer.buttons.change') }}
              </el-button>
              <span>{{ scope.row.tiktokAccount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="followingCount" label="关注数"></el-table-column>
        <el-table-column prop="followerCount" label="粉丝数"></el-table-column>
        <el-table-column prop="heartCount" label="点赞数"></el-table-column>
        <el-table-column prop="videoCount" label="视频数"></el-table-column>
        <el-table-column prop="updateAt" label="数据更新时间">
          <template #default="scope">
            {{ formatUpdateAt(scope.row.updatedAt) }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Change Dialog -->
    <el-dialog
      :title="changeDialogTitle"
      v-model="changeDialogVisible"
      width="30%"
      @close="resetChangeDialog"
    >
      <el-form :model="changeForm" :rules="changeRules" ref="changeFormRef" label-width="120px">
        <el-form-item :label="changeFieldLabel" :prop="changeField">
          <component
            :is="getChangeComponent(changeField)"
            v-model="changeForm[changeField]"
            placeholder="请输入"
          ></component>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="changeDialogVisible = false">{{ t('ViewScholarDrawer.buttons.cancel') }}</el-button>
        <el-button type="primary" @click="submitChange">{{ t('ViewScholarDrawer.buttons.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- Find User Dialog -->
    <FindUser
      v-if="userData && currentEditField"
      :fieldKey="currentEditField"
      :currentUserId="userData.userId"
      ref="findUser"
      @updateSuccess="handleFindUserSuccess"
    />

    <ShowProfits
      v-if="profitsDialogData"
      :title="profitsDialogTitle"
      :data="profitsDialogData"
      ref="showProfitsRef"
      maxWidth="90%"
      maxHeight="70vh"
    />

    <ShowTotalRevenues
      v-if="totalRevenuesData"
      :data="totalRevenuesData"
      ref="ShowTotalRevenuesRef"
      maxWidth="90%"
      maxHeight="70vh"
    />
  </el-drawer>
</template>

<script>
import { ref, computed, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '../store/index.js';
import { updateUser, searchusers } from '@/api/user';
import { ElMessage } from 'element-plus';
import FindUser from '@/components/FindUser.vue';
import ShowProfits from '@/components/ShowProfits.vue';
import ShowTotalRevenues from '@/components/ShowTotalRevenues.vue';

export default {
  name: 'ViewScholarDrawer',
  components: {
    FindUser,
    ShowProfits,
    ShowTotalRevenues,
  },
  setup(_, { expose }) {
    const { t } = useI18n();
    const drawerVisible = ref(false);
    const userData = ref(null);
    const store = useStore();

    const currentUserRoleId = computed(() => store.roleId);

    const showDrawer = (data) => {
      userData.value = data;
      drawerVisible.value = true;
    };

    const closeDrawer = () => {
      drawerVisible.value = false;
      userData.value = null;
    };

    const formatCurrency = (value, currencyName="美元") => {
      if (value === null || value === undefined) {
        return '-'; // 返回占位符
      }
      return `${parseFloat(value.toFixed(2))} ${currencyName ? currencyName : ''}`;
    };

    const getPaidStr = (payments) => {
      if (!payments || !payments.length) {
        return "0";
      }
      // 使用 Map 分组并计算总额
      const grouped = payments.reduce((acc, payment) => {
        const currencyName = payment.currencyName;
        acc[currencyName] = (acc[currencyName] || 0) + payment.paymentAmount;
        return acc;
      }, {});

      // 构造字符串，每个货币一行
      return Object.entries(grouped)
        .map(([currencyName, total]) => `${total} ${currencyName}`)
        .join("<br>");
    }

    const formatDate = (value) => value ? new Date(value).toLocaleString() : '-';

    const groupProfitsByCurrency = (profits) => {
      if (!profits) return {};
      return profits.reduce((acc, profit) => {
        const currencyName = profit.currencyName || 'Unknown';
        acc[currencyName] = (acc[currencyName] || 0) + (profit.profit || 0);
        return acc;
      }, {});
    };

    const formatGroupedProfits = (profits) => {
      return Object.entries(profits)
        .map(([currencyName, amount]) => `${Number(amount).toLocaleString()} ${currencyName}`)
        .join('<br>');
    };

    const formatUpdateAt = (utcTime) => {
      if (!utcTime) {
        return '-';
      }
      const updateAt = new Date(utcTime);
      const now = new Date();

      const diff = now - updateAt;

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      const timeUnits = [
        { unit: "年", value: years },
        { unit: "月", value: months % 12 },
        { unit: "天", value: days % 30 },
        { unit: "时", value: hours % 24 },
        { unit: "分", value: minutes % 60 },
        { unit: "秒", value: seconds % 60 },
      ];

      const nonZeroUnits = timeUnits.filter((item) => item.value > 0);

      if (nonZeroUnits.length === 0) {
        return "刚刚";
      }

      const topTwoUnits = nonZeroUnits.slice(0, 2);

      return topTwoUnits.map((item) => `${item.value}${item.unit}`).join(" ");
    };

    const leftMainData = computed(() => {
      const profits1 = groupProfitsByCurrency(userData.value?.profits1);
      return [
        { key: 'userId', label: "用户ID", value: userData.value.userId || '-' },
        { key: 'fullname', label: "姓名", value: userData.value.fullname || '-' },
        { key: 'regionName', label: "地区", value: userData.value.regionName || '-' },
        { key: 'platformId', label: "平台ID", value: userData.value.platformId || '-' },
        { key: 'inviterFullname', label: "邀请人姓名", value: userData.value.inviterFullname || '-' },
        { key: 'managerFullname', label: "管理人姓名", value: userData.value.managerFullname || '-' },
        { key: 'teacherFullname', label: "导师姓名", value: userData.value.teacherFullname || '-' },
        {
          key: 'projectAmountSum',
          label: "项目金额",
          value: formatCurrency(userData.value.projectAmount, userData.value.projectCurrencyName)
        },
        { key: 'inviteCount', label: "邀请人数", value: userData.value.inviteCount || '-' },
        { key: 'profits1', label: "一级分佣", value: formatGroupedProfits(profits1), isLink: userData.value?.profits1.length > 0 },
        {
          key: 'platformTotalRevenue',
          label: "平台总收入",
          value: formatCurrency(userData.value.moneySum),
          isLink: userData.value.inviteDailyMoneySum0DTOs.length > 0 || userData.value.inviteDailyMoneySum1DTOs.length > 0
        },
        { key: 'platformTotalWithdrawal', label: "平台总提现", value: formatCurrency(userData.value.cashOut) },
        { key: 'createdAt', label: "创建时间", value: formatDate(userData.value.createdAt) },
      ];
    });

    const rightMainData = computed(() => {
      const profits2 = groupProfitsByCurrency(userData.value?.profits2);
      return [
        { key: 'username', label: "用户名", value: userData.value?.username || '-' },
        { key: 'roleId', label: "角色", value: userData.value.roleName },
        { key: 'currencyName', label: "币种", value: userData.value.currencyName || '-' },
        { key: 'invitationCode', label: "平台邀请码", value: userData.value.invitationCode || '-' },
        { key: 'inviterName', label: "邀请人账号", value: userData.value.inviterName || '-' },
        { key: 'managerName', label: "管理人账号", value: userData.value.managerName || '-' },
        { key: 'teacherName', label: "导师账号", value: userData.value.teacherName || '-' },
        { key: 'paidStr', label: "已缴纳学费", value: getPaidStr(userData.value.applicationPaymentRecordDTOs) },
        { key: 'platformInviteCount', label: "平台邀请人数", value: userData.value.platformInviteCount || '-' },
        { key: 'profits2', label: "二级分佣", value: formatGroupedProfits(profits2), isLink: userData.value?.profits2.length > 0 },
        { key: 'platformRevenueBalance', label: "平台收入余额", value: formatCurrency(userData.value.money) },
        { key: 'platformMoney', label: "平台钱包", value: formatCurrency(userData.value.userMoney) },
      ];
    });

    // 判断某个字段是否可编辑
    const isEditable = (fieldKey) => {
      const editableFields = ['managerName', 'teacherName', 'fullname', 'tiktokAccount', 'status'];
      return currentUserRoleId.value === 1 && editableFields.includes(fieldKey);
    };

    const getRoleName = (rolePermissions) => {
      if (!rolePermissions || !rolePermissions.length) {
        return '未知';
      }

      const matchingRole = rolePermissions.find(
        (item) => item.endDate === null
      );

      return matchingRole ? matchingRole.roleName : '未知';
    };

    // 变更对话框相关状态
    const changeDialogVisible = ref(false);
    const changeDialogTitle = ref('');
    const changeField = ref('');
    const changeFieldLabel = ref('');
    const changeForm = ref({});
    const changeRules = ref({});
    const changeFormRef = ref(null);

    // 引用 FindUser
    const findUser = ref(null);
    // 保存当前要更新的字段
    const currentEditField = ref('');

    // 当前编辑的 TikTok Account 行数据
    const currentTikTokAccount = ref(null);

    const openChangeDialog = async (fieldKey, row = null) => {
      if (fieldKey === 'teacherName' || fieldKey === 'managerName') {
        // 使用 FindUser 进行编辑
        currentEditField.value = fieldKey; // 保存当前编辑的字段
        await nextTick(); // 等待 DOM 更新
        if (findUser.value && typeof findUser.value.openDialog === 'function') {
          findUser.value.openDialog(); // 打开 FindUser
        } else {
          console.error('findUser.value.openDialog is not available');
        }
      } else {
        // 使用现有的更改对话框
        changeField.value = fieldKey;
        changeFieldLabel.value = getFieldLabelByKey(fieldKey);
        if (fieldKey === 'tiktokAccount' && row) {
          currentTikTokAccount.value = row;
          changeForm.value = { tiktokAccount: row.tiktokAccount };
        } else {
          changeForm.value = { [changeField.value]: userData.value[fieldKey] };
        }

        // 根据字段设置不同的表单规则
        changeRules.value = {
          [changeField.value]: [
            { required: true, message: `请输入${changeFieldLabel.value}`, trigger: 'blur' }
          ]
        };

        // 设置对话框标题
        changeDialogTitle.value = `变更${changeFieldLabel.value}`;
        changeDialogVisible.value = true;
      }
    };

    const getFieldLabelByKey = (key) => {
      const labelMap = {
        managerName: t('ViewScholarDrawer.fields.managerName'),
        teacherName: t('ViewScholarDrawer.fields.teacherName'),
        fullname: t('ViewScholarDrawer.fields.fullname'),
        tiktokAccount: t('ViewScholarDrawer.fields.tiktokAccount'),
        status: t('ViewScholarDrawer.fields.status'),
      };
      return labelMap[key] || '';
    };

    const resetChangeDialog = () => {
      changeDialogVisible.value = false;
      changeField.value = '';
      changeFieldLabel.value = '';
      changeForm.value = {};
      currentTikTokAccount.value = null;
    };

    const getChangeComponent = (field) => {
      if (field === 'status') {
        return 'el-switch';
      }
      // 根据字段返回不同的组件
      return 'el-input';
    };

    const submitChange = () => {
      changeFormRef.value.validate(async (valid) => {
        if (valid) {
          const updateData = {
            userId: userData.value.userId,
            // 仅包含被编辑的字段
            [changeField.value]: changeForm.value[changeField.value],
          };

          try {
            const success = await updateUser(updateData);
            if (success) {
              // 刷新数据
              const response = await searchusers({ userId: userData.value.userId });
              if (response && response.data) {
                userData.value = response.data.data.content[0];
              }
              // 关闭对话框
              changeDialogVisible.value = false;
              // 可选：显示成功提示
              ElMessage.success(t('ViewScholarDrawer.messages.updateSuccess'));
            } else {
              // 处理更新失败的情况
              ElMessage.error(success.data.message || t('ViewScholarDrawer.messages.updateFailed'));
            }
          } catch (error) {
            // 处理错误
            ElMessage.error(error || t('ViewScholarDrawer.messages.updateFailed'));
          }
        }
      });
    };


    // 处理 FindUser 的成功回调
    const handleFindUserSuccess = async () => {
      try {
        const response = await searchusers({userId: userData.value.userId });
        if (response && response.data) {
          userData.value = response.data.data.content[0];
        } else {
          ElMessage.error(response.data.message || t('ViewScholarDrawer.messages.updateFailed'));
        }
      } catch (error) {
        console.error('searchUsers error:', error);
      }
    };

    // Generic Dialog
    const showProfitsRef = ref(null);
    const profitsDialogTitle = ref('');
    const profitsDialogData = ref([]);
    const ShowTotalRevenuesRef = ref(null);
    const totalRevenuesData = ref([]);

    const openDialog = (type) => {
      if (type === 'profits1') {
        openProfitsDialog('profits1');
      } else if (type === 'profits2') {
        openProfitsDialog('profits2');
      } else if (type === 'platformTotalRevenue') {
        openTotalRevenueDialog('平台收入明细');
      } else {
        return;
      }
    };

    const openTotalRevenueDialog = () => {
      if (userData.value.inviteDailyMoneySum0DTOs.length === 0 && userData.value.inviteDailyMoneySum1DTOs.length === 0) {
        ElMessage.warning('无相关数据');
        return;
      }

      totalRevenuesData.value = [
        ...userData.value.inviteDailyMoneySum0DTOs,
        ...userData.value.inviteDailyMoneySum1DTOs,
      ];

      if (ShowTotalRevenuesRef.value) {
        ShowTotalRevenuesRef.value.openDialog();
      }
    };

    const openProfitsDialog = (profitType) => {
      let data = [];

      if (profitType === 'profits1') {
        data = userData.value.profits1 || [];
        profitsDialogTitle.value = '一级分佣明细';
      } else if (profitType === 'profits2') {
        data = userData.value.profits2 || [];
        profitsDialogTitle.value = '二级分佣明细';
      } else {
        return;
      }

      if (data.length === 0) {
        ElMessage.warning('无相关数据');
        return;
      }

      profitsDialogData.value = data;
      if (showProfitsRef.value) {
        showProfitsRef.value.openDialog();
      }
    };

    expose({ showDrawer });

    return {
      t,
      drawerVisible,
      userData,
      leftMainData,
      rightMainData,
      closeDrawer,
      formatCurrency,
      formatDate,
      isEditable,
      openChangeDialog,
      changeDialogVisible,
      changeDialogTitle,
      changeField,
      changeFieldLabel,
      changeForm,
      changeRules,
      changeFormRef,
      showProfitsRef,
      profitsDialogTitle,
      profitsDialogData,
      ShowTotalRevenuesRef,
      totalRevenuesData,
      openDialog,
      openProfitsDialog,
      openTotalRevenueDialog,
      submitChange,
      getChangeComponent,
      resetChangeDialog,
      findUser, // 暴露 FindUser 的引用
      handleFindUserSuccess, // 处理回调
      currentEditField,
      getRoleName,
      getPaidStr,
      formatUpdateAt
    };
  }
};
</script>

<style scoped>
.drawer-content {
  padding: 20px;
}
.main-data-table {
  display: flex;
  gap: 20px;
}
.vertical-table .el-table__body-wrapper {
  max-height: 300px;
  overflow-y: auto;
}
.drawer-footer {
  text-align: right;
  padding: 10px;
}
.value-with-button {
  display: flex;
  align-items: center;
}
.value-with-button span {
  flex: 1;
}
.value-with-button .el-button {
  margin-left: 10px;
}
</style>
