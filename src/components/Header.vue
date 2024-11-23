<template>
  <header class="app-header">
    <!-- 左边栏：标题 -->
    <div class="left-section">
      <div class="site-title">{{ $t('app.title') }}</div>
    </div>

    <!-- 右边栏：用户相关信息和语言切换 -->
    <div class="right-section">
      <!-- 欢迎语 -->
      <el-dropdown class="welcome-message" trigger="hover">
        <div>{{ $t('header.welcome', { name: username }) }}</div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="openResetPasswordModal">{{ $t('header.resetPassword') }}</el-dropdown-item>
            <el-dropdown-item @click="logout">{{ $t('header.logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 语言切换按钮 -->
      <el-dropdown trigger="hover">
        <span class="el-dropdown-link">
          {{ currentLanguageLabel }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="switchLanguage('zh-cn')">简体中文</el-dropdown-item>
            <!-- <el-dropdown-item @click="switchLanguage('zh-tw')">繁體中文</el-dropdown-item>
            <el-dropdown-item @click="switchLanguage('en')">English</el-dropdown-item> -->
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 个人资料弹窗 -->
    <ResetPasswordModal v-model="isResetPasswordModalVisible" />
  </header>
</template>

<script>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '../store/index.js';
import ResetPasswordModal from './ResetPasswordModal.vue'; // 导入个人资料弹窗组件

export default {
  components: {
    ResetPasswordModal,
  },
  setup() {
    const { locale } = useI18n();
    const store = useStore();

    const username = computed(() => {
      return store.username;
    });

    const currentLanguageLabel = computed(() => {
      switch (locale.value) {
        case 'zh-cn':
          return '简体中文';
        case 'zh-tw':
          return '繁體中文';
        case 'en':
          return 'English';
        default:
          return '简体中文';
      }
    });

    const switchLanguage = (lang) => {
      locale.value = lang;
      localStorage.setItem('locale', lang);
    };

    const logout = () => {
      store.logout();
    };

    // 控制个人资料弹窗的显示
    const isResetPasswordModalVisible = ref(false);

    const openResetPasswordModal = () => {
      isResetPasswordModalVisible.value = true;
    };

    return {
      currentLanguageLabel,
      switchLanguage,
      username,
      logout,
      isResetPasswordModalVisible,
      openResetPasswordModal,
    };
  },
};
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background-color: #f5f5f5;
}

.site-title {
  font-size: 32px; /* 调整字体大小，使其更协调 */
  font-family: 'Roboto', sans-serif; /* 更换为现代感强的字体 */
  color: #333333; /* 使用深灰色，提升可读性 */
  margin-bottom: 0; /* 去除底部外边距，保持整洁 */
  font-weight: 700; /* 加粗字体，增强标题的视觉冲击力 */
  
  /* 添加柔和的文本阴影，提升立体感 */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.right-section {
  display: flex;
  align-items: center;
}

.left-section {
  justify-content: center;
  padding:5px;
  flex: 1;
}

.welcome-message {
  font-size: 16px;
  margin-right: 20px;
  cursor: pointer;
}

.user-dropdown {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.el-icon-arrow-down {
  margin-left: 5px;
}
</style>
