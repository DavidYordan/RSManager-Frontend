<template>
  <el-container class="layout-container">
    <!-- 头部 -->
    <el-header class="layout-header">
      <Header />
    </el-header>

    <!-- 主体部分，包含侧边栏和主内容区域 -->
    <el-container class="layout-body">
      <!-- 侧边栏 -->
      <el-aside class="layout-aside">
        <Sidebar />
      </el-aside>

      <!-- 主内容区域 -->
      <el-main class="layout-main">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';

export default {
  name: 'Layout',
  components: {
    Header,
    Sidebar,
  },
  setup() {
    const route = useRoute();
    const { t, locale } = useI18n();
    const pageTitle = ref(t(route.meta.title || 'default.title'));

    const updateTitle = () => {
      pageTitle.value = t(route.meta.title || 'default.title');
    };

    watch(locale, updateTitle);

    watch(
      () => route.meta.title,
      updateTitle
    );

    return { pageTitle };
  },
};
</script>

<style scoped>
.site-title {
  font-size: 24px; /* 调整字体大小，使其更协调 */
  font-family: 'Roboto', sans-serif; /* 更换为现代感强的字体 */
  color: #333333; /* 使用深灰色，提升可读性 */
  margin-bottom: 0; /* 去除底部外边距，保持整洁 */
  font-weight: 700; /* 加粗字体，增强标题的视觉冲击力 */
  
  /* 添加柔和的文本阴影，提升立体感 */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-body {
  flex: 1;
  display: flex;
}

.layout-aside {
  width: 200px;
  background-color: #fff;
  border-right: 1px solid #ebeef5;
}

.layout-main {
  background-color: #f2f2f2;
  padding: 20px;
  overflow: auto;
  flex: 1;
}
</style>
