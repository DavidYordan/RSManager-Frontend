<!-- src/components/Sidebar.vue --> 

<template>
  <el-aside width="220px" style="height: 100vh; background-color: #f0f0f0;">
    <el-menu
      :default-active="activeMenu"
      :default-openeds="['dashboard']"
      class="el-menu-vertical-demo"
      router
      background-color="#f0f0f0"
      text-color="#333333"
      active-text-color="#FA1688"
      unique-opened
    >
      <!-- 仪表盘 (Dashboard) -->
      <!-- <el-menu-item v-if="[1, 2, 3, 4, 5].includes(store.roleId)" index="/workspace">
        <i class="el-icon-s-data"></i>
        <span>{{ $t('sidebar.dashboard') }}</span>
      </el-menu-item> -->

      <!-- 学员管理 (Scholar Management) -->
      <el-sub-menu v-if="[1, 2, 3, 8].includes(store.roleId)" index="scholar-management">
        <template #title>
          <i class="el-icon-user-solid"></i>
          <span>{{ $t('sidebar.scholarManagement') }}</span>
        </template>
        <el-menu-item v-if="[1, 2, 3, 8].includes(store.roleId)" index="/workspace/scholar-management/view-scholars">{{ $t('sidebar.viewScholars') }}</el-menu-item>
        <!-- <el-menu-item v-if="[1, 2].includes(store.roleId)" index="/workspace/scholar-management/manage">{{ $t('sidebar.manageScholars') }}</el-menu-item> -->
      </el-sub-menu>

      <!-- 申请管理 (Application Management) -->
      <el-sub-menu v-if="[1, 2, 3, 8].includes(store.roleId)" index="application-management">
        <template #title>
          <i class="el-icon-document"></i>
          <span>{{ $t('sidebar.applicationManagement') }}</span>
        </template>
        <el-menu-item v-if="[1, 2, 3, 8].includes(store.roleId)" index="/workspace/application-management/todo-applications">{{ $t('sidebar.toDo') }}</el-menu-item>
        <el-menu-item v-if="[1, 2, 3].includes(store.roleId)" index="/workspace/application-management/enroll">{{ $t('sidebar.enrollScholar') }}</el-menu-item>
        <el-menu-item v-if="[1, 2, 3, 8].includes(store.roleId)" index="/workspace/application-management/view">{{ $t('sidebar.viewApplications') }}</el-menu-item>
      </el-sub-menu>

      <!-- 投流管理 (Traffic Management) -->
      <el-sub-menu v-if="[1, 2, 3, 7].includes(store.roleId)" index="traffic-management">
        <template #title>
          <i class="el-icon-s-operation"></i>
          <span>{{ $t('sidebar.trafficManagement') }}</span>
        </template>
        <el-menu-item disabled v-if="[7].includes(store.roleId)" index="/workspace/traffic-management/to-do">{{ $t('sidebar.toDo') }}</el-menu-item>
        <el-menu-item v-if="[1, 2, 3, 7].includes(store.roleId)" index="/workspace/traffic-management/view-details">{{ $t('sidebar.viewDetails') }}</el-menu-item>
      </el-sub-menu>

      <!-- 财务管理 (Financial Management) -->
      <el-sub-menu v-if="[1, 2, 8].includes(store.roleId)" index="financial-management">
        <template #title>
          <i class="el-icon-money"></i>
          <span>{{ $t('sidebar.financialManagement') }}</span>
        </template>
        <el-menu-item disabled v-if="[1, 8].includes(store.roleId)" index="/workspace/financial-management/to-do">{{ $t('sidebar.toDo') }}</el-menu-item>
        <el-menu-item disabled v-if="[1, 8].includes(store.roleId)" index="/workspace/financial-management/withdraw">{{ $t('sidebar.withdraw') }}</el-menu-item>
        <el-menu-item v-if="[1, 8].includes(store.roleId)" index="/workspace/financial-management/query">{{ $t('sidebar.query') }}</el-menu-item>
        <el-menu-item v-if="[1, 8].includes(store.roleId)" index="/workspace/financial-management/view-payment-account">收款账户</el-menu-item>
      </el-sub-menu>

      <!-- 数据分析 (Data Analysis) -->
      <el-sub-menu v-if="[1, 2].includes(store.roleId)" index="data-analysis">
        <template #title>
          <i class="el-icon-data-line"></i>
          <span>{{ $t('sidebar.dataAnalysis') }}</span>
        </template>
        <el-menu-item disabled v-if="[1, 2].includes(store.roleId)" index="/workspace/data-analysis/genealogy-chart">{{ $t('sidebar.genealogyChart') }}</el-menu-item>
      </el-sub-menu>

      <!-- 系统管理 (System Management) -->
      <el-sub-menu v-if="[1].includes(store.roleId)" index="system-management">
        <template #title>
          <i class="el-icon-setting"></i>
          <span>{{ $t('sidebar.systemManagement') }}</span>
        </template>
        <el-menu-item v-if="[1].includes(store.roleId)" index="/workspace/system-management/create_user">{{ $t('sidebar.createUser') }}</el-menu-item>
        <el-menu-item v-if="[1].includes(store.roleId)" index="/workspace/system-management/global-config">{{ $t('sidebar.globalConfig') }}</el-menu-item>
        <el-menu-item v-if="[1].includes(store.roleId)" index="/workspace/system-management/detailed-config">{{ $t('sidebar.detailedConfig') }}</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script>
import { computed } from 'vue';
import { useStore } from '../store/index.js';
import { useRoute } from 'vue-router';

export default {
  name: 'Sidebar',
  setup() {
    const store = useStore();
    const route = useRoute();
    const activeMenu = computed(() => route.path);

    return {
      activeMenu,
      store
    };
  },
};
</script>

<style scoped>
/* 自定义样式 */
</style>
