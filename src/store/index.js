// src/store/index.js
import { defineStore } from 'pinia';
import { login as apiAuthLogin } from '@/api/auth'
import router from '../router';

export const useStore = defineStore('user', {
  state: () => ({
    token: sessionStorage.getItem('token') || null,
    userId: sessionStorage.getItem('userId') ? Number(sessionStorage.getItem('userId')) : null,
    username: sessionStorage.getItem('username') || null,
    roleId: sessionStorage.getItem('roleId') ? Number(sessionStorage.getItem('roleId')) : null,
  }),
  actions: {
    // 登录方法
    async login(credentials) {
      try {
        const response = await apiAuthLogin(credentials);
        if (response.data.token) {
          this.token = response.data.token;
          this.userId = response.data.userId;
          this.username = response.data.username;
          this.roleId = response.data.roleId;
          sessionStorage.setItem('token', this.token);
          sessionStorage.setItem('userId', this.userId);
          sessionStorage.setItem('username', this.username);
          sessionStorage.setItem('roleId', this.roleId);
        }
      } catch (error) {
        console.error(error);
        throw error; // 重新抛出错误以便在组件中处理
      }
    },
    // 登出方法
    logout() {
      router.push({ name: 'Login' });
      this.token = null;
      this.userId = null;
      this.username = null;
      this.roleId = null;
      this.userInfo = null;
      this.userSummary = null;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('roleId');
      sessionStorage.removeItem('userSummary');
    },
  },
});
