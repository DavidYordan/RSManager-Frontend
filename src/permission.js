import router from './router';
import { useStore } from './store';
import i18n from './i18n';
import { ElMessage } from 'element-plus';

router.beforeEach(async (to, from, next) => {
  const store = useStore();
  const { t } = i18n.global;

  // 设置页面标题
  if (to.meta && to.meta.title) {
    document.title = t(to.meta.title);
  } else {
    document.title = t('app.title');
  }

  if (store.token) {
    if (to.name === 'Login' || to.name === 'Home') {
      if ([4, 5, 6].includes(store.roleId)) {
        return next();
      } else if (store.roleId === 7) {
        return next({ name: 'ToDoTraffic' });
      } else {
        return next({ name: 'ToDoApplications' });
      }
    }

    if ([4, 5, 6].includes(store.roleId)) {
      return next({ name: 'Login' });
    }

    if (to.meta && to.meta.roles) {
      if (Array.isArray(to.meta.roles)) {
        if (!to.meta.roles.includes(store.roleId)) {
          ElMessage.error(t('utils.unauthorized'));
          return next({ name: 'Login' });
        }
      } else {
        console.warn(`Route ${to.name} meta.roles is not an array`);
        return next({ name: 'Login' });
      }
    }

    if (to.name === 'Workspace') {
        return next({ name: 'Login' });
    }

    return next();

  } else {
    if (to.name !== 'Login') {
      return next({ name: 'Login' });
    } else {
      return next();
    }
  }
});
