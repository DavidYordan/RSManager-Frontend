// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

import ElementPlus, { install } from 'element-plus';
// import * as ElIcons from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
// import '@/assets/css/global.css';

import i18n from './i18n';

// 引入 tsParticles Vue 组件
// import Particles from '@tsparticles/vue3';
// import { loadSlim } from "@tsparticles/slim";


// 导入 Element Plus 的语言包
import enLocale from 'element-plus/es/locale/lang/en';
import zhCNLocale from 'element-plus/es/locale/lang/zh-cn';
import zhTWLocale from 'element-plus/es/locale/lang/zh-tw';

const app = createApp(App);

// 注册 Element Plus 的图标
// for (const key in ElIcons) {
//   app.component(key, ElIcons[key]);
// }

// 创建 Pinia 实例
const pinia = createPinia();

// let lastTrailTime = 0;
// document.addEventListener('mousemove', (e) => {
//   const now = Date.now();
//   if (now - lastTrailTime < 50) return; // 限制 50ms 创建一次拖尾
//   lastTrailTime = now;

//   const trail = document.createElement('div');
//   trail.className = 'mouse-trail';
//   trail.style.left = `${e.clientX}px`;
//   trail.style.top = `${e.clientY}px`;
//   document.body.appendChild(trail);
//   setTimeout(() => {
//     trail.remove();
//   }, 500);
// });

// 应用插件
app.use(pinia);
app.use(router);
app.use(i18n);

// 定义一个映射函数，将您的语言代码映射到 Element Plus 的语言包
function getElementPlusLocale(lang) {
  switch (lang) {
    case 'zh-cn':
      return zhCNLocale;
    case 'zh-tw':
      return zhTWLocale;
    default:
      return enLocale;
  }
}

// 应用 Element Plus，并传递初始的语言包
app.use(ElementPlus, {
  locale: getElementPlusLocale(i18n.global.locale.value),
});

// app.use(Particles, {
//   init: async (engine) => {
//     await loadSlim(engine);
//   },
// });

// 导入并执行全局路由守卫
import './permission.js';

app.mount('#app');

