<!-- src/views/Home.vue -->

<template>
  <div class="home-container">
    <!-- 动态背景 -->
    <Particles
      id="tsparticles"
      :options="particlesOptions"
      :init="particlesInit"
      class="particles-bg"
    />

    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="logo">企业管理系统</div>
      <div class="auth-buttons">
        <el-button v-if="!isLoggedIn" type="primary" @click="showLogin = true">登录</el-button>
        <div v-else>
          <el-button type="primary" @click="logout">注销</el-button>
        </div>
      </div>
    </el-header>

    <!-- 登录模态窗 -->
    <LoginModal v-if="showLogin" @close="showLogin = false" @login-success="handleLoginSuccess" />

    <!-- 内容区域 -->
    <el-main class="main-content">
      <el-row :gutter="20" :justify="layoutJustify">
        <el-col
          v-for="card in dataCards"
          :key="card.id"
          :span="colSpan"
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
        >
          <DataCard :data="card" />
        </el-col>
      </el-row>

      <!-- 进入工作台按钮（高级用户） -->
      <div v-if="isAdvanced" class="workspace-button">
        <el-button type="success" size="large">进入工作台</el-button>
      </div>
    </el-main>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import LoginModal from '../components/LoginModal.vue';
import DataCard from '../components/DataCard.vue';
import { Particles } from '@tsparticles/vue3';
import { loadSlim } from '@tsparticles/slim'; // 使用 loadSlim

export default {
  name: 'Home',
  components: {
    LoginModal,
    DataCard,
    Particles
  },
  setup() {
    const showLogin = ref(false);
    const isLoggedIn = ref(false);
    const isAdvanced = ref(false);
    const dataCards = ref([
      { id: 1, title: '数据卡片1', content: '内容1' },
      { id: 2, title: '数据卡片2', content: '内容2' }
      // 可根据需求添加更多卡片
    ]);

    const layoutJustify = computed(() => {
      // 桌面端横向，移动端纵向
      return window.innerWidth > 768 ? 'space-around' : 'start';
    });

    const colSpan = computed(() => {
      return window.innerWidth > 768 ? 8 : 24;
    });

    const handleLoginSuccess = (authInfo) => {
      isLoggedIn.value = true;
      isAdvanced.value = authInfo.type === 'advanced';
      showLogin.value = false;
      // 这里可以根据需要触发数据卡片的显示动画
    };

    const logout = () => {
      isLoggedIn.value = false;
      isAdvanced.value = false;
      // 清除授权信息
    };

    // tsParticles 初始化
    const particlesInit = async (engine) => {
      // 使用 loadSlim 来减少包体积
      await loadSlim(engine);
    };

    // 在这里配置您的粒子选项
    const particlesOptions = {
      background: {
        color: {
          value: "#0d47a1", // 背景颜色
        },
      },
      fpsLimit: 60, // 帧率限制
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" }, // 点击时添加粒子
          onHover: { enable: true, mode: "repulse" }, // 悬停时驱散粒子
          resize: true, // 响应窗口大小变化
        },
        modes: {
          push: { quantity: 4 }, // 每次点击添加的粒子数量
          repulse: { distance: 200, duration: 0.4 }, // 驱散粒子的距离和持续时间
        },
      },
      particles: {
        color: { value: "#ffffff" }, // 粒子颜色
        links: {
          color: "#ffffff", // 粒子连线颜色
          distance: 150, // 粒子连线的最大距离
          enable: true, // 启用连线
          opacity: 0.5, // 连线透明度
          width: 1, // 连线宽度
        },
        collisions: { enable: false }, // 启用碰撞检测
        move: {
          direction: "none", // 运动方向
          enable: true, // 启用运动
          outModes: { default: "bounce" }, // 边界行为
          random: false, // 随机运动
          speed: 2, // 运动速度
          straight: false, // 直线运动
        },
        number: {
          density: { enable: true, area: 800 }, // 粒子密度
          value: 80, // 粒子数量
        },
        opacity: { value: 0.5 }, // 粒子透明度
        shape: { type: "circle" }, // 粒子形状
        size: { value: { min: 1, max: 5 } }, // 粒子大小
      },
      detectRetina: true, // 支持 Retina 显示
    };

    // 响应式粒子数量
    const handleResize = () => {
      particlesOptions.particles.number.value = window.innerWidth > 768 ? 80 : 40;
    };

    onMounted(() => {
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    return {
      showLogin,
      isLoggedIn,
      isAdvanced,
      dataCards,
      handleLoginSuccess,
      logout,
      particlesInit,
      particlesOptions,
      layoutJustify,
      colSpan
    };
  }
};
</script>

<style scoped>
.home-container {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.particles-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* 确保粒子在背景 */
}

.header {
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  z-index: 10;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.main-content {
  position: absolute;
  top: 60px;
  bottom: 0;
  width: 100%;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.workspace-button {
  margin-top: 20px;
}
</style>
