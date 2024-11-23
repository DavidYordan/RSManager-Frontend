<template>
  <div class="dashboard" v-if="hasPermission">
    <el-row :gutter="20">
      <!-- 第一行 -->
      <!-- <el-col :span="8" v-for="(item, index) in rowOne" :key="'row1-' + index">
        <el-card shadow="hover" class="dashboard-card">
          <div class="card-content">
            <div class="card-label">{{ item.label }}</div>
            <div class="card-value">{{ item.value }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20"> -->
      <!-- 第二行 -->
      <el-col :span="8" v-for="(item, index) in rowTwo" :key="'row2-' + index">
        <el-card shadow="hover" class="dashboard-card">
          <div class="card-content">
            <div class="card-label">{{ item.label }}</div>
            <div class="card-value">{{ item.value }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- 第三行 -->
      <el-col :span="8" v-for="(item, index) in rowThree" :key="'row3-' + index">
        <el-card shadow="hover" class="dashboard-card">
          <div class="card-content">
            <div class="card-label">{{ item.label }}</div>
            <div class="card-value">{{ item.value }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- 第四行 -->
      <el-col :span="8" v-for="(item, index) in rowFour" :key="'row4-' + index">
        <el-card shadow="hover" class="dashboard-card">
          <div class="card-content">
            <div class="card-label">{{ item.label }}</div>
            <div class="card-value">{{ item.value }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from '../store/index.js';
import { useI18n } from 'vue-i18n';

export default {
  setup() {
    const store = useStore();
    const { t } = useI18n();

    const rowOne = computed(() => [
      { label: t('Dashboard.totalRevenue'), value: 0 },
      { label: t('Dashboard.revenueBalance'), value: 0 },
      { label: t('Dashboard.totalWithdrawal'), value: 0 }
    ]);

    const rowTwo = computed(() => [
      {
        label: t('Dashboard.profit'),
        value: 0
      },
      {
        label: t('Dashboard.balance'),
        value: 0},
      { label: t('Dashboard.withdrawal'), value: 0 }
    ]);

    const rowThree = computed(() => [
      { label: t('Dashboard.platformTotalRevenue'), value: 0 },
      { label: t('Dashboard.platformRevenueBalance'), value: 0 },
      { label: t('Dashboard.platformTotalWithdrawal'), value: 0 }
    ]);

    const rowFour = computed(() => [
      { label: t('Dashboard.totalLearningCost'), value: 0 },
      { label: t('Dashboard.inviteCount'), value: 0 },
      { label: t('Dashboard.platformInviteCount'), value: 0 }
    ]);

    const hasPermission = computed(() => [1, 2, 3, 4, 5].includes(store.roleId));

    return { rowOne, rowTwo, rowThree, rowFour, hasPermission };
  }
};

</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard-card {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
}

.card-content {
  text-align: center;
}

.card-label {
  font-size: 16px;
  color: #666;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  margin-top: 8px;
  color: #333;
}
</style>
