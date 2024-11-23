// src/utils/request.js
import axios from 'axios';
import { removeToken } from './auth';
import router from '../router';
import i18n from '../i18n';

const { t } = i18n.global;

// 创建 Axios 实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || '/', // 确保设置了 API 的 base URL
  timeout: 10000, // 设置超时时间
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token'); // 直接从 sessionStorage 获取 token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.isDownload) {
      config.timeout = 60000; // 下载请求超时设置为60秒
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // 未认证，自动登出并重定向到登录页
        removeToken();
        // ElMessage.error(t('login.tokenExpired'));
        router.push({ name: 'Login' });
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
