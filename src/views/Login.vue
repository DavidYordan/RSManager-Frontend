<template>
  <div class="main-container">
    <vue-particles id="tsparticles" :options="particlesOptions" />
    <div class="login-container">
      <form
        @submit.prevent="handleLogin"
        ref="loginFormRef"
        class="form"
      >
        <div class="form-item">
          <input
            id="username"
            v-model="loginForm.username"
            :placeholder="t('login.username')"
            class="custom-input"
          />
          <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
        </div>
        <div class="form-item">
          <input
            id="password"
            type="password"
            v-model="loginForm.password"
            :placeholder="t('login.password')"
            class="custom-input"
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>
        <div class="form-item">
          <div class="captcha-container">
            <input
              id="captchaCode"
              v-model="loginForm.captchaCode"
              ref="captchaInputRef"
              :placeholder="t('login.captcha')"
              class="custom-input"
            />
            <img
              :src="captchaImageUrl"
              @click="refreshCaptcha"
              alt="captcha"
              class="captcha-image"
            />
          </div>
          <span v-if="errors.captchaCode" class="error-message">{{ errors.captchaCode }}</span>
        </div>
        <div class="form-item">
          <button
            type="submit"
            :disabled="loading"
            class="login-button"
          >{{ t('login.login') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useStore } from '../store';
import { useRouter } from 'vue-router';
import { reactive, ref, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCaptcha } from '../api/auth';
import particlesOptions from '@/particles-config.js';

export default {
  name: 'Login',
  setup() {
    const store = useStore();
    const router = useRouter();
    const { t } = useI18n();

    const loginForm = reactive({
      username: '',
      password: '',
      captchaCode: '',
    });

    const errors = reactive({
      username: '',
      password: '',
      captchaCode: '',
    });

    const loginFormRef = ref(null);
    const captchaInputRef = ref(null);
    const captchaImageUrl = ref('');
    const loading = ref(false);

    const validate = () => {
      errors.username = loginForm.username ? '' : t('login.usernameRequired');
      errors.password = loginForm.password ? '' : t('login.passwordRequired');
      errors.captchaCode = loginForm.captchaCode ? '' : t('login.captchaRequired');
      return !errors.username && !errors.password && !errors.captchaCode;
    };

    const loadCaptcha = async () => {
      try {
        const response = await getCaptcha();
        const blob = response.data;
        if (captchaImageUrl.value) {
          URL.revokeObjectURL(captchaImageUrl.value);
        }
        captchaImageUrl.value = URL.createObjectURL(blob);
      } catch (error) {
        console.error(t('utils.captchaLoadFailed'), error);
      }
    };

    const refreshCaptcha = () => {
      loadCaptcha();
      loginForm.captchaCode = '';
      nextTick(() => {
        if (captchaInputRef.value) {
          captchaInputRef.value.focus();
        }
      });
    };

    const handleLogin = async () => {
      if (!validate()) return;

      loading.value = true;
      try {
        await store.login(loginForm);
        const roleId = store.roleId;
        if (roleId === 6) {
          alert('访问被拒绝');
          refreshCaptcha();
          return;
        }

        if ([1, 2, 3, 8].includes(roleId)) {
          await router.push({ name: 'ToDoApplications' });
        } else if (roleId === 7) {
          await router.push({ name: 'ToDoTraffic' });
        } else if ([4, 5].includes(roleId)) {
          await router.push({ name: 'Home' });
        } else {
          await router.push('/');
        }
      } catch (error) {
        alert('登录失败');
        refreshCaptcha();
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadCaptcha();
    });

    return {
      loginForm,
      errors,
      loginFormRef,
      captchaInputRef,
      handleLogin,
      t,
      captchaImageUrl,
      refreshCaptcha,
      loading,
      particlesOptions,
    };
  },
};
</script>

<style lang="scss" scoped>

body.mobile #tsparticles {
  display: none;
}

.login-container {
  display: flex;
  justify-content: center;

  .form {
    position: relative;
    justify-content: center;
    align-items: center;
    width: 400px;
    gap: 2em;
    padding: 1em;
    background: $image-ct1-avif;
    border: 2px solid #BFA383;
    border-radius: 1em;
    box-shadow: 3px 3px 2px 0px #BFA383,
                9px 7px 10px 2px rgba(0, 0, 0, 0.5);
  }

  .form-item {
    margin-top: 10px;

    .custom-input {
      width: 100%;
      padding: 10px;
      background: $image-input1-avif;
      border: 1px solid #FBF7F3;
      border-radius: 4px;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
      font-size: 1.2em;
      font-weight: bold;
      color: #602020;
      text-shadow: 1px 1px 1px #FBF7F3,
                  -1px -1px 1px #602020;
    }

    .captcha-container {
      display: flex;
      align-items: center;

      .captcha-image {
        margin-left: 10px;
        cursor: pointer;
        height: 40px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
      }
    }
  }

  .login-button {
      position: relative;
      background: $image-ct_float-avif;
      color: #3A2B23;
      text-shadow: 1px 1px 1px #3A2B23,
                  -1px -1px 1px #FBF7F3;
      font-weight: bold;
      font-size: 0.9em;
      padding: 0.5em 1em;
      border-radius: 0.5em;
      box-shadow: 3px 3px 2px 0px #BFA383,
                  9px 7px 10px 2px rgba(0, 0, 0, 0.5);
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      user-select: none;
      text-align: center;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 4px 4px 5px #BFA383, 10px 8px 12px rgba(0,0,0,0.5);
      }
      &:active {
        transform: translateY(2px);
      }
  }

  .error-message {
    color: red;
    font-size: 0.8em;
  }
}
</style>
