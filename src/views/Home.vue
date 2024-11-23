<template>
  <div class="home-container">
    <!-- 背景图 -->
    <div class="background-overlay"></div>

    <!-- 鼠标拖尾效果的容器 -->
    <div id="mouse-trail"></div>

    <!-- 华丽的主页内容 -->
    <div class="content-container">
      <!-- 右上角的按钮容器 -->
      <div class="button-container">
        <el-button
          class="reset-password-button"
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
          <h3>您的本月佣金 [{{ currentMonthLabel }}]</h3>
          <div class="card-content">
            <template v-if="Object.keys(summaryCard1).length === 0">
              <p>暂无数据</p>
            </template>
            <div
              v-for="(amount, currency) in summaryCard1"
              :key="currency"
              class="currency-row"
            >
              <el-link @click="openDetails(currency)" type="primary"
                >{{ formatNumber(amount) }} {{ currency }}</el-link
              >
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
          >
            上一月
          </el-button>
          <el-button
            @click="changeMonth(1)"
            :disabled="isNextMonthDisabled"
            size="small"
          >
            下一月
          </el-button>
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

      <!-- 明细弹窗 -->
      <el-dialog
        v-model="detailDialogVisible"
        :title="selectedCurrency + ' 详情'"
        width="60%"
      >
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
  </div>
</template>

<script>
import { useStore } from '../store';
import { useRouter } from 'vue-router';
import { ref, onMounted, watch, computed, nextTick, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCurrentUserSummary } from '@/api/user';
import { ElMessage } from 'element-plus';
import ResetPasswordModal from '@/components/ResetPasswordModal.vue';
import Chart from 'chart.js/auto';
import dayjs from 'dayjs';
import Kursor from 'kursor';
import { gsap } from 'gsap';

export default {
  name: 'Home',
  components: {
    ResetPasswordModal,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const { t } = useI18n();

    const roleId = store.roleId;
    const resetPasswordModalVisible = ref(false);

    const openResetPasswordModal = () => {
      resetPasswordModalVisible.value = true;
    };

    const closeResetPasswordModal = () => {
      resetPasswordModalVisible.value = false;
    };

    // 当前选择的月份
    const selectedMonth = ref(dayjs().startOf('month'));

    const currentMonthLabel = computed(() =>
      dayjs(selectedMonth.value).format('MM/YYYY')
    );

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
    const summaryCard1 = ref({ '美元': 0 });

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

    // 格式化数字
    const formatNumber = (num) => {
      return new Intl.NumberFormat().format(num);
    };

    // 获取用户摘要信息
    const fetchUserSummary = async () => {
      try {
        const response = await getCurrentUserSummary(
          selectedMonth.value.format('YYYY-MM')
        );
        if (response.data.success) {
          const data = response.data.data;

          // 设置数据
          summaryCard1.value = data.currencyProfits?.reduce((acc, curr) => {
            acc[curr.currency] = curr.profits.reduce(
              (sum, profit) => sum + (profit.profit || 0),
              0
            );
            return acc;
          }, {}) || { USD: 0 };

          currencyProfits.value = data.currencyProfits || [];

          profitsData.value = currencyProfits.value.reduce((acc, curr) => {
            const profitsArray = Array.isArray(curr.profits) ? curr.profits : [];
            acc.push(...profitsArray);
            return acc;
          }, []);

          summaryCard1.value = currencyProfits.value.reduce((acc, curr) => {
            const profitsArray = Array.isArray(curr.profits) ? curr.profits : [];
            const totalProfit = profitsArray.reduce(
              (sum, profit) => sum + (profit.profit || 0),
              0
            );
            acc[curr.currency] = totalProfit;
            return acc;
          }, {});

          growthData.value = currencyProfits.value.map((currencyProfit) => ({
            currency: currencyProfit.currency,
            growthDatas: currencyProfit.growthDatas,
          }));

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
        }
      } catch (error) {
        console.error(t('utils.fetchSummaryFailed') || '获取用户摘要信息失败', error);
      }
    };

    // 更新图表数据
    const updateChartData = async (growthDataArray) => {
      if (!growthDataArray || growthDataArray.length === 0) {
        console.error('growthData is empty');
        return;
      }

      await nextTick();

      const labels = growthDataArray[0].growthDatas.map((item) => item.date);

      const datasets = [];
      const yAxes = {};

      growthDataArray.forEach((currencyData, index) => {
        const yAxisID = `y${index}`;

        datasets.push({
          label: currencyData.currency,
          data: currencyData.growthDatas.map((item) => item.profit),
          borderColor: getColorForCurrency(index),
          backgroundColor: 'rgba(0, 0, 0, 0)',
          fill: false,
          tension: 0.4,
          yAxisID: yAxisID,
        });

        yAxes[yAxisID] = {
          type: 'linear',
          display: true,
          position: index % 2 === 0 ? 'left' : 'right',
          title: {
            display: true,
            text: currencyData.currency,
          },
          grid: {
            drawOnChartArea: false,
          },
        };
      });

      if (!growthChartInstance) {
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
              ...yAxes,
            },
          },
        });
      } else {
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

    const getColorForCurrency = (index) => {
      const colors = [
        'rgba(75, 192, 192, 1)', // 绿色
        'rgba(255, 99, 132, 1)', // 红色
        'rgba(54, 162, 235, 1)', // 蓝色
        'rgba(255, 206, 86, 1)', // 黄色
        'rgba(153, 102, 255, 1)', // 紫色
        'rgba(255, 159, 64, 1)', // 橙色
      ];
      return colors[index % colors.length];
    };

    const goToWorkspace = () => {
      router.push('/');
    };

    const handleLogout = () => {
      store.logout();
      router.push('/login');
    };

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
      fetchUserSummary();
    };

    const openDetails = (currency) => {
      selectedCurrency.value = currency;
      currencyDetails.value = getCurrencyDetails(currency);
      detailDialogVisible.value = true;
    };

    const getCurrencyDetails = (currency) => {
      if (!profitsData.value || profitsData.value.length === 0) return [];

      return profitsData.value
        .filter((entry) => entry.currency === currency)
        .map((entry) => ({
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
      fetchUserSummary();

      // 初始化鼠标拖尾效果
      new Kursor({
        type: 4,
        color: '#C0C0C0',
        removeDefaultCursor: true,
      });

      // 使用 GSAP 为元素添加动画
      gsap.from('.summary-card', {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
      });
      gsap.from('.month-navigation .el-button', {
        opacity: 0,
        x: -50,
        duration: 1,
        delay: 0.5,
      });
      gsap.from('.chart-container', {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        delay: 1,
      });
    });

    onBeforeUnmount(() => {
      if (growthChartInstance) {
        growthChartInstance.destroy();
        growthChartInstance = null;
      }
    });

    return {
      roleId,
      resetPasswordModalVisible,
      openResetPasswordModal,
      closeResetPasswordModal,
      t,
      currentMonthLabel,
      changeMonth,
      isPrevMonthDisabled,
      isNextMonthDisabled,
      summaryCard1,
      formatNumber,
      detailDialogVisible,
      selectedCurrency,
      currencyDetails,
      openDetails,
      growthData,
      platformTotalRevenue,
      platformTotalWithdrawal,
      platformRevenueBalance,
      goToWorkspace,
      handleLogout,
      growthChartRef,
    };
  },
};
</script>

<style scoped>
.home-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  color: #000;
}

/* 背景图 */
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/src/assets/images/bg.jpg') no-repeat center center;
  background-size: cover;
  filter: brightness(0.7);
  z-index: -1;
}

/* 鼠标拖尾效果的容器 */
#mouse-trail {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* 华丽的主页内容容器 */
.content-container {
  position: relative;
  z-index: 1;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  height: 100%;
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
  height: 200px;
  padding: 20px;
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.5),
    0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
}

/* 卡片内容样式 */
.card-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 货币行样式 */
.currency-row {
  margin-bottom: 5px;
}

.currency-row .el-link {
  font-size: inherit;
}

/* 平台数据行样式 */
.platform-row {
  margin-bottom: 5px;
}

/* 月份导航按钮容器 */
.month-navigation {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-left: 20px;
}

.month-navigation .el-button {
  width: 100%;
}

/* 调整 cards-container 和 month-navigation 的布局 */
.cards-container {
  display: flex;
  align-items: flex-start;
}

.month-navigation {
  margin-left: 20px;
  height: 150px;
}

/* 增长情况图表容器样式 */
.chart-container {
  margin-top: 40px;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 鼠标指针隐藏 */
body {
  cursor: none;
}
</style>
