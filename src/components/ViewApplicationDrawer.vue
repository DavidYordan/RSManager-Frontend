<template>
  <el-drawer
    v-model="drawerVisible"
    :title="t('ViewApplicationDrawer.title')"
    :with-header="true"
    size="70%"
    direction="rtl"
    @close="closeDrawer"
  >
    <div v-if="applicationData" class="drawer-content">
      <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
        <!-- Main Data Tab -->
        <el-tab-pane :label="t('ViewApplicationDrawer.tabs.mainData')" name="mainData">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form label-width="120px" class="section">
                <el-form-item :label="t('ViewApplicationDrawer.fields.fullname')">
                  <span>{{ applicationData.fullname }}</span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.invitationCode')">
                  <span>{{ applicationData.invitationCode }}</span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.roleId')">
                  <span>{{ roleOptions[applicationData.roleId] }}</span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.regionName')">
                  <span>{{ applicationData.regionName }}</span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.projectName')">
                  <span>{{ applicationData.projectName }}</span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.paymentMethod')">
                  <span>{{ applicationData.paymentMethod }}</span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.rateA')">
                  <span>{{ applicationData.rateA }}</span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.managerFullname')">
                  <span>{{ applicationData.managerFullname }}</span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.inviterFullname')">
                  <span :style="{ color: applicationData.inviterFullname ? 'inherit' : 'red' }">
                    {{ applicationData.inviterFullname || t('ViewApplicationDrawer.fields.notEntered') }}
                  </span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.inviterCode')">
                  <span>{{ applicationData.inviterCode }}</span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.startDate')">
                  <span>{{ applicationData.startDate }}</span>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12">
              <el-form label-width="120px" class="section">
                <el-form-item :label="t('ViewApplicationDrawer.fields.username')">
                  <span>{{ applicationData.username }}</span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.tiktokAccount')">
                  <span>{{ applicationData.tiktokAccount }}</span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.processStatus')">
                  <span :style="{ color: processStatusColors[applicationData.processStatus] }">
                    {{ processStatusOptions[applicationData.processStatus] }}
                  </span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.currencyName')">
                  <span>{{ applicationData.currencyName }}</span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.projectAmount')">
                  <span>{{ formatCurrency(applicationData.projectAmount, applicationData.currencyName) }}</span>
                </el-form-item>
                <el-form-item label="已缴纳学费">
                  <span v-html="getPaidStr"></span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.rateB')">
                  <span>{{ applicationData.rateB }}</span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.managerName')">
                  <span>{{ applicationData.managerName }}</span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.inviterName')">
                  <span>{{ applicationData.inviterName == null ? applicationData.initInviterName : applicationData.inviterName }}</span>
                </el-form-item>
                <el-form-item label="用户ID">
                  <span>{{ applicationData.userId }}</span>
                </el-form-item>
                <el-form-item :label="t('ViewApplicationDrawer.fields.createdAt')">
                  <span>{{ applicationData.createdAt }}</span>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <!-- 新增：解析后的 actionStr 显示部分 -->
          <el-card v-if="canViewAction && Object.keys(actionData).length" class="action-data-card" style="margin-top: 20px;">
            <div slot="header">
              <span>变更情况</span>
            </div>
            <el-table :data="formattedActionData" :border="true">
              <el-table-column prop="field" label="字段" width="150"></el-table-column>
              <el-table-column prop="original" label="原始值"></el-table-column>
              <el-table-column prop="newValue" label="新值"></el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- Payment Records Tab -->
        <el-tab-pane label="支付记录" name="paymentRecords">
          <el-table
            :data="applicationData.applicationPaymentRecordDTOs"
            style="width: 100%"
            :border="true"
            stripe
            v-loading="isLoading"
          >
            <el-table-column prop="projectName" label="项目名称" ></el-table-column>
            <el-table-column prop="projectAmount" label="项目金额">
              <template #default="scope">
                {{ formatCurrency(scope.row.projectAmount, scope.row.projectCurrencyName) }}
              </template>
            </el-table-column>
            <el-table-column prop="paymentMethod" label="付款方式"></el-table-column>
            <el-table-column
              prop="paymentAmount"
              label="支付金额"
            >
              <template #default="scope">
                {{ formatCurrency(scope.row.paymentAmount, scope.row.currencyName) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="fee"
              label="手续费"
            >
              <template #default="scope">
                {{ formatCurrency(scope.row.fee, scope.row.currencyName) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="actual"
              label="实收金额"
            >
              <template #default="scope">
                {{ formatCurrency(scope.row.actual, scope.row.currencyName) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="paymentTime"
              label="付款日期"
            >
              <template #default="scope">
                {{ scope.row.paymentTime }}
              </template>
            </el-table-column>
            <el-table-column
              prop="paymentAccountStr"
              label="收款账户"
            >
              <template #default="scope">
                <span
                    @click="copyToClipboard(scope.row.paymentAccountStr)"
                    :style="{ cursor: 'pointer' }"
                    title="点击复制"
                >{{ scope.row.paymentAccountStr }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="审核状态"
            >
              <template #default="scope">
                <span :class="paymentStatusClass(scope.row.status)">
                  {{ scope.row.status ? "已审核" : "未审核" }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="comments" label="备注"></el-table-column>

            <el-table-column
              prop="paymentFileSummary"
              label="文件摘要"
            >
              <template #default="scope">
                <div v-if="scope.row.paymentFileSummary && scope.row.paymentFileSummary.fileCount > 0">
                  <span
                    v-for="(filePath, index) in scope.row.paymentFileSummary.filePaths"
                    :key="filePath"
                    style="display: block; margin-bottom: 5px;"
                  >
                    <el-link
                      type="primary"
                      href="javascript:void(0);"
                      @click="handleDownloadFile(scope.row, filePath)"
                      :loading="isDownloading(filePath)"
                    >
                      {{ getFileName(filePath) }}
                    </el-link>
                  </span>
                </div>
                <span v-else>没有可用的文件</span>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              width="120"
            >
              <template #default="scope">
                <div v-for="action in paymentActions(scope.row)" :key="action.name" style="margin-bottom: 5px;">
                  <el-button
                    :type="action.type"
                    size="small"
                    @click="confirmPaymentAction(action.name, scope.row)"
                  >
                    {{ action.label }}
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- Contract Records Tab -->
        <el-tab-pane :label="t('ViewApplicationDrawer.tabs.contracts')" name="contracts">
          <div v-if="contractFiles.length > 0">
            <el-table
              :data="contractFiles"
              style="width: 100%"
              :border="true"
              stripe
              v-loading="isLoading"
            >
              <el-table-column
                prop="filePath"
                :label="t('ViewApplicationDrawer.fields.filePath')"
              >
                <template #default="scope">
                  <el-link
                  type="primary"
                  @click="handleDownloadFile(_, scope.row.filePath)"
                >
                    {{ getFileName(scope.row.filePath) }}
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else>
            {{ t('ViewApplicationDrawer.noFiles') }}
          </div>
        </el-tab-pane>

        <!-- Process Flow Tab -->
        <el-tab-pane :label="t('ViewApplicationDrawer.tabs.flowRecords')" name="flowRecords">
          <el-table
            :data="applicationData.applicationFlowRecordDTOs"
            style="width: 100%"
            :border="true"
            stripe
          >
            <el-table-column
              prop="action"
              label="操作"
            ></el-table-column>
            <el-table-column
              prop="createrFullname"
              label="执行人"
            ></el-table-column>
            <el-table-column
              prop="createdAt"
              label="执行时间"
            >
              <template #default="scope">
                {{ scope.row.createdAt }}
              </template>
            </el-table-column>
            <el-table-column
              prop="comments"
              label="备注"
            ></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <span slot="footer" class="drawer-footer">
      <template v-if="applicationData">
        <template v-for="action in availableActions" :key="action.name">
          <el-button
            :type="action.type"
            @click="confirmAction(action.name)"
          >
            {{ action.label }}
          </el-button>
        </template>
      </template>
      <el-button @click="closeDrawer">
        {{ t('ViewApplicationDrawer.actions.close') }}
      </el-button>
    </span>

    <!-- Image Preview Dialog -->
    <el-dialog
      :title="t('ViewApplicationDrawer.dialogs.imagePreviewTitle')"
      v-model="imagePreviewVisible"
      width="60%"
      :before-close="() => { imagePreviewVisible = false; imagePreviewUrl = '' }"
      :style="{ maxWidth: '90vw', maxHeight: '90vh' }"
    >
      <el-image
        :src="imagePreviewUrl"
        fit="contain"
        style="width: 100%; height: 100%;"
      ></el-image>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveImage">{{ t('ViewApplicationDrawer.actions.save') }}</el-button>
        <el-button @click="imagePreviewVisible = false">{{ t('ViewApplicationDrawer.actions.close') }}</el-button>
      </span>
    </el-dialog>

    <!-- 合同上传对话框 -->
    <el-dialog
      :title="t('ViewApplicationDrawer.dialogs.uploadContractTitle')"
      v-model="contractDialogVisible"
      width="50%"
      :before-close="closeContractDialog"
    >
      <el-upload
        ref="contractUploadRef"
        :file-list="contractFileList"
        :on-change="handleContractFileChange"
        :on-remove="handleContractFileRemove"
        :before-upload="beforeContractUpload"
        :auto-upload="false"
        drag
        multiple
      >
        <el-button type="primary">{{ t('ViewApplicationDrawer.actions.selectContract') }}</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeContractDialog">{{ t('ViewApplicationDrawer.actions.appCancel') }}</el-button>
        <el-button type="primary" @click="submitContractUpload">{{ t('ViewApplicationDrawer.actions.upload') }}</el-button>
      </span>
    </el-dialog>

    <!-- AddPayment Component -->
    <AddPayment
      v-if="applicationData"
      ref="addPaymentRef"
      @paymentAdded="handlePaymentAdded"
      :processId="processId"
      :currentRegionName="applicationData.regionName"
      :currentCurrencyName="applicationData.currencyName"
      :currentProjectName="actionData.projectName || applicationData.projectName"
      :currentProjectAmount="actionData.projectAmount || applicationData.projectAmount"
      :currentPaymentMethod="actionData.paymentMethod || applicationData.paymentMethod"
    />

    <!-- EditPayment Component -->
    <EditPayment
      v-if="currentPaymentRecord"
      ref="editPaymentRef"
      @paymentEdited="handlePaymentEdited"
      :processId="processId"
      :paymentData="currentPaymentRecord"
    />

    <!-- EnrollEdit Dialog -->
    <EnrollEdit
      v-if="applicationData"
      ref="enrollEditRef"
      @enrollEditSubmitted="handleEnrollEditSubmitted"
      :applicationData="applicationData"
    />

    <!-- EditRole Dialog -->
    <EditRole
      v-if="applicationData"
      ref="editRoleRef"
      @roleEdited="handleRoleEdited"
      :applicationData="applicationData"
    />

    <!-- AddRole Dialog -->
    <AddRole
      v-if="applicationData"
      ref="addRoleRef"
      @roleEdited="handleAddRoled"
      :applicationData="applicationData"
    />

    <!-- Request Link Dialog -->
    <RequestLink
      v-if="processId"
      ref="requestLinkRef"
      @linkSubmitted="handleLinkSubmitted"
      :processId="processId"
    />

  </el-drawer>
</template>

<script>
import { ref, nextTick, computed, reactive } from 'vue';
import { useStore } from '../store/index.js';
import { useI18n } from 'vue-i18n';
import {
  approvePaymentRecord,
  deletePaymentRecord,
  activateApplication,
  getApplicationInfo,
  submitApplication,
  withdrawApplication,
  cancelApplication,
  finishedApplication,
  archiveApplication,
  approveFinanceApplication,
  approveLinkApplication,
  getAllFilesSummary,
  downloadFile,
  uploadContractFile,
  addRoleEditing as apiAddRoleEditing,
  upgradeRoleEditing as apiUpgradeRoleEditing,
  cancelRoleEditing as apiCancelRoleEditing,
  saveAddRoleEditing as apiSaveAddRoleEditing,
  saveUpgradeRoleEditing as apiSaveUpgradeRoleEditing,
  submitAddRoleUpgrade as apiSubmitAddRoleUpgrade,
  submitUpgradeRoleUpgrade as apiSubmitUpgradeRoleUpgrade,
  approveRoleAddByFinance as apiApproveRoleAddByFinance,
  approveRoleUpgradeByFinance as apiApproveRoleUpgradeByFinance
} from '@/api/application';
import { ElMessage, ElMessageBox } from 'element-plus';
import AddPayment from '@/components/AddPayment.vue';
import EditPayment from '@/components/EditPayment.vue';
import EnrollEdit from '@/components/EnrollEdit.vue';
import EditRole from '@/components/EditRole.vue';
import AddRole from '@/components/AddRole.vue';
import RequestLink from '@/components/RequestLink.vue';

export default {
  name: 'ViewApplicationDrawer',
  components: { AddPayment, EditPayment, EnrollEdit, EditRole, AddRole, RequestLink },
  setup(_, { emit, expose }) {
    const { t } = useI18n();
    const drawerVisible = ref(false);
    const applicationData = ref(null);
    const processId = ref(null);
    const activeTab = ref('mainData');
    const actionData = ref({});
    const canViewAction = ref(false);

    const isDialogVisible = ref(false);

    // Image Preview Dialog
    const imagePreviewVisible = ref(false);
    const imagePreviewUrl = ref('');
    const imageOriginalFileName = ref('');
    const isSaving = ref(false);

    // 用于追踪正在下载的文件
    const downloadingFiles = reactive(new Set());

    const store = useStore();

    const isLoading = ref(false);

    const addPaymentRef = ref(null);
    const editPaymentRef = ref(null);
    const enrollEditRef = ref(null);
    const editRoleRef = ref(null);
    const addRoleRef = ref(null);
    const requestLinkRef = ref(null);

    // 合同上传对话框的状态
    const MAX_TOTAL_SIZE = 300 * 1024 * 1024;
    const contractDialogVisible = ref(false);
    const contractFileList = ref([]);
    const contractUploadRef = ref(null);

    // 当前选中的支付记录
    const currentPaymentRecord = ref(null)

    const roleOptions = {
      '4': '高阶学员',
      '5': '中阶学员',
      '6': '初阶学员'
    };

    // 判断文件是否正在下载
    const isDownloading = (filePath) => {
      return downloadingFiles.has(filePath);
    };

    // 打开合同上传对话框
    const uploadContract = () => {
      contractDialogVisible.value = true;
    };

    // 关闭合同上传对话框
    const closeContractDialog = () => {
      contractDialogVisible.value = false;
      contractFileList.value = [];
      if (contractUploadRef.value) {
        contractUploadRef.value.clearFiles();
      }
    };

    // 处理合同文件选择变化
    const handleContractFileChange = (file, fileList) => {
      contractFileList.value = fileList;
    };

    // 处理合同文件移除
    const handleContractFileRemove = (file, fileList) => {
      contractFileList.value = fileList;
    };

    // 在文件添加到列表前检查总大小
    const beforeContractUpload = (file) => {
      const totalSize = contractFileList.value.reduce((sum, current) => sum + current.size, 0) + file.size;
      if (totalSize > MAX_TOTAL_SIZE) {
        ElMessage.warning(t('ViewApplicationDrawer.messages.totalSizeExceed'));
        return false;
      }
      return true;
    };

    // 提交合同上传
    const submitContractUpload = async () => {
      if (contractFileList.value.length === 0) {
        ElMessage.warning(t('ViewApplicationDrawer.messages.noContractSelected'));
        return;
      }

      const formData = new FormData();
      formData.append('processId', processId.value);
      contractFileList.value.forEach((fileItem) => {
        formData.append('files', fileItem.raw);
      });

      try {
        const response = await uploadContractFile(formData);
        if (response.data.success) {
          ElMessage.success(t('ViewApplicationDrawer.messages.contractUploaded'));
          closeContractDialog();
          await showDrawer(processId.value, 'contracts'); // 刷新合同标签页
        } else {
          console.log(response.data.message || t('ViewApplicationDrawer.errors.uploadContractFailed'));
        }
      } catch (error) {
        console.error(error);
      }
    };


    const paymentStatusAllTrue = computed(() => {
      if (!applicationData.value) return false;
      if (!applicationData.value.applicationPaymentRecordDTOs) return false;
      return applicationData.value.applicationPaymentRecordDTOs.every(payment => payment.status);
    });

    const paymentActions = (payment) => {
      if (payment.status) {
        return [];
      }

      if (applicationData.value.processStatus === 1 || applicationData.value.processStatus === 97) {
        if ([1, 2, 3].includes(store.roleId)) {
          return [
            { name: 'editPayment', label: "编辑", type: 'primary' },
            { name: 'deletePayment', label: t('ViewApplicationDrawer.actions.deletePayment'), type: 'danger' },
          ];
        } else {
          return [];
        }
      } else if (applicationData.value.processStatus === 2 || applicationData.value.processStatus === 98) {
        if ([1, 8].includes(store.roleId)) {
          return [
            { name: 'approvePayment', label: t('ViewApplicationDrawer.actions.approvePayment'), type: 'success' },
          ];
        } else {
          return [];
        }
      } else if (applicationData.value.processStatus === 5) {
        if ([1].includes(store.roleId)) {
          return [
            { name: 'editPayment', label: "编辑", type: 'primary' },
            { name: 'approvePayment', label: t('ViewApplicationDrawer.actions.approvePayment'), type: 'success' },
            { name: 'deletePayment', label: t('ViewApplicationDrawer.actions.deletePayment'), type: 'danger' },
          ];
        } else if ([2, 3].includes(store.roleId)) {
          return [
            { name: 'editPayment', label: "编辑", type: 'primary' },
            { name: 'deletePayment', label: t('ViewApplicationDrawer.actions.deletePayment'), type: 'danger' },
          ];
        } else if ([8].includes(store.roleId)) {
          return [
            { name: 'approvePayment', label: t('ViewApplicationDrawer.actions.approvePayment'), type: 'success' },
          ];
        } else {
          return [];
        }
      } else {
        return [];
      }
    };

    // Handle actions with confirmation
    const confirmPaymentAction = (action, payment) => {
      if (['editPayment'].includes(action)) {
        openEditPaymentDialog(payment);
        return;
      }
      const actionTexts = {
        approvePayment: "审核支付记录",
        deletePayment: "删除支付记录"
      };
      ElMessageBox.prompt(
        "请输入备注",
        "您确定要执行此操作吗？",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          showInput: true,
          inputPlaceholder: "请输入备注",
          inputValue: actionTexts[action]
        }
      )
        .then(() => {
          handlePaymentAction(action, payment, actionTexts[action]);
        })
        .catch(() => {
          // User canceled
        });
    };

    // Handle confirmed actions
    const handlePaymentAction = async (action, payment, comments) => {
      try {
        let response;
        const params = { processId: processId.value, paymentId: payment.paymentId, comments }; 
        switch (action) {
          case 'approvePayment':
            response = await approvePaymentRecord(params);
            break;
          case 'deletePayment':
            response = await deletePaymentRecord(params);
            break;
          default:
            return;
        }
        if (response.data.success) {
          ElMessage.success(t(`ViewApplicationDrawer.messages.${action}Success`));
          await showDrawer(processId.value, 'paymentRecords');
        } else {
          console.log(
            response.data.message || t('ViewApplicationDrawer.errors.actionFailed')
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    const availableActions = computed(() => {
      if (!applicationData.value) return [];

      if (activeTab.value === 'mainData') {
        switch (applicationData.value.processStatus) { // Changed from statusValue to processStatus based on response data
          case 0: // activate
            if ([1, 3].includes(store.roleId)) {
              return [
                { name: 'activate', label: t('ViewApplicationDrawer.actions.activate'), type: 'success' },
              ];
            } else {
              return [];
            }
          case 1: // editing
            if ([1, 3].includes(store.roleId)) {
              return [
                { name: 'appSubmit', label: t('ViewApplicationDrawer.actions.appSubmit'), type: 'success' },
                { name: 'enrollEdit', label: t('ViewApplicationDrawer.actions.enrollEdit'), type: 'primary' },
                { name: 'appCancel', label: t('ViewApplicationDrawer.actions.appCancel'), type: 'danger' },
              ];
            } else {
              return [];
            }
          case 2: // 财务审核中
            if ([1, 8].includes(store.roleId)) {
              if (paymentStatusAllTrue.value) {
                return [
                  { name: 'approveFinance', label: t('ViewApplicationDrawer.actions.approveFinance'), type: 'success' },
                  { name: 'withdraw', label: t('ViewApplicationDrawer.actions.withdraw'), type: 'warning' }
                ];
              } else {
                return [
                  { name: 'withdraw', label: t('ViewApplicationDrawer.actions.withdraw'), type: 'warning' }
                ];
              }
            } else if ([3].includes(store.roleId)) {
              return [
                { name: 'withdraw', label: t('ViewApplicationDrawer.actions.withdraw'), type: 'warning' }
              ];
            } else {
              return [];
            }
          case 3: // 申请链接中
            if ([1, 3].includes(store.roleId)) {
              return [
                { name: 'requestLink', label: t('ViewApplicationDrawer.actions.requestLink'), type: 'success' }
              ];
            } else {
              return [];
            }
          case 4: // 管理审核中
            if ([1, 2].includes(store.roleId)) {
              return [
                { name: 'linkApprove', label: t('ViewApplicationDrawer.actions.linkApprove'), type: 'success' },
                { name: 'withdraw', label: t('ViewApplicationDrawer.actions.withdraw'), type: 'warning' }
              ];
            } else if ([3].includes(store.roleId)) {
              return [
                { name: 'withdraw', label: t('ViewApplicationDrawer.actions.withdraw'), type: 'warning' }
              ];
            } else {
              return [];
            }
          case 5: // paying
            if ([1, 2].includes(store.roleId)) {
                return [
                  { name: 'finished', label: t('ViewApplicationDrawer.actions.finished'), type: 'info' },
                  { name: 'updateRoleEditing', label: "升级角色", type: 'warning' },
                  { name: 'addRole', label: "补充角色", type: 'info' }
                ];
            } else if ([3].includes(store.roleId)) {
              return [
                { name: 'updateRoleEditing', label: "升级角色", type: 'warning' },
                { name: 'addRole', label: "补充角色", type: 'info' }
              ];
            } else {
              return [];
            }
          case 6: // 已完成
            if ([1, 2].includes(store.roleId)) {
              return [
                { name: 'archive', label: t('ViewApplicationDrawer.actions.archive'), type: 'info' },
                { name: 'updateRoleEditing', label: "升级角色", type: 'warning' },
                { name: 'addRole', label: "补充角色", type: 'info' }
              ];
            } else if ([3].includes(store.roleId)) {
              return [
                { name: 'updateRoleEditing', label: "升级角色", type: 'warning' },
                { name: 'addRole', label: "补充角色", type: 'info' }
              ];
            } else {
              return [];
            }
          case 7: // 已归档
            if ([1, 2, 3].includes(store.roleId)) {
              return [
                { name: 'updateRoleEditing', label: "升级角色", type: 'warning' },
                { name: 'addRole', label: "补充角色", type: 'info' }
              ];
            } else {
              return [];
            }
          case 97: // 升级角色编辑中
            if ([1, 2, 3].includes(store.roleId)) {
              return [
                { name: 'editRole', label: "编辑", type: 'primary' },
                { name: 'submitRoleUpgrade', label: "提交审核", type: 'success' },
                { name: 'cancelUpdateRoleEditing', label: "取消升级", type: 'warning' }
              ];
            } else {
              return [];
            }
          case 98: // 升级角色财务审核中
            if ([1, 8].includes(store.roleId)) {
              if (paymentStatusAllTrue.value) {
                return [
                  { name: 'approveRoleUpgradeByFinance', label: "批准升级", type: 'success' },
                  { name: 'withdraw', label: "撤回", type: 'warning' }
                ];
              } else {
                return [
                  { name: 'withdraw', label: "撤回", type: 'warning' }
                ];
              }
            } else {
              return [];
            }
          case 99: // 升级角色审核中
            if ([1, 2].includes(store.roleId)) {
              return [
                { name: 'approveRoleUpgradeByManager', label: "批准升级", type: 'success' },
                { name: 'withdraw', label: "撤回", type: 'warning' }
              ];
            } else {
              return [];
            }
          case 100: //补充角色审核中
            if ([1, 2].includes(store.roleId)) {
              return [
                { name: 'approveAddRole', label: "批准补充", type: 'success' },
                { name: 'cancelUpdateRoleEditing', label: "取消补充", type: 'warning' }
              ];
            } else {
              return [];
            }
          default:
            return [];
        }
      } else if (activeTab.value === 'paymentRecords') {
        if ([1, 5, 97].includes(applicationData.value.processStatus) && [1, 2, 3].includes(store.roleId)) {
          return [
            { name: 'addPayment', label: t('ViewApplicationDrawer.actions.addPayment'), type: 'primary' }
          ];
        } else {
          return [];
        }
      } else if (activeTab.value === 'contracts') {
        return [
          { name: 'uploadContract', label: t('ViewApplicationDrawer.actions.uploadContract'), type: 'primary' }
        ];
      } else {
        return [];
      }
    });

    // Show Drawer
    const showDrawer = async (id, tab = 'mainData') => {
      drawerVisible.value = true;
      processId.value = id;
      activeTab.value = tab
      try {
        const response = await getApplicationInfo({ processId: id });
        if (response.data.success) {
          applicationData.value = response.data.data;
          handleProcessStatusAndActionStr(applicationData.value);
          emit('update', applicationData.value);
          // Pre-fetch file summaries for payments and contracts
          await fetchAllFileSummaries();
        } else {
          drawerVisible.value = false;
        }
      } catch (error) {
        console.error(error);
        drawerVisible.value = false;
      }
    };

    const handleProcessStatusAndActionStr = (data) => {
      const validStatuses = [97, 98, 99, 100];
      if (validStatuses.includes(data.processStatus) && data.actionStr) {
        canViewAction.value = true;
        try {
          const parsedActionData = JSON.parse(data.actionStr);
          actionData.value = parsedActionData;
        } catch (error) {
          console.error('Failed to parse actionStr:', error);
        }
      } else {
        canViewAction.value = false;
        actionData.value = {};
      }
    };

    // 计算解析后的 actionData 以便在表格中展示
    const formattedActionData = computed(() => {
      if (!actionData.value || Object.keys(actionData.value).length === 0) {
        return [];
      }

      const data = [];

      // 定义需要展示的字段及其标签（可根据需要调整）
      const fields = {
        roleId: '角色',
        projectName: '项目名称',
        projectAmount: '项目金额',
        rateA: '费率 A',
        rateB: '费率 B',
        paymentMethod: '支付方式',
        startDate: '开始日期'
      };
    
      for (const field in fields) {
        if (actionData.value.hasOwnProperty(field)) {
          let originalValue = applicationData.value[field];
          let newValue = actionData.value[field];

          // 特殊处理 roleId
          if (field === 'roleId') {
            originalValue = roleOptions[originalValue] || originalValue;
            newValue = roleOptions[newValue] || newValue;
          }

          // 特殊处理货币字段
          if (['projectAmount'].includes(field)) {
            originalValue = formatCurrency(originalValue, applicationData.value.currencyName);
            newValue = formatCurrency(newValue, applicationData.value.currencyName);
          }

          // 其他字段按需处理
          if (['rateA', 'rateB'].includes(field)) {
            // 保持原始格式，如 "*0.95*0.4"
            originalValue = originalValue;
            newValue = newValue;
          }

          if (field === 'startDate') {
            // 格式化日期或保持原样
            originalValue = originalValue;
            newValue = newValue;
          }

          data.push({
            field: fields[field],
            original: originalValue,
            newValue: newValue
          });
        }
      }

      return data;
    });

    // Fetch file summaries for all payment and contract records
    const fetchAllFileSummaries = async () => {
      if (!applicationData.value) return;

      // Gather payment IDs
      const paymentIds = applicationData.value.applicationPaymentRecordDTOs
        ? applicationData.value.applicationPaymentRecordDTOs.map(payment => payment.paymentId)
        : [];

      try {
        // Fetch file summaries with processId and list of paymentIds
        const response = await getAllFilesSummary({
          processId: processId.value,
          paymentIds: paymentIds
        });

        if (response.data.success) {
          // Map summaries back to payment records based on paymentId
          const paymentsSummaryDTOs = response.data.data.paymentsSummaryDTOs;
          applicationData.value.applicationPaymentRecordDTOs.forEach(payment => {
            // Find the corresponding summary by paymentId
            const summary = paymentsSummaryDTOs.find(dto => dto.paymentId === payment.paymentId);
            payment.paymentFileSummary = summary
              ? { fileCount: summary.fileCount, filePaths: summary.filePaths }
              : { fileCount: 0, filePaths: [] };
          });

          // **处理合同文件摘要**
          const contractSummaryDTO = response.data.data.contractSummaryDTO;
          applicationData.value.contractFileSummary = contractSummaryDTO
            ? { fileCount: contractSummaryDTO.fileCount, filePaths: contractSummaryDTO.filePaths }
            : { fileCount: 0, filePaths: [] };

        } else {
          applicationData.value.applicationPaymentRecordDTOs.forEach(payment => {
            payment.paymentFileSummary = { fileCount: 0, filePaths: [] };
          });
          applicationData.value.contractFileSummary = { fileCount: 0, filePaths: [] };
        }
      } catch (error) {
        console.error('Failed to fetch file summaries', error);
        applicationData.value.applicationPaymentRecordDTOs.forEach(payment => {
          payment.paymentFileSummary = { fileCount: 0, filePaths: [] };
        });
        applicationData.value.contractFileSummary = { fileCount: 0, filePaths: [] };
      }

      await nextTick(); // Ensure the DOM updates
    };

    const contractFiles = computed(() => {
      if (
        applicationData.value &&
        applicationData.value.contractFileSummary &&
        applicationData.value.contractFileSummary.filePaths
      ) {
        return applicationData.value.contractFileSummary.filePaths.map(path => ({ filePath: path }));
      } else {
        return [];
      }
    });

    const closeDrawer = () => {
      drawerVisible.value = false;
      applicationData.value = null;
    };

    const openAddPaymentDialog = () => {
      if (addPaymentRef.value) {
        addPaymentRef.value.openDialog();
      }
    };

    const openEditPaymentDialog = (payment) => {
      currentPaymentRecord.value = payment;
      if (editPaymentRef.value) {
        editPaymentRef.value.openDialog();
      }
    };

    // Format currencyName
    const formatCurrency = (value, currencyName) => {
      if (value === null || value === undefined) {
        return '-';
      }
      return `${Number(value).toLocaleString()} ${currencyName}`;
    };

    const paymentStatusClass = (status) => {
      return status ? 'status-paid' : 'status-unpaid';
    };

    // Handle actions with confirmation
    const confirmAction = (action) => {
      if (['addPayment', 'enrollEdit', 'editRole', 'addRole', 'requestLink', 'uploadContract'].includes(action)) {
        handleAction(action);
        return;
      }
      const actionTexts = {
        appSubmit: "提交财务审核",
        withdraw: "退回申请",
        appCancel: "取消申请",
        archive: "归档",
        approveFinance: "财务审核通过",
        linkApprove: "链接审核通过",
        finished: "完成",
        activate: "激活",
        updateRoleEditing: "切换为角色升级状态",
        submitRoleUpgrade: "提交审核",
        approveRoleUpgradeByFinance: "财务审核通过",
        approveRoleUpgradeByManager: "管理审核通过",
        addRole: "补充历史角色",
        approveAddRole: "审核历史角色",
        cancelUpdateRoleEditing: "取消升级"
      };
      ElMessageBox.prompt(
        "请输入备注",
        "您确定要执行此操作吗？",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          showInput: true,
          inputPlaceholder: "请输入备注",
          inputValue: actionTexts[action]
        }
      )
        .then(() => {
          handleAction(action, actionTexts[action]);
        })
        .catch(() => {
          // User canceled
        });
    };

    // Handle confirmed actions
    const handleAction = async (action, comments) => {
      try {
        let response;
        const params = { processId: processId.value, comments }; 
        switch (action) {
          case 'activate':
            response = await activateApplication(params);
            break;
          case 'appSubmit':
            response = await submitApplication(params);
            break;
          case 'withdraw':
            response = await withdrawApplication(params);
            break;
          case 'appCancel':
            response = await cancelApplication(params);
            break;
          case 'approveFinance':
            response = await approveFinanceApplication(params);
            break;
          case 'addPayment': 
            if (addPaymentRef.value) {
              addPaymentRef.value.openDialog();
            }
            return;
          case 'enrollEdit':
            if (enrollEditRef.value) {
              enrollEditRef.value.openDialog();
            }
            return;
          case 'requestLink':
            if (requestLinkRef.value) {
              requestLinkRef.value.openDialog();
            }
            return;
          case 'uploadContract':
            contractDialogVisible.value = true;
            return;
          case 'linkApprove':
            response = await approveLinkApplication(params);
            break;
          case 'finished':
            response = await finishedApplication(params);
            break;
          case 'archive':
            response = await archiveApplication(params);
            break;
          case 'updateRoleEditing':
            response = await apiUpdateRoleEditing(params);
            break;
          case 'cancelUpdateRoleEditing':
            response = await apiCancelUpdateRoleEditing(params);
            break;
          case 'submitRoleUpgrade':
            response = await apiSubmitRoleUpgrade(params);
            break;
          case 'approveRoleUpgradeByFinance':
            response = await apiApproveRoleUpgradeByFinance(params);
            break;
          case 'approveRoleUpgradeByManager':
            response = await apiApproveRoleUpgradeByManager(params);
            break;
          case 'editRole':
            if (editRoleRef.value) {
              editRoleRef.value.openDialog();
            }
            return;
          case 'addRole':
            if (addRoleRef.value) {
              addRoleRef.value.openDialog();
            }
            return;
          case 'approveAddRole':
            response = await apiApproveAddRole(params);
            break;
          default:
            return;
        }
        if (response.data.success) {
          ElMessage.success(t(`ViewApplicationDrawer.messages.${action}Success`));
          await showDrawer(processId.value);
        } else {
          console.log(
            response.data.message || t('ViewApplicationDrawer.errors.actionFailed')
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    // 新增的保存图片方法
    const saveImage = () => {
      if (!imagePreviewUrl.value) {
        ElMessage.error(t('ViewApplicationDrawer.errors.noImageToSave'));
        return;
      }

      isSaving.value = true;

      // 创建一个临时的a标签用于下载
      const link = document.createElement('a');
      link.href = imagePreviewUrl.value;

      // 从URL中提取文件名
      let filename = imageOriginalFileName.value;
      
      // 如果URL中没有文件名，使用默认名称
      if (!filename) {
        filename = 'download';
      }

      // 设置下载属性
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      ElMessage.success(t('ViewApplicationDrawer.messages.imageSaved'));
    };

    // 关闭图片预览对话框时清理相关数据
    const closeImagePreviewDialog = () => {
      imagePreviewVisible.value = false;
      imagePreviewUrl.value = '';
      imageOriginalFileName.value = '';
    };

    // Download and handle file
    const handleDownloadFile = async (record, filePath) => {
      isLoading.value = true;

      if (isDownloading(filePath)) {
        return; // 防止重复点击
      }

      downloadingFiles.add(filePath);

      try {
        const pathParts = filePath.split('/');
        const fileName = pathParts.pop();
        const targetDir = pathParts.join('/'); 
        const response = await downloadFile({ targetDir, fileName }, { responseType: 'blob' });
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);
        const fileExtension = fileName.split('.').pop().toLowerCase();

        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        const supportedImage = imageExtensions.includes(fileExtension);

        if (supportedImage) {
          imageOriginalFileName.value = fileName;
          // Open image in Element Plus dialog
          imagePreviewUrl.value = url;
          imagePreviewVisible.value = true;
        } else {
          // Create a link to download the file
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          ElMessage.success(t('ViewApplicationDrawer.messages.downloadSuccess'));
        }
      } catch (error) {
        console.error(error);
        ElMessage.error(t('ViewApplicationDrawer.messages.downloadFailed'));
      } finally {
        isLoading.value = false;
        downloadingFiles.delete(filePath);
      }
    };

    const getPaidStr = computed(() => {
      if (!applicationData.value || !applicationData.value.applicationPaymentRecordDTOs) {
        return "0";
      }

      const grouped = applicationData.value.applicationPaymentRecordDTOs.reduce((acc, payment) => {
        const currencyName = payment.currencyName;
        acc[currencyName] = (acc[currencyName] || 0) + payment.paymentAmount;
        return acc;
      }, {});

      return Object.entries(grouped)
        .map(([currencyName, total]) => `${total} ${currencyName}`)
        .join("<br>");
    });

    // Get file name from path
    const getFileName = (filePath) => {
      const parts = filePath.split('/');
      return parts[parts.length - 1];
    };

    // Expose showDrawer method to parent component
    expose({ showDrawer });

    // Handle adding a new payment record
    const handlePaymentAdded = async () => {
      ElMessage.success(t('ViewApplicationDrawer.messages.paymentAdded'));
      await showDrawer(processId.value, 'paymentRecords');
    };

    // Handle editing a payment record
    const handlePaymentEdited = async () => {
      ElMessage.success("支付记录已更新");
      await showDrawer(processId.value, 'paymentRecords');
    };

    // Handle editing application data
    const handleEnrollEditSubmitted = async () => {
      isDialogVisible.value = false;
      await showDrawer(processId.value, 'mainData');
    };

    // Handle editRole action
    const handleRoleEdited = async () => {
      isDialogVisible.value = false;
      await showDrawer(processId.value, 'mainData');
    };

    // Hande addRole action
    const handleAddRoled = async () => {
      isDialogVisible.value = false;
      await showDrawer(processId.value, 'mainData');
    };

    // Handle submitting a new link request
    const handleLinkSubmitted = async () => {
      ElMessage.success(t('ViewApplicationDrawer.messages.linkSubmitted'));
      await showDrawer(processId.value, 'mainData');
    };

    // Handle updating role
    const handleRoleUpdated = async () => {
      isDialogVisible.value = false;
      await showDrawer(processId.value, 'mainData');
    };

    // Delete a payment record
    // const deletePayment = (payment) => {
    //   ElMessageBox.confirm(
    //     t('ViewApplicationDrawer.confirmation.deletePaymentMessage'),
    //     t('ViewApplicationDrawer.confirmation.deletePaymentTitle'),
    //     {
    //       confirmButtonText: t('ViewApplicationDrawer.confirmation.confirmButton'),
    //       cancelButtonText: t('ViewApplicationDrawer.confirmation.cancelButton'),
    //       type: 'warning'
    //     }
    //   )
    //     .then(async () => {
    //       try {
    //         // Assuming there is an API to delete a payment record
    //         const response = await deletePaymentRecord({ processId: processId.value, paymentId: payment.paymentId });
    //         if (response.data.success) {
    //           ElMessage.success(t('ViewApplicationDrawer.messages.paymentDeleted'));
    //           await showDrawer(processId.value);
    //         } else {
    //           console.log(response.data.message || t('ViewApplicationDrawer.errors.deletePaymentFailed'));
    //         }
    //       } catch (error) {
    //         console.error(error);
    //       }
    //     })
    //     .catch(() => {
    //       // User canceled
    //     });
    // };

    // Handle tab click to manage actions
    const handleTabClick = (tab, event) => {
      activeTab.value = tab.props.name;
    };

    const copyToClipboard = async (text) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          ElMessage.success("复制成功！");
        } catch (err) {
          console.error("Clipboard API 复制失败:", err);
          ElMessage.error("复制失败，请手动复制");
        }
      } else {
        // 如果 Clipboard API 不支持，使用备用方案
        fallbackCopyText(text);
      }
    };

    const fallbackCopyText = (text) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        ElMessage.success("复制成功！");
      } catch (err) {
        console.error("复制失败:", err);
        ElMessage.error("复制失败，请手动复制");
      }
      document.body.removeChild(textArea);
    };

    // Process Status options
    const processStatusOptions = {
      '5': "支付中",
      '1': "编辑中",
      '2': "财务审核中",
      '3': "链接申请中",
      '4': "链接审核中",
      '6': "结束",
      '7': "归档",
      '0': "取消",
      '87': "补充角色编辑中",
      '88': "补充角色财务审核中",
      '97': "升级角色编辑中",
      '98': "升级角色财务审核中"
    };

    // Colors for each status
    const processStatusColors = {
      '0': '#9E9E9E', // Canceled - 灰色，表示已废弃或无效
      '1': '#FFB74D',  // Financial Application - 橙黄色，显示申请的初始状态
      '2': '#64B5F6',  // Financial Review - 浅蓝色，突显审核过程
      '3': '#81C784',  // Link Application - 浅绿色，表示积极进行中
      '4': '#4DB6AC',  // Link Review - 蓝绿色，与申请区分的冷静色调
      '5': '#FFD54F',  // In Payment - 金黄色，表示支付正在处理
      '6': '#66BB6A',  // Finished - 深绿色，代表流程已成功完成
      '7': '#BDBDBD',   // Archived - 深灰色，表示流程归档或已完成
      '87': '#FFB74D',  // Role Upgrade Editing - 橙黄色，表示升级角色编辑中
      '88': '#64B5F6',  // Role Upgrade Financial Review - 浅蓝色，表示升级角色财务审核中
      '97': '#81C784',  // Role Upgrade Review - 浅绿色，表示升级角色审核中
      '98': '#4DB6AC'  // Add Role Review - 蓝绿色，表示补充角色审核中
    };

    return {
      t,
      drawerVisible,
      applicationData,
      actionData,
      canViewAction,
      closeDrawer,
      formatCurrency,
      formattedActionData,
      activeTab,
      confirmAction,
      isLoading,
      paymentStatusClass,
      handleDownloadFile,
      getFileName,
      availableActions,
      isDialogVisible,
      addPaymentRef,
      editPaymentRef,
      enrollEditRef,
      editRoleRef,
      addRoleRef,
      requestLinkRef,
      processId,
      imagePreviewVisible,
      imagePreviewUrl,
      handlePaymentAdded,
      handlePaymentEdited,
      handleEnrollEditSubmitted,
      handleRoleEdited,
      handleAddRoled,
      handleLinkSubmitted,
      handleRoleUpdated,
      closeImagePreviewDialog,
      paymentActions,
      confirmPaymentAction,
      // deletePayment,
      roleOptions,
      handlePaymentAction,
      isDownloading,
      handleTabClick,
      openAddPaymentDialog,
      openEditPaymentDialog,
      contractDialogVisible,
      contractFileList,
      contractUploadRef,
      uploadContract,
      closeContractDialog,
      handleContractFileChange,
      handleContractFileRemove,
      beforeContractUpload,
      submitContractUpload,
      contractFiles,
      processStatusOptions,
      processStatusColors,
      saveImage,
      currentPaymentRecord,
      getPaidStr,
      copyToClipboard,
      fallbackCopyText
    };
  }
};
</script>

<style scoped>
.section {
  margin-bottom: 20px;
}
.drawer-footer {
  text-align: right;
  padding: 10px;
}
.status-cancelled {
  color: #f56c6c;
  font-weight: bold;
}
.status-finished {
  color: #67c23a;
  font-weight: bold;
}
.status-submitted {
  color: #409eff;
  font-weight: bold;
}
.status-editing {
  color: #e6a23c;
  font-weight: bold;
}
.status-paying {
  color: #909399;
  font-weight: bold;
}
.status-paid {
  color: #67c23a;
  font-weight: bold;
}
.status-unpaid {
  color: #f56c6c;
  font-weight: bold;
}
.drawer-content {
  padding: 20px;
}
.el-dialog .el-table {
  margin-bottom: 20px;
}
.tab-actions {
  margin-bottom: 15px;
}
</style>
