// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Layout from '@/components/Layout.vue';
import Home from '@/views/Home.vue';

// 路由定义
const routes = [
  // 登录页面
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  // 需要认证的布局
  {
    path: '/workspace',
    name: 'Workspace',
    component: Layout,
    meta: { roles: [1, 2, 3, 4, 5, 7, 8] },
    children: [
      // {
      //   path: '',
      //   name: 'Dashboard',
      //   component: () => import('../views/Dashboard.vue'),
      //   meta: { 
      //     title: 'pageTitle.Dashboard',
      //     roles: [1, 2, 3, 4, 5, 7, 8]
      //   },
      // },
      // 学员管理 (Scholar Management)
      {
        path: 'scholar-management',
        name: 'ScholarManagement',
        component: () => import('../views/ScholarManagement.vue'),
        meta: { 
          title: 'pageTitle.ScholarManagement',
          roles: [1, 2, 3, 4, 5, 7, 8]
        },
        children: [
          {
            path: 'view-scholars',
            name: 'ViewScholars',
            component: () => import('../views/ViewScholars.vue'),
            meta: { 
              title: 'pageTitle.ViewScholars',
              roles: [1, 2, 3, 4, 5, 7, 8],
            },
          },
          {
            path: 'manage',
            name: 'ManageScholars',
            component: () => import('../views/ManageScholars.vue'),
            meta: { 
              title: 'pageTitle.ManageScholars',
              roles: [1, 2, 3, 4, 5, 7, 8],
            },
          }
        ]
      },
      // 申请管理 (Application Management)
      {
        path: 'application-management',
        name: 'ApplicationManagement',
        component: () => import('../views/ApplicationManagement.vue'),
        meta: { 
          title: 'pageTitle.ApplicationManagement',
          roles: [1, 2, 3, 4, 5, 7, 8],
        },
        children: [
          {
            path: 'enroll',
            name: 'EnrollScholar',
            component: () => import('../views/EnrollScholar.vue'),
            meta: { 
              title: 'pageTitle.EnrollScholar',
              roles: [1, 2, 3, 4, 5, 7, 8]
            },
          },
          {
            path: 'to-do',
            name: 'ToDoApplications',
            component: () => import('../views/ToDoApplications.vue'),
            meta: { 
              title: 'pageTitle.ToDoApplications',
              roles: [1, 2, 3, 8],
            },
          },
          {
            path: 'view',
            name: 'ViewApplications',
            title: 'pageTitle.ViewApplications',
            component: () => import('../views/ViewApplications.vue'),
            meta: { 
              title: 'pageTitle.ViewApplications',
              roles: [1, 2, 3, 4, 5, 7, 8]
            },
          }
        ]
      },
      // 投流管理 (Traffic Management)
      {
        path: 'traffic-management',
        name: 'TrafficManagement',
        component: () => import('../views/TrafficManagement.vue'),
        meta: { 
          title: 'pageTitle.TrafficManagement',
          roles: [1, 2, 3, 4, 5, 7, 8]
        },
        children: [
          {
            path: 'to-do',
            name: 'ToDoTraffic',
            component: () => import('../views/ToDoTraffic.vue'),
            meta: { 
              title: 'pageTitle.ToDoTraffic',
              roles: [1, 2, 3, 4, 5, 7, 8]
            },
          },
          {
            path: 'view-details',
            name: 'ViewTrafficDetails',
            component: () => import('../views/ViewTrafficDetails.vue'),
            meta: { 
              title: 'pageTitle.ViewTrafficDetails',
              roles: [1, 2, 3, 4, 5, 7, 8]
            },
          }
        ]
      },
      // <el-sub-menu v-if="[1, 2, 8].includes(store.roleId)" index="financial-management">
      //   <template #title>
      //     <i class="el-icon-money"></i>
      //     <span>{{ $t('sidebar.financialManagement') }}</span>
      //   </template>
      //   <el-menu-item disabled v-if="[1, 2, 8].includes(store.roleId)" index="/workspace/financial-management/to-do">{{ $t('sidebar.toDo') }}</el-menu-item>
      //   <el-menu-item disabled v-if="[1, 2, 8].includes(store.roleId)" index="/workspace/financial-management/withdraw">{{ $t('sidebar.withdraw') }}</el-menu-item>
      //   <el-menu-item disabled v-if="[1, 2, 8].includes(store.roleId)" index="/workspace/financial-management/query">{{ $t('sidebar.query') }}</el-menu-item>
      // </el-sub-menu>
      // 财务管理 (Financial Management)
      {
        path: 'financial-management',
        name: 'FinancialManagement',
        component: () => import('../views/FinancialManagement.vue'),
        meta: { 
          title: 'pageTitle.FinancialManagement',
          roles: [1, 8]
        },
        children: [
          {
            path: 'to-do',
            name: 'ToDoFinancial',
            component: () => import('../views/ToDoFinancial.vue'),
            meta: { 
              title: 'pageTitle.ToDoFinancial',
              roles: [1, 8]
            },
          },
          {
            path: 'withdraw',
            name: 'Withdraw',
            component: () => import('../views/Withdraw.vue'),
            meta: { 
              title: 'pageTitle.Withdraw',
              roles: [1, 8]
            },
          },
          {
            path: 'query',
            name: 'QueryFinancial',
            component: () => import('../views/ViewFinancial.vue'),
            meta: { 
              title: 'pageTitle.QueryFinancial',
              roles: [1, 8]
            },
          }
        ]
      },
      // 数据分析 (Data Analysis)
      {
        path: 'data-analysis',
        name: 'DataAnalysis',
        component: () => import('../views/DataAnalysis.vue'),
        meta: { 
          roles: [1, 2, 3, 4, 5, 7, 8]
        },
        children: [
          {
            path: 'genealogy-chart',
            name: 'GenealogyChart',
            component: () => import('../views/GenealogyChart.vue'),
            meta: { 
              title: 'pageTitle.GenealogyChart',
              roles: [1, 2, 3, 4, 5, 7, 8]
            },
          }
        ]
      },
      // 系统管理 (System Management)
      {
        path: 'system-management',
        name: 'SystemManagement',
        component: () => import('../views/SystemManagement.vue'),
        meta: { 
          title: 'pageTitle.SystemManagement',
          roles: [1]
        },
        children: [
          {
            path: 'create_user',
            name: 'CreateUser',
            component: () => import('../views/CreateUser.vue'),
            meta: { 
              title: 'pageTitle.CreateUser',
              roles: [1]
            },
          },
          {
            path: 'global-config',
            name: 'GlobalConfig',
            component: () => import('../views/GlobalConfig.vue'),
            meta: { 
              title: 'pageTitle.GlobalConfig',
              roles: [1]
            },
          },
          {
            path: 'detailed-config',
            name: 'DetailedConfig',
            component: () => import('../views/DetailedConfig.vue'),
            meta: { 
              title: 'pageTitle.DetailedConfig',
              roles: [1]
            },
          }
        ]
      }
      // 添加更多路由...
    ],
  },
  // 所有未匹配的路径重定向到登录页面
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
