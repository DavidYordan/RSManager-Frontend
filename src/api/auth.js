import request from '../utils/request';

// 获取验证码图片
export function getCaptcha() {
  return request.get('/auth/captcha', {
    responseType: 'blob',
  });
}

// 登录
export function login(data) {
  return request.post('/auth/login', data);
}

// 刷新 Token
export function refreshToken() {
  return request.post('/refresh-token');
}

//获取用户信息
export function getUserInfo() {
    return request.get('/user/info')
}

// 登出
export function logout() {
  return request.post('/auth/logout');
}