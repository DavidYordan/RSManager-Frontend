<template>
    <el-dialog
      :title="$t('resetPasswordModal.title')"
      :model-value="modelValue"
      width="400px"
      @update:modelValue="handleClose"
      @close="handleClose"
      center
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="resetPasswordForm"
        label-width="120px"
        class="reset-password-form"
      >
        <el-form-item
          :label="$t('resetPasswordModal.oldPassword')"
          prop="oldPassword"
        >
          <el-input
            type="password"
            v-model="form.oldPassword"
            autocomplete="current-password"
          ></el-input>
        </el-form-item>
  
        <el-form-item
          :label="$t('resetPasswordModal.newPassword')"
          prop="newPassword"
        >
          <el-input
            type="password"
            v-model="form.newPassword"
            autocomplete="new-password"
          ></el-input>
        </el-form-item>
  
        <el-form-item
          :label="$t('resetPasswordModal.confirmNewPassword')"
          prop="confirmNewPassword"
        >
          <el-input
            type="password"
            v-model="form.confirmNewPassword"
            autocomplete="new-password"
          ></el-input>
        </el-form-item>
      </el-form>
  
      <template #footer>
        <el-button @click="handleClose">{{ $t('resetPasswordModal.cancel') }}</el-button>
        <el-button type="primary" @click="onSubmit">{{ $t('resetPasswordModal.submit') }}</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script>
  import { ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { resetPassword as apiResetPassword } from '@/api/user';
  import { ElMessage } from 'element-plus';
  import { useStore } from '../store/index.js';
  
  export default {
    props: {
      modelValue: {
        type: Boolean,
        required: true,
      },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const resetPasswordForm = ref(null);
      const store = useStore();
  
      const form = reactive({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
  
      const rules = {
        oldPassword: [
          { required: true, message: t('resetPasswordModal.oldPasswordRequired'), trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: t('resetPasswordModal.newPasswordRequired'), trigger: 'blur' },
          { min: 6, message: t('resetPasswordModal.newPasswordMin', { min: 6 }), trigger: 'blur' },
        ],
        confirmNewPassword: [
          { required: true, message: t('resetPasswordModal.confirmNewPasswordRequired'), trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' },
        ],
      };
  
      function validateConfirmPassword(rule, value, callback) {
        if (value !== form.newPassword) {
          callback(new Error(t('resetPasswordModal.passwordsDoNotMatch')));
        } else {
          callback();
        }
      }
  
      const handleClose = () => {
        emit('update:modelValue', false);
        form.oldPassword = '';
        form.newPassword = '';
        form.confirmNewPassword = '';
        if (resetPasswordForm.value) {
          resetPasswordForm.value.resetFields();
        }
      };
  
      const onSubmit = () => {
        resetPasswordForm.value.validate(async (valid) => {
          if (valid) {
            try {
              const payload = {
                userId: store.userId,
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
              };
              await apiResetPassword(payload);
              ElMessage.success(t('resetPasswordModal.success'));
              handleClose();
            } catch (error) {
              ElMessage.error(error.message || t('resetPasswordModal.failure'));
            }
          } else {
            ElMessage.error(t('resetPasswordModal.formInvalid'));
            return false;
          }
        });
      };
  
      return {
        form,
        rules,
        resetPasswordForm,
        handleClose,
        onSubmit,
        t,
      };
    },
  };
  </script>
  
  <style scoped>
  .reset-password-form {
    padding: 20px 0;
  }
  </style>
  