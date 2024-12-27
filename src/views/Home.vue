<template>
  <div class="main-container" @click="handleClickOutside">
    <vue-particles id="tsparticles" :options="particlesOptions"/>
    <div>
      <div class="plaque-container slide-ttb">
        <div class="plaque">
          <h4>欢迎</h4>
          <h4>{{ store.username }}</h4>
        </div>

        <div class="rope-container" @click.stop="openDropdown" :class="{ 'disabled': dropdownVisible }">菜单</div>

        <div class="dropdown-menu" :class="{ 'active': dropdownVisible }">
          <div class="link-container" @click="openResetPasswordModal">重置密码</div>
          <div class="link-container" @click="handleLogout">注销</div>
        </div>
      </div>

      <div class="cards-container">
        <div class="card-container slide-ltr">
          <div class="corner-tag corner-pre" @click="handlePreviousMonth" :class="{ 'disabled': isPrevMonthDisabled }">上月</div>
          <div class="corner-tag corner-next" @click="handleNextMonth" :class="{ 'disabled': isNextMonthDisabled}">下月</div>
          <div class="card-title">
            <h3>本月佣金</h3>
            <h4>{{ currentMonthLabel }}</h4>
          </div>
          <div class="card-content" :class="fadeClass" @animationend="onAnimationEnd">
            <div
              v-for="(amount, currencyName) in summaryCard1"
              :key="currencyName"
              class="link-container"
              @click="openProfitsDialog(currencyName)"
            >
              <a>{{ formatNumber(amount) }} {{ currencyName }}</a>
            </div>
            <div>
                总邀请人数：{{ formatNumber(inviteCount) }}
            </div>
          </div>
        </div>

        <div class="card-container slide-rtl">
          <div class="card-title">
            <h3>短剧平台</h3>
            <h3>汇总</h3>
          </div>
          <div class="card-content">
            <div class="link-container" @click="openTotalRevenueDialog()">
              <a >总收益：{{ formatNumber(platformTotalRevenue) }} 美元</a>
            </div>
            <div>已提现：{{ formatNumber(platformTotalWithdrawal) }} 美元</div>
            <div>可提现：{{ formatNumber(platformRevenueBalance) }} 美元</div>
            <div>总邀请人数：{{ formatNumber(platformInviteCount) }}</div>
          </div>
        </div>
      </div>

      <div class="chart-container slide-btt">
        <template v-if="growthData && growthData.length > 0">
          <canvas ref="growthChartRef"></canvas>
        </template>
        <template v-else>
          <el-empty description="暂无数据"></el-empty>
        </template>
      </div>

      <el-dialog
        v-model="detailDialogVisible"
        :title="selectedCurrencyName + ' 详情'"
        width="60%"
      >
        <el-table :data="currencyNameDetails" style="width: 100%">
          <el-table-column prop="regionName" label="区域"></el-table-column>
          <el-table-column prop="fullname" label="姓名"></el-table-column>
          <el-table-column prop="currencyName" label="币种"></el-table-column>
          <el-table-column prop="paymentDate" label="付款日期"></el-table-column>
          <el-table-column prop="projectName" label="项目名称"></el-table-column>
          <el-table-column prop="projectAmount" label="项目金额"></el-table-column>
          <el-table-column prop="actual" label="支付金额"></el-table-column>
          <el-table-column prop="profit" label="分佣"></el-table-column>
          <el-table-column prop="rate" label="分佣比例"></el-table-column>
          <el-table-column prop="inviterFullname" label="邀请人姓名"></el-table-column>
        </el-table>
        <template #footer>
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </template>
      </el-dialog>

      <ResetPasswordModal v-model="resetPasswordModalVisible" />

      <ShowProfits
        v-if="profitsDialogData"
        :title="profitsDialogTitle"
        :data="profitsDialogData"
        ref="showProfitsRef"
        maxWidth="90%"
        maxHeight="70vh"
      />

      <ShowTotalRevenues
        v-if="totalRevenuesData"
        :data="totalRevenuesData"
        ref="ShowTotalRevenuesRef"
        maxWidth="90%"
        maxHeight="70vh"
      />
    </div>
  </div>
</template>

<script>
import { useStore } from '../store';
import { useRouter } from 'vue-router';
import { ref, onMounted, computed, nextTick, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCurrentUserSummary } from '@/api/user';
import { ElMessage } from 'element-plus';
import ResetPasswordModal from '@/components/ResetPasswordModal.vue';
import ShowProfits from '@/components/ShowProfits.vue';
import ShowTotalRevenues from '@/components/ShowTotalRevenues.vue';
import Chart from 'chart.js/auto';
import dayjs from 'dayjs';
import { tsParticles } from "@tsparticles/engine";
import { loadEmittersPlugin } from "@tsparticles/plugin-emitters";
import particlesOptions from '@/particles-config.js';

export default {
  name: 'Home',
  components: {
    ResetPasswordModal,
    ShowProfits,
    ShowTotalRevenues,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const { t } = useI18n();

    const roleId = store.roleId;
    const dropdownVisible = ref(false);
    const resetPasswordModalVisible = ref(false);

    // Generic Dialog
    const showProfitsRef = ref(null);
    const profitsDialogTitle = ref('');
    const profitsDialogData = ref([]);
    const ShowTotalRevenuesRef = ref(null);
    const totalRevenuesData = ref([]);

    const openDropdown = () => {
      dropdownVisible.value = true;
    };

    const handleClickOutside = () => {
      if (dropdownVisible.value) {
        dropdownVisible.value = false;
      }
    };

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
    const inviteCount = ref(0);

    // 短剧平台汇总数据
    const platformTotalRevenue = ref(0);
    const platformTotalWithdrawal = ref(0);
    const platformRevenueBalance = ref(0);
    const platformInviteCount = ref(0);

    const currencyProfits = ref([]);
    const profitsData = ref([]);

    // 图表引用和实例
    const growthChartRef = ref(null);
    let growthChartInstance = null;

    // 明细弹窗
    const detailDialogVisible = ref(false);
    const selectedCurrencyName = ref('');
    const currencyNameDetails = ref([]);

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
            acc[curr.currencyName] = curr.profits.reduce(
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
            acc[curr.currencyName] = totalProfit;
            return acc;
          }, {});

          growthData.value = currencyProfits.value.map((currencyNameProfit) => ({
            currencyName: currencyNameProfit.currencyName,
            growthDatas: currencyNameProfit.growthDatas,
          }));

          platformTotalRevenue.value = data.moneySum || 0;
          platformTotalWithdrawal.value = data.cashOut || 0;
          platformRevenueBalance.value = data.money || 0;
          inviteCount.value = data.inviteCount || 0;
          platformInviteCount.value = data.platformInviteCount || 0;
          totalRevenuesData.value = data.inviteDailyMoneySumDTOs || [];

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

      growthDataArray.forEach((currencyNameData, index) => {
        const yAxisID = `y${index}`;

        datasets.push({
          label: currencyNameData.currencyName,
          data: currencyNameData.growthDatas.map((item) => item.profit),
          borderColor: getColorForCurrencyName(index),
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
            text: currencyNameData.currencyName,
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
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
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
            },
          },
          ...yAxes,
        };
        growthChartInstance.update();
      }
    };

    const getColorForCurrencyName = (index) => {
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

    const openDetails = (currencyName) => {
      selectedCurrencyName.value = currencyName;
      currencyNameDetails.value = getCurrencyNameDetails(currencyName);
      detailDialogVisible.value = true;
    };

    const getCurrencyNameDetails = (currencyName) => {
      if (!profitsData.value || profitsData.value.length === 0) return [];

      return profitsData.value
        .filter((entry) => entry.currencyName === currencyName)
        .map((entry) => ({
          regionName: entry.regionName,
          fullname: entry.userFullname,
          currencyName: entry.currencyName,
          projectName: entry.projectName,
          projectAmount: Number(entry.projectAmount).toFixed(2),
          actual: Number(entry.actual).toFixed(2),
          profit: Number(entry.profit).toFixed(2),
          rate: entry.rate,
          paymentDate: dayjs(entry.paymentDate).format('YYYY-MM-DD'),
          inviterFullname: entry.inviterFullname,
          inviterRoleId: entry.inviterRoleId,
        }));
    };

    const openTotalRevenueDialog = () => {
      if (totalRevenuesData.value.length === 0) {
        ElMessage.warning('无相关数据');
        return;
      }

      if (ShowTotalRevenuesRef.value) {
        ShowTotalRevenuesRef.value.openDialog();
      }
    };

    const openProfitsDialog = (currencyName) => {
      if (profitsData.value.length === 0) {
        ElMessage.warning('无相关数据');
        return;
      }

      profitsDialogTitle.value = '分佣明细';
      profitsDialogData.value = profitsData.value.filter((entry) => entry.currencyName === currencyName);
      if (showProfitsRef.value) {
        showProfitsRef.value.openDialog();
      }
    };

    const fadeClass = ref('fade-in');

    const changeMonth = (direction) => {
      if (direction === -1) {
        selectedMonth.value = selectedMonth.value.subtract(1, 'month');
      } else if (direction === 1) {
        selectedMonth.value = selectedMonth.value.add(1, 'month');
      }
      summaryCard1.value = {};
      inviteCount.value = 0;
      fetchUserSummary();
    };

    const handlePreviousMonth = () => {
      fadeClass.value = 'fade-out';
      changeMonth(-1);
    };

    const handleNextMonth = () => {
      fadeClass.value = 'fade-out';
      changeMonth(1);
    };

    const onAnimationEnd = () => {
      if (fadeClass.value === 'fade-out') {
        fadeClass.value = 'fade-in';
      }
    };

    onMounted(async () => {
      await loadEmittersPlugin(tsParticles);
      fetchUserSummary();
    });

    onBeforeUnmount(() => {
      if (growthChartInstance) {
        growthChartInstance.destroy();
        growthChartInstance = null;
      }
    });

    return {
      store,
      roleId,
      handleClickOutside,
      dropdownVisible,
      openDropdown,
      resetPasswordModalVisible,
      openResetPasswordModal,
      closeResetPasswordModal,
      t,
      currentMonthLabel,
      fadeClass,
      onAnimationEnd,
      changeMonth,
      handlePreviousMonth,
      handleNextMonth,
      isPrevMonthDisabled,
      isNextMonthDisabled,
      summaryCard1,
      formatNumber,
      detailDialogVisible,
      selectedCurrencyName,
      currencyNameDetails,
      openDetails,
      growthData,
      platformTotalRevenue,
      platformTotalWithdrawal,
      platformRevenueBalance,
      goToWorkspace,
      handleLogout,
      growthChartRef,
      showProfitsRef,
      profitsDialogTitle,
      profitsDialogData,
      ShowTotalRevenuesRef,
      totalRevenuesData,
      openTotalRevenueDialog,
      openProfitsDialog,
      inviteCount,
      platformInviteCount,
      particlesOptions
    };
  },
};
</script>

<style lang="scss" scoped>

body.mobile #tsparticles {
  display: none;
}

.plaque-container {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9;

  .mobile & {
    position: relative;
    margin-bottom: 3em;
  }

  .plaque {
    min-width: 200px;
    background: $image-ct_silver-avif no-repeat center/cover;
    text-align: center;
    padding: 10px;
    box-shadow: -1px 1px 1px 0px #c0c0c0,
                -5px 7px 10px 2px rgba(0, 0, 0, 0.5);
    font-size: 1.2em;
    font-weight: bold;
    color: #602020;
    text-shadow: 1px 1px 1px #FBF7F3,
                -1px -1px 1px #602020;

    .mobile & {
      width: 100%;
    }
  }

  .rope-container {
    position: absolute;
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
    left: -1em;
    bottom: -2em;
    transform: rotate(10deg);

    &:hover {
      transform: rotate(0deg);
    }

    &:active {
      transform: rotate(0deg);
    }
  }

  .dropdown-menu {
    position: absolute;
    width: 100%;
    background: transparent;
    display: flex;
    flex-direction: column;

    transform: translateY(-200%);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;

    &.active {
      transform: translateY(0);
      opacity: 1;
    }

    .menu-item {
      color: #3A2B23;
      text-shadow: 1px 1px 1px #3A2B23, -1px -1px 1px #FBF7F3;
      padding: 0.4em 0.8em;
      text-align: center;
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 4px 4px 5px #BFA383, 10px 8px 12px rgba(0,0,0,0.5);
      }
      &:active {
        transform: translateY(2px);
      }
    }
  }

  &.slide-ttb {
    animation: slide-ttb 0.5s forwards;
  }

  @keyframes slide-ttb {
    from {
      transform: translateY(-200%);
    }
    to {
      transform: translateY(0);
    }
  }
}

.cards-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 5%;
  width: 100%;

  .mobile & {
    flex-direction: column;
    gap: 3em;
  }

  .card-container {
    width: 350px;
    height: 200px;

    .mobile & {
      width: 100%;
    }

    &.slide-ltr {
      animation: slide-ltr 0.5s forwards;
    }

    &.slide-rtl {
      animation: slide-rtl 0.5s forwards;
    }

    @keyframes slide-ltr {
      from {
        transform: translateX(-200%);
      }
      to {
        transform: translateX(0);
      }
    }

    @keyframes slide-rtl {
      from {
        transform: translateX(200%);
      }
      to {
        transform: translateX(0);
      }
    }

    .corner-tag {
      position: absolute;
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
    }

    .corner-pre {
      left: -1em;
      top: -1em;
      transform: rotate(-10deg);
    }

    .corner-next {
      left: -1em;
      bottom: -1em;
      transform: rotate(10deg);
    }

    .corner-tag:hover {
      transform: rotate(0deg);
    }

    .corner-tag:active {
      transform: rotate(0deg);
    }
  }

  .card-content.fade-in {
    animation: fade-in 0.5s forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .card-content.fade-out {
    animation: fade-out 0.5s forwards;
  }

  @keyframes fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
}

.chart-container {
  margin-top: 60px;
  width: auto;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  // align-items: center;

  &.slide-btt {
    animation: slide-btt 0.5s forwards;
  }

  @keyframes slide-btt {
    from {
      transform: translateY(200%);
    }
    to {
      transform: translateY(0);
    }
  }
}

.disabled {
  pointer-events: none;
  opacity: 0;
}

</style>
