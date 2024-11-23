<template>
  <el-drawer
    v-model="drawerVisible"
    :title="t('ViewScholarDrawer.title')"
    :with-header="true"
    size="70%"
    direction="ltr"
    @close="closeDrawer"
  >
    <div v-if="applicationData" class="drawer-content">
      <!-- Main Data Section with 2-Column Layout -->
      <div class="main-data-table">
        <!-- Left Table -->
        <el-table :data="leftMainData" :border="true" :show-header="false" stripe max-height="600" class="vertical-table">
          <el-table-column prop="label" :label="t('ViewScholarDrawer.columns.field')"></el-table-column>
          <el-table-column prop="value" :label="t('ViewScholarDrawer.columns.value')">
            <template #default="scope">
              <div class="value-with-button">
                <template v-if="scope.row.isLink">
                  <el-link type="primary" @click="openProfitsDialog('profits1')">
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
                  <el-link type="primary" @click="openProfitsDialog('profits2')">
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
        :data="applicationData.tiktokAccountDTO ? [applicationData.tiktokAccountDTO] : []"
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
        <!-- 其他列保持不变 -->
        <el-table-column prop="diggCount" :label="t('ViewScholarDrawer.fields.diggCount')"></el-table-column>
        <el-table-column prop="followerCount" :label="t('ViewScholarDrawer.fields.followerCount')"></el-table-column>
        <el-table-column prop="followingCount" :label="t('ViewScholarDrawer.fields.followingCount')"></el-table-column>
        <el-table-column prop="heartCount" :label="t('ViewScholarDrawer.fields.heartCount')"></el-table-column>
        <el-table-column prop="videoCount" :label="t('ViewScholarDrawer.fields.videoCount')"></el-table-column>
        <el-table-column prop="createdAt" :label="t('ViewScholarDrawer.fields.tiktokCreatedAt')">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
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
      v-if="applicationData && currentEditField"
      :fieldKey="currentEditField"
      :currentUserId="applicationData.userId"
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

export default {
  name: 'ViewScholarDrawer',
  components: {
    FindUser,
    ShowProfits,
  },
  setup(_, { expose }) {
    const { t } = useI18n();
    const drawerVisible = ref(false);
    const applicationData = ref(null);
    const store = useStore();

    const currentUserRoleId = computed(() => store.roleId);

    const showDrawer = (data) => {
      applicationData.value = data;
      drawerVisible.value = true;
    };

    const closeDrawer = () => {
      drawerVisible.value = false;
      applicationData.value = null;
    };

    const formatCurrency = (value) => value != null ? `${Number(value).toLocaleString()} ${applicationData.value?.currency}` : '-';
    const formatDate = (value) => value ? new Date(value).toLocaleString() : '-';

    const groupProfitsByCurrency = (profits) => {
      if (!profits) return {};
      return profits.reduce((acc, profit) => {
        const currency = profit.currency || 'Unknown';
        acc[currency] = (acc[currency] || 0) + (profit.profit || 0);
        return acc;
      }, {});
    };

    const formatGroupedProfits = (profits) => {
      return Object.entries(profits)
        .map(([currency, amount]) => `${currency}: ${Number(amount).toLocaleString()}`)
        .join('<br>');
    };

    const roleIdToChinese = (roleId) => {
      const roles = {
        1: '管理员',
        2: '主管',
        3: '销售',
        4: '高阶学员',
        5: '中阶学员',
        6: '初阶学员',
        7: '投手',
        8: '财务',
        9: '导师'
      };
      return roles[roleId] || '未知';
    };
    
    const leftMainData = computed(() => {
      const profits1 = groupProfitsByCurrency(applicationData.value?.profits1);
      return [
        { key: 'userId', label: t('ViewScholarDrawer.fields.userId'), value: applicationData.value?.userId || '-' },
        { key: 'fullname', label: t('ViewScholarDrawer.fields.fullname'), value: applicationData.value?.fullname || '-' },
        { key: 'regionName', label: t('ViewScholarDrawer.fields.regionName'), value: applicationData.value?.regionName || '-' },
        { key: 'platformId', label: t('ViewScholarDrawer.fields.platformId'), value: applicationData.value?.platformId || '-' },
        { key: 'inviterFullname', label: t('ViewScholarDrawer.fields.inviterFullname'), value: applicationData.value?.inviterFullname || '-' },
        { key: 'managerFullname', label: t('ViewScholarDrawer.fields.managerFullname'), value: applicationData.value?.managerFullname },
        { key: 'teacherFullname', label: t('ViewScholarDrawer.fields.teacherFullname'), value: applicationData.value?.teacherFullname },
        { key: 'projectAmountSum', label: "项目总金额", value: formatCurrency(applicationData.value?.projectAmountSum) },
        { key: 'inviteCount', label: t('ViewScholarDrawer.fields.inviteCount'), value: applicationData.value?.inviteCount || '-' },
        { key: 'profits1', label: t('ViewScholarDrawer.fields.profits1'), value: formatGroupedProfits(profits1), isLink: applicationData.value?.profits1.length > 0 },
        { key: 'platformTotalRevenue', label: t('ViewScholarDrawer.fields.platformTotalRevenue'), value: formatCurrency(applicationData.value?.platformTotalRevenue) },
        { key: 'platformTotalWithdrawal', label: t('ViewScholarDrawer.fields.platformTotalWithdrawal'), value: formatCurrency(applicationData.value?.platformTotalWithdrawal) },
        { key: 'createdAt', label: t('ViewScholarDrawer.fields.createdAt'), value: formatDate(applicationData.value?.createdAt) },
      ];
    });

    const rightMainData = computed(() => {
      const profits2 = groupProfitsByCurrency(applicationData.value?.profits2);
      return [
        { key: 'username', label: t('ViewScholarDrawer.fields.username'), value: applicationData.value?.username || '-' },
        { key: 'roleId', label: t('ViewScholarDrawer.fields.roleId'), value: roleIdToChinese(applicationData.value?.roleId) },
        { key: 'currency', label: t('ViewScholarDrawer.fields.currency'), value: applicationData.value?.currency || '-' },
        { key: 'invitationCode', label: t('ViewScholarDrawer.fields.platformCode'), value: applicationData.value?.invitationCode || '-' },
        { key: 'inviterName', label: t('ViewScholarDrawer.fields.inviterName'), value: applicationData.value?.inviterName || '-' },
        { key: 'managerName', label: t('ViewScholarDrawer.fields.managerName'), value: applicationData.value?.managerName || '-' },
        { key: 'teacherName', label: t('ViewScholarDrawer.fields.teacherName'), value: applicationData.value?.teacherName || '-' },
        { key: 'paidStr', label: "已缴纳学费", value: applicationData.value?.paidStr },
        { key: 'platformInviteCount', label: t('ViewScholarDrawer.fields.platformInviteCount'), value: applicationData.value?.platformInviteCount || '-' },
        { key: 'profits2', label: t('ViewScholarDrawer.fields.profits2'), value: formatGroupedProfits(profits2), isLink: applicationData.value?.profits1.length > 0 },
        { key: 'platformRevenueBalance', label: t('ViewScholarDrawer.fields.platformRevenueBalance'), value: formatCurrency(applicationData.value?.platformRevenueBalance) },
        { key: 'platformMoney', label: t('ViewScholarDrawer.fields.platformMoney'), value: formatCurrency(applicationData.value?.platformMoney) },
        { key: 'updatedAt', label: t('ViewScholarDrawer.fields.updatedAt'), value: formatDate(applicationData.value?.updatedAt) },
      ];
    });

    // 判断某个字段是否可编辑
    const isEditable = (fieldKey) => {
      const editableFields = ['managerName', 'teacherName', 'fullname', 'tiktokAccount', 'status'];
      return currentUserRoleId.value === 1 && editableFields.includes(fieldKey);
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
          changeForm.value = { [changeField.value]: applicationData.value[fieldKey] };
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
            userId: applicationData.value.userId,
            // 仅包含被编辑的字段
            [changeField.value]: changeForm.value[changeField.value],
          };

          try {
            const success = await updateUser(updateData);
            if (success) {
              // 刷新数据
              const response = await searchusers({ userId: applicationData.value.userId });
              if (response && response.data) {
                applicationData.value = response.data.data.content[0];
              }
              // 关闭对话框
              changeDialogVisible.value = false;
              // 可选：显示成功提示
              ElMessage.success(t('ViewScholarDrawer.messages.updateSuccess'));
            } else {
              // 处理更新失败的情况
              ElMessage.error(t('ViewScholarDrawer.messages.updateFailed'));
            }
          } catch (error) {
            // 处理错误
            ElMessage.error(t('ViewScholarDrawer.messages.updateFailed'));
          }
        }
      });
    };

    // 处理 FindUser 的成功回调
    const handleFindUserSuccess = (userData) => {
      // userData 包含 userId, username, fullname
      if (currentEditField.value === 'managerName') {
        applicationData.value.managerFullname = userData.fullname;
        applicationData.value.managerName = userData.username;
        applicationData.value.managerId = userData.userId; // 假设需要保存 managerId
      } else if (currentEditField.value === 'teacherName') {
        applicationData.value.teacherFullname = userData.fullname;
        applicationData.value.teacherName = userData.username;
        applicationData.value.teacherId = userData.userId; // 假设需要保存 teacherId
      }
      ElMessage.success(t('ViewScholarDrawer.messages.updateSuccess'));
    };

    // Generic Dialog
    const showProfitsRef = ref(null);
    const profitsDialogTitle = ref('');
    const profitsDialogData = ref([]);

    const openProfitsDialog = (profitType) => {
      let data = [];

      if (profitType === 'profits1') {
        data = applicationData.value.profits1 || [];
        profitsDialogTitle.value = '一级分佣明细';
      } else if (profitType === 'profits2') {
        data = applicationData.value.profits2 || [];
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
      applicationData,
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
      openProfitsDialog,
      submitChange,
      getChangeComponent,
      resetChangeDialog,
      findUser, // 暴露 FindUser 的引用
      handleFindUserSuccess, // 处理回调
      currentEditField
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
