<template>
  <div class="login-container">
    <!-- 登录对话框的过渡效果 -->
    <transition name="slide-up">
      <el-card v-if="!isLoggedIn && !isTransitioning" class="login-card" key="login-card">
        <h2 class="login-title">{{ t('app.title') }}</h2>
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" @submit.prevent="handleLogin">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" :placeholder="t('login.username')"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" :placeholder="t('login.password')"></el-input>
          </el-form-item>
          <el-form-item prop="captchaCode">
            <div class="captcha-container">
              <el-input v-model="loginForm.captchaCode" ref="captchaInputRef" :placeholder="t('login.captcha')"></el-input>
              <img :src="captchaImageUrl" @click="refreshCaptcha" alt="captcha" class="captcha-image" />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit" round :loading="loading" class="login-button">{{ t('login.login') }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </transition>

    <!-- 登录成功后的内容 -->
    <transition name="slide-down">
      <div v-if="isLoggedIn && !isTransitioning" class="logged-in-container" key="logged-in-container">
        <!-- 右上角的按钮容器 -->
        <div class="button-container">
          <el-button
            class="reset-password-butto"
            type="primary"
            round
            @click="openResetPasswordModal"
          >
            {{ $t('login.resetPassword') }}
          </el-button>

          <el-button
            class="logout-button"
            type="danger"
            round
            @click="handleLogout"
          >
            {{ t('login.logout') }}
          </el-button>

          <el-button
            v-if="[1].includes(roleId)"
            class="dashboard-button"
            type="primary"
            @click="goToWorkspace"
          >
            {{ t('login.enterDashboard') }}
          </el-button>
        </div>

        <!-- 数据卡片的过渡效果 -->
        <div class="cards-container">
          <!-- 卡片1：汇总收益 -->
          <el-card class="summary-card">
            <h3>您的本月佣金[{{ currentMonthLabel }}]</h3>
            <div class="card-content">
              <template v-if="Object.keys(summaryCard1).length === 0">
                <p>暂无数据</p>
              </template>
              <div v-for="(amount, currency) in summaryCard1" :key="currency" class="currency-row">
                <el-link @click="openDetails(currency)" type="primary">{{ formatNumber(amount) }} {{ currency }}</el-link>
              </div>
            </div>
          </el-card>

          <!-- 卡片2：短剧平台汇总 -->
          <el-card class="summary-card">
            <h3>短剧平台汇总</h3>
            <div class="card-content">
              <div class="platform-row">
                总收益：{{ formatNumber(platformTotalRevenue) }}
              </div>
              <div class="platform-row">
                已提现：{{ formatNumber(platformTotalWithdrawal) }}
              </div>
              <div class="platform-row">
                可提现：{{ formatNumber(platformRevenueBalance) }}
              </div>
            </div>
          </el-card>

          <!-- 在数据卡片右侧增加纵向布局的两个按钮 -->
          <div class="month-navigation">
            <el-button
              @click="changeMonth(-1)"
              :disabled="isPrevMonthDisabled"
              size="small"
            >上一月</el-button>
            <el-button
              @click="changeMonth(1)"
              :disabled="isNextMonthDisabled"
              size="small"
            >下一月</el-button>
          </div>
        </div>

        <!-- 增长情况图表 -->
        <div class="chart-container">
          <template v-if="growthData && growthData.length > 0">
            <canvas ref="growthChartRef"></canvas>
          </template>
          <template v-else>
            <el-empty description="暂无增长数据"></el-empty>
          </template>
        </div>
      </div>
    </transition>

    <!-- 明细弹窗 -->
    <el-dialog v-model="detailDialogVisible" :title="selectedCurrency + ' 详情'" width="60%">
      <el-table :data="currencyDetails" style="width: 100%">
        <el-table-column prop="fullname" label="姓名"></el-table-column>
        <el-table-column prop="regionName" label="地区"></el-table-column>
        <el-table-column prop="currency" label="币种"></el-table-column>
        <el-table-column prop="paymentAmount" label="支付金额"></el-table-column>
        <el-table-column prop="profit" label="佣金"></el-table-column>
        <el-table-column prop="paymentDate" label="支付日期"></el-table-column>
        <el-table-column prop="inviterFullname" label="邀请人"></el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <ResetPasswordModal v-model="resetPasswordModalVisible" />
  </div>
</template>

<script>
import { useStore } from '../store';
import { useRouter } from 'vue-router';
import { reactive, ref, onMounted, watch, computed, nextTick, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCaptcha } from '../api/auth';
import { getCurrentUserSummary } from '@/api/user';
import { ElMessage } from 'element-plus';
import AnimatedNumber from '@/components/AnimatedNumber.vue'; // 自定义动画数字组件
import ResetPasswordModal from '@/components/ResetPasswordModal.vue';
import Chart from 'chart.js/auto';
import dayjs from 'dayjs';

export default {
  name: 'Login',
  components: {
    AnimatedNumber,
    ResetPasswordModal
  },
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
    const isLoggedIn = ref(false);
    const isTransitioning = ref(false);
    const roleId = ref(0);
    const resetPasswordModalVisible = ref(false);

    const openResetPasswordModal = () => {
      resetPasswordModalVisible.value = true;
    };

    const closeResetPasswordModal = () => {
      resetPasswordModalVisible.value = false;
    };

    // 当前选择的月份
    const selectedMonth = ref(dayjs().startOf('month'));

    const currentMonthLabel = computed(() => dayjs(selectedMonth.value).format('MM/YYYY'));

    // 按钮禁用状态
    const isPrevMonthDisabled = computed(() => {
      const prevMonth = dayjs(selectedMonth.value).subtract(1, 'month');
      // Prevent navigating beyond two months ago
      return prevMonth.isBefore(dayjs().subtract(1, 'month').startOf('month'));
    });

    const isNextMonthDisabled = computed(() => {
      // Prevent navigating to future months
      return dayjs(selectedMonth.value).isSameOrAfter(dayjs(), 'month');
    });

    // 汇总收益（按货币）
    const summaryCard1 = ref({ '美元': 0 }); // 例如: { '台币': 1234, '美元': 5678 }

    // 短剧平台汇总数据
    const platformTotalRevenue = ref(0);
    const platformTotalWithdrawal = ref(0);
    const platformRevenueBalance = ref(0);

    const currencyProfits = ref([]);
    const profitsData = ref([]);

    // 图表引用和实例
    const growthChartRef = ref(null);
    let growthChartInstance = null;

    // 明细弹窗
    const detailDialogVisible = ref(false);
    const selectedCurrency = ref('');
    const currencyDetails = ref([]);

    // 增长数据
    const growthData = ref([]);

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

    // 格式化数字
    const formatNumber = (num) => {
      return new Intl.NumberFormat().format(num);
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

          roleId.value = store.roleId;

          if (roleId.value === 6) {
            ElMessage.error(t('login.accessDenied') || '访问被拒绝');
            refreshCaptcha();
            return;
          }

          if ([1, 2, 3, 8].includes(store.roleId)) {
            await router.push({ name: 'ToDoApplications' });
            return;
          } else if (store.roleId === 7) {
            await router.push({ name: 'ToDoTraffic' });
            return;
          }

          if ([4, 5].includes(roleId.value)) {
            isLoggedIn.value = true;
            fetchUserSummary();
          }
        } catch (error) {
          ElMessage.error(t('login.loginFailed') || '登录失败');
          refreshCaptcha();
        } finally {
          loading.value = false;
        }
      });
    };

    // 获取用户摘要信息
    const fetchUserSummary = async () => {
      try {
        const response = await getCurrentUserSummary(selectedMonth.value.format('YYYY-MM'));
        if (response.data.success) {
          const data = response.data.data;

          // 设置数据，如果没有数据则保持默认值
          summaryCard1.value = data.currencyProfits?.reduce((acc, curr) => {
            acc[curr.currency] = curr.profits.reduce((sum, profit) => sum + (profit.profit || 0), 0);
            return acc;
          }, {}) || { USD: 0 };

          // 设置币种收益数据
          currencyProfits.value = data.currencyProfits || [];

          // 收集所有利润数据到 profitsData
          profitsData.value = currencyProfits.value.reduce((acc, curr) => {
            const profitsArray = Array.isArray(curr.profits) ? curr.profits : [];
            acc.push(...profitsArray);
            return acc;
          }, []);

          // 计算按货币汇总的收益
          summaryCard1.value = currencyProfits.value.reduce((acc, curr) => {
            const profitsArray = Array.isArray(curr.profits) ? curr.profits : [];
            const totalProfit = profitsArray.reduce((sum, profit) => sum + (profit.profit || 0), 0);
            acc[curr.currency] = totalProfit;
            return acc;
          }, {});

          // 设置增长数据并更新图表
          growthData.value = currencyProfits.value.map(currencyProfit => ({
            currency: currencyProfit.currency,
            growthDatas: currencyProfit.growthDatas
          }));

          // 设置短剧平台汇总数据
          platformTotalRevenue.value = data.platformTotalRevenue || 0;
          platformTotalWithdrawal.value = data.platformTotalWithdrawal || 0;
          platformRevenueBalance.value = data.platformRevenueBalance || 0;

          if (growthData.value && growthData.value.length > 0) {
            updateChartData(growthData.value);
          } else {
            console.error('Received empty growthData');
          }
        } else {
          console.error('获取用户摘要信息失败:', response.data.message);
          // ElMessage.error(response.data.message || '获取用户摘要信息失败');
        }
      } catch (error) {
        console.error(t('utils.fetchSummaryFailed') || '获取用户摘要信息失败', error);
        // ElMessage.error(t('utils.fetchSummaryFailed') || '获取用户摘要信息失败');
      }
    };

    // 更新图表数据
    const updateChartData = async (growthDataArray) => {
      if (!growthDataArray || growthDataArray.length === 0) {
        console.error('growthData is empty');
        return;
      }

      await nextTick();

      // 假设所有币种的日期一致，取第一个币种的日期作为标签
      const labels = growthDataArray[0].growthDatas.map(item => item.date);

      // 构建数据集和 Y 轴配置
      const datasets = [];
      const yAxes = {};

      growthDataArray.forEach((currencyData, index) => {
        const yAxisID = `y${index}`; // 为每个币种创建一个独立的 Y 轴

        // 创建数据集
        datasets.push({
          label: currencyData.currency,
          data: currencyData.growthDatas.map(item => item.profit),
          borderColor: getColorForCurrency(index),
          backgroundColor: 'rgba(0, 0, 0, 0)',
          fill: false,
          tension: 0.4,
          yAxisID: yAxisID, // 指定数据集使用的 Y 轴
        });

        // 创建对应的 Y 轴配置
        yAxes[yAxisID] = {
          type: 'linear',
          display: true,
          position: index % 2 === 0 ? 'left' : 'right', // 左右交替放置 Y 轴
          title: {
            display: true,
            text: currencyData.currency,
          },
          // 避免网格线重叠
          grid: {
            drawOnChartArea: false,
          },
        };
        });

        if (!growthChartInstance) {
        // 初始化图表
        const ctx = growthChartRef.value.getContext('2d');
        growthChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: datasets,
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: t('Dashboard.growthChartTitle') || '佣金增长情况',
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: t('Dashboard.date') || '日期',
                },
              },
              ...yAxes, // 展开所有 Y 轴配置
            },
          },
        });
      } else {
        // 更新现有图表
        growthChartInstance.data.labels = labels;
        growthChartInstance.data.datasets = datasets;
        growthChartInstance.options.scales = {
          x: {
            title: {
              display: true,
              text: t('Dashboard.date') || '日期',
            },
          },
          ...yAxes,
        };
        growthChartInstance.update();
      }
    };

    // 定义一个函数为每个币种分配颜色
    const getColorForCurrency = (index) => {
      const colors = [
        'rgba(75, 192, 192, 1)',    // 绿色
        'rgba(255, 99, 132, 1)',    // 红色
        'rgba(54, 162, 235, 1)',    // 蓝色
        'rgba(255, 206, 86, 1)',    // 黄色
        'rgba(153, 102, 255, 1)',   // 紫色
        'rgba(255, 159, 64, 1)',    // 橙色
      ];
      return colors[index % colors.length];
    };

    // 进入工作台
    const goToWorkspace = () => {
      router.push('/');
    };

    // 处理注销
    const handleLogout = () => {
      store.logout();
      isLoggedIn.value = false;
      summaryCard1.value = {};
      platformTotalRevenue.value = 0;
      platformTotalWithdrawal.value = 0;
      platformRevenueBalance.value = 0;
      growthData.value = [];
      profitsData.value = [];

      // 销毁图表实例
      if (growthChartInstance) {
        growthChartInstance.destroy();
        growthChartInstance = null;
      }

      // 重新加载验证码
      refreshCaptcha();
    };

    // 检查是否已有 token
    const checkLoginStatus = async () => {
      const token = store.token;
      if (token) {
        roleId.value = store.roleId;
        if (roleId.value && [1, 2, 3, 4, 5].includes(roleId.value)) {
          isLoggedIn.value = true;
          await fetchUserSummary();
        }
      } else {
        loadCaptcha();
      }
    };

    // 修改月份
    const changeMonth = (direction) => {
      if (direction === -1) {
        selectedMonth.value = selectedMonth.value.subtract(1, 'month');
      } else if (direction === 1) {
        selectedMonth.value = selectedMonth.value.add(1, 'month');
      }
      summaryCard1.value = {};
      platformTotalRevenue.value = 0;
      platformTotalWithdrawal.value = 0;
      platformRevenueBalance.value = 0;
    };

    // 打开明细弹窗
    const openDetails = (currency) => {
      selectedCurrency.value = currency;
      currencyDetails.value = getCurrencyDetails(currency);
      detailDialogVisible.value = true;
    };

    // 获取指定货币的明细
    const getCurrencyDetails = (currency) => {
      if (!profitsData.value || profitsData.value.length === 0) return [];

      return profitsData.value
        .filter(entry => 
          entry.currency === currency
        )
        .map(entry => ({
          fullname: entry.fullname || '****',
          regionName: entry.regionName,
          currency: entry.currency,
          paymentAmount: Number(entry.paymentAmount).toFixed(2),
          profit: Number(entry.profit).toFixed(2),
          paymentDate: dayjs(entry.paymentDate).format('YYYY-MM-DD'),
          inviterFullname: entry.inviterFullname || '/',
        }));
    };

    onMounted(() => {
      checkLoginStatus();
    });

    // 监听选中月份变化，获取摘要信息
    watch(selectedMonth, async (newMonth, oldMonth) => {
      if (isLoggedIn.value) {
        await fetchUserSummary();
      }
    });

    // 防止内存泄漏，销毁图表实例
    onBeforeUnmount(() => {
      if (growthChartInstance) {
        growthChartInstance.destroy();
        growthChartInstance = null;
      }
    });

    return {
      loginForm,
      rules,
      loginFormRef,
      captchaInputRef,
      handleLogin,
      handleLogout,
      resetPasswordModalVisible,
      openResetPasswordModal,
      closeResetPasswordModal,
      t,
      captchaImageUrl,
      refreshCaptcha,
      loading,
      isLoggedIn,
      isTransitioning,
      summaryCard1,
      goToWorkspace,
      roleId,
      currentMonthLabel,
      changeMonth,
      isPrevMonthDisabled,
      isNextMonthDisabled,
      growthChartRef,
      formatNumber,
      detailDialogVisible,
      selectedCurrency,
      currencyDetails,
      openDetails,
      growthData,
      platformTotalRevenue,
      platformTotalWithdrawal,
      platformRevenueBalance
    };
  },
};
</script>

<style scoped>
/* 容器样式 */
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  /* background-color: #f0f2f5; */
  /* background-image: url('@/assets/images/bg.jpg'); */
  background-size: cover; /* 背景图片覆盖整个容器 */
}

/* 登录卡片样式 */
.login-card {
  width: 400px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

/* 登录标题样式 */
.login-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #409EFF; /* 使用 Element Plus 的主色调 */
}

/* 验证码容器样式 */
.captcha-container {
  display: flex;
  align-items: center;
}

/* 验证码图片样式 */
.captcha-image {
  margin-left: 10px;
  cursor: pointer;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

/* 登录按钮样式 */
.login-button {
  width: 100%;
}

/* 登录成功后的容器样式 */
.logged-in-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-color: #ffffff; */
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

/* 按钮容器样式 */
.button-container {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

/* 数据卡片容器样式 */
.cards-container {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 60px;
}

/* 确保数据卡片大小一致，内容居中 */
.summary-card {
  width: 300px;
  height: 200px; /* 设置固定高度 */
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中内容 */
}

.summary-card h3 {
  margin-top: 0;
  margin-bottom: 20px; /* 增加标题与内容之间的间距 */
  text-align: center;  /* 标题水平居中 */
}

/* 卡片内容样式 */
.card-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;   /* 水平居中 */
  justify-content: center; /* 垂直居中 */
}

/* 货币行样式 */
.currency-row {
  margin-bottom: 5px;
}

.currency-row .el-link {
  font-size: inherit; /* 继承 card-content 的字体大小 */
}

/* 平台数据行样式 */
.platform-row {
  margin-bottom: 5px;
}

/* 月份导航按钮容器 */
.month-navigation {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中按钮 */
  align-items: center;
  gap: 20px; /* 调整按钮之间的间距 */
  margin-left: 20px;
}

.month-navigation .el-button {
  width: 100%; /* 设置按钮宽度一致 */
}

/* 调整 cards-container 和 month-navigation 的布局 */
.cards-container {
  display: flex;
  align-items: flex-start;
}

.month-navigation {
  margin-left: 20px;
  height: 150px; /* 与卡片高度一致 */
}

/* 增长情况图表容器样式 */
.chart-container {
  margin-top: 40px;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  min-height: 300px; /* 设置一个合适的最小高度 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 过渡效果 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.5s ease;
}

.slide-up-enter-from {
  transform: translateY(-100%);
}

.slide-up-enter-to {
  transform: translateY(0);
}

.slide-up-leave-from {
  transform: translateY(0);
}

.slide-up-leave-to {
  transform: translateY(-100%);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-down-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-down-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.slide-down-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
