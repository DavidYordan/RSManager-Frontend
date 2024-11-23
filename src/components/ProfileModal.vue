<template>
    <el-dialog
      :title="$t('profileModal.title')"
      :model-value="modelValue"
      width="700px"
      @update:modelValue="handleClose"
      @close="handleClose"
      center
    >
      <el-form :model="userInfo" label-width="120px" class="profile-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('profileModal.userId')">
              <span>{{ userInfo.userId }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('profileModal.username')">
              <span>{{ userInfo.username }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('profileModal.role')">
              <span>{{ userInfo.backendRole.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('profileModal.fullname')">
              <span>{{ userInfo.fullname || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('profileModal.createdAt')">
              <span>{{ formattedCreatedAt }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('profileModal.status')">
              <el-tag :type="userInfo.status ? 'success' : 'danger'">
                {{ userInfo.status ? $t('profileModal.active') : $t('profileModal.inactive') }}
              </el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('profileModal.totalLearningCost')">
              <span>{{ formatCurrency(userInfo.totalLearningCost) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('profileModal.totalRevenue')">
              <span>{{ formatCurrency(userInfo.totalRevenue) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('profileModal.revenueBalance')">
              <span>{{ formatCurrency(userInfo.revenueBalance) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('profileModal.totalWithdrawal')">
              <span>{{ formatCurrency(userInfo.totalWithdrawal) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('profileModal.inviterId')">
              <span>{{ userInfo.inviterId }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('profileModal.inviterName')">
              <span>{{ userInfo.inviterName || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('profileModal.platformId')">
              <span>{{ userInfo.platformId || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="$t('profileModal.tiktokAccounts')">
              <span>
                <el-tag
                  v-for="(account, index) in userInfo.tiktokAccounts"
                  :key="index"
                  style="margin-right: 5px; margin-bottom: 5px;"
                >
                  {{ account }}
                </el-tag>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <template #footer>
        <el-button type="primary" @click="openResetPasswordModal">{{ $t('profileModal.resetPassword') }}</el-button>
        <el-button @click="handleClose">{{ $t('profileModal.close') }}</el-button>
      </template>
      
      <!-- 重置密码弹窗 -->
      <ResetPasswordModal v-model="isResetPasswordModalVisible" :user-id="userInfo.userId" />
    </el-dialog>
  </template>
  
  <script>
  import { computed, ref } from 'vue';
  import { useStore } from '../store/index.js';
  import { useI18n } from 'vue-i18n';
  import dayjs from 'dayjs';
  import ResetPasswordModal from './ResetPasswordModal.vue'; // 导入重置密码弹窗组件
  
  export default {
    props: {
      modelValue: {
        type: Boolean,
        required: true,
      },
    },
    emits: ['update:modelValue'],
    components: {
      ResetPasswordModal,
    },
    setup(props, { emit }) {
      const store = useStore();
      const { t } = useI18n();
  
      const userInfo = computed(() => store.userInfo);
  
      const formattedCreatedAt = computed(() => {
        return dayjs(userInfo.value.createdAt).format('YYYY-MM-DD HH:mm:ss');
      });
  
      const formatCurrency = (value) => {
        return `$${value.toLocaleString()}`;
      };
  
      const handleClose = () => {
        emit('update:modelValue', false);
      };
  
      // 控制重置密码弹窗的显示
      const isResetPasswordModalVisible = ref(false);
  
      const openResetPasswordModal = () => {
        isResetPasswordModalVisible.value = true;
      };
  
      return {
        userInfo,
        formattedCreatedAt,
        formatCurrency,
        handleClose,
        isResetPasswordModalVisible,
        openResetPasswordModal,
        t,
      };
    },
  };
  </script>
  
  <style scoped>
  .profile-form {
    padding: 20px 0;
  }
  
  .el-dialog__header {
    background-color: #f5f5f5;
  }
  
  .el-form-item {
    margin-bottom: 15px;
  }
  </style>
  