<template>
  <div class="login-container">
    <!-- 粒子特效 -->
    <vue-particles id="tsparticles" :options="particlesOptions" />

    <div class="overlay"></div>

    <!-- 登录对话框的过渡效果 -->
    <transition name="fade-in">
      <el-card class="login-card" key="login-card">
        <h2 class="login-title">{{ t('app.title') }}</h2>
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginFormRef"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              :placeholder="t('login.username')"
              prefix-icon="user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="loginForm.password"
              :placeholder="t('login.password')"
              prefix-icon="lock"
            ></el-input>
          </el-form-item>
          <el-form-item prop="captchaCode">
            <div class="captcha-container">
              <el-input
                v-model="loginForm.captchaCode"
                ref="captchaInputRef"
                :placeholder="t('login.captcha')"
                prefix-icon="picture"
              ></el-input>
              <img
                :src="captchaImageUrl"
                @click="refreshCaptcha"
                alt="captcha"
                class="captcha-image"
              />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              native-type="submit"
              round
              :loading="loading"
              class="login-button"
            >{{ t('login.login') }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </transition>
  </div>
</template>

<script>
import { useStore } from '../store';
import { useRouter } from 'vue-router';
import { reactive, ref, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCaptcha } from '../api/auth';
import { ElMessage } from 'element-plus';
import particlesOptions from '@/particles-config.js';
import { gsap } from 'gsap';

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

    const rules = {
      username: [
        { required: true, message: t('login.usernameRequired'), trigger: 'blur' },
      ],
      password: [
        { required: true, message: t('login.passwordRequired'), trigger: 'blur' },
      ],
      captchaCode: [
        { required: true, message: t('login.captchaRequired'), trigger: 'blur' },
      ],
    };

    const loginFormRef = ref(null);
    const captchaInputRef = ref(null);
    const captchaImageUrl = ref('');
    const loading = ref(false);

    // 加载验证码
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
        ElMessage.error(t('utils.captchaLoadFailed') || '验证码加载失败');
      }
    };

    // 刷新验证码
    const refreshCaptcha = () => {
      loadCaptcha();
      loginForm.captchaCode = '';
      nextTick(() => {
        if (captchaInputRef.value) {
          captchaInputRef.value.focus();
        }
      });
    };

    // 处理登录
    const handleLogin = () => {
      loginFormRef.value.validate(async (valid) => {
        if (!valid) {
          return;
        }
        loading.value = true;
        try {
          await store.login(loginForm);

          const roleId = store.roleId;

          if (roleId === 6) {
            ElMessage.error('访问被拒绝');
            refreshCaptcha();
            return;
          }

          if ([1, 2, 3, 8].includes(roleId)) {
            await router.push({ name: 'ToDoApplications' });
            return;
          } else if (roleId === 7) {
            await router.push({ name: 'ToDoTraffic' });
            return;
          }

          if ([4, 5].includes(roleId)) {
            await router.push({ name: 'Home' });
          } else {
            await router.push('/');
          }
        } catch (error) {
          ElMessage.error('登录失败');
          refreshCaptcha();
        } finally {
          loading.value = false;
        }
      });
    };

    onMounted(() => {
      loadCaptcha();

      // 为登录卡片添加进场动画
      gsap.from('.login-card', {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: 'power2.out',
      });
    });

    return {
      loginForm,
      rules,
      loginFormRef,
      captchaInputRef,
      handleLogin,
      t,
      captchaImageUrl,
      refreshCaptcha,
      loading,
      particlesOptions
    };
  },
};
</script>

<style scoped>
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* background: url('@/assets/images/bg1.jpg') no-repeat center center/cover; */
  overflow: hidden;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(28, 28, 28, 0.8);
  z-index: 1;
}

.login-card {
  position: relative;
  z-index: 2;
  width: 400px;
  padding: 30px;
  background-color: rgba(28, 28, 28, 0.9);
  border: 1px solid #D3D3D3;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(185, 242, 255, 0.2);
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px;
  color: #B9F2FF;
  text-shadow: 0 0 5px #B9F2FF;
}

.el-form-item .el-input {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid #D3D3D3;
  color: #FFFFFF;
}

.el-form-item .el-input:hover,
.el-form-item .el-input:focus {
  border-color: #B9F2FF;
}

.captcha-container {
  display: flex;
  align-items: center;
}

.captcha-image {
  margin-left: 10px;
  cursor: pointer;
  height: 40px;
  border: 1px solid #D3D3D3;
  border-radius: 4px;
}

.login-button {
  width: 100%;
  background: linear-gradient(90deg, #B9F2FF 0%, #C0C0C0 100%);
  color: #1C1C1C;
  border: none;
}

.login-button:hover {
  background: linear-gradient(90deg, #C0C0C0 0%, #B9F2FF 100%);
  box-shadow: 0 0 10px #B9F2FF;
}

/* Fade-in 过渡效果 */
.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-in-enter-to,
.fade-in-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
