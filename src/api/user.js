import request from '../utils/request';

// 获取当前用户摘要
export function getCurrentUserSummary(selectedMonth) {
  return request({
    url: '/user/summary',
    method: 'post',
    data: { selectedMonth }
  });
}

// 获取当前用户信息
export function getCurrentUserInfo() {
  return request({
    url: '/user/info',
    method: 'get',
  });
}

// exists
export function userExists(username) {
  return request({
    url: '/user/exists',
    method: 'post',
    data: { username }
  });
}

// 获取用户列表
export function getUsers(params) {
  return request({
    url: '/user',
    method: 'get',
    params,
  });
}

// 获取用户列表
export function checkInviter(username) {
  return request({
    url: '/user/checkinviter',
    method: 'post',
    data: { username }
  });
}

// 添加用户
export function superCreate(data) {
  return request({
    url: '/user/super_create',
    method: 'post',
    data,
  });
}

// 更新用户信息
export function updateUser(data) {
  return request({
    url: `/user/update`,
    method: 'post',
    data,
  });
}

// 查找用户
export function findUser(data) {
  return request({
    url: `/user/finduser`,
    method: 'post',
    data,
  });
}

// 查看用户信息
export function fetchUsers(data) {
  return request({
    url: `/user/info`,
    method: 'post',
    data,
  });
}



// 删除用户
export function deleteUser(id) {
  return request({
    url: `/user/${id}`,
    method: 'delete',
  });
}

// 通过手机号查询用户ID
export function findIdByPhoneFromUser(username) {
return request({
  url: '/user/findIdByUsername',
  method: 'post',
  data: { username }
  });
}

// 重置密码
export function resetPassword(data) {
  return request({
    url: '/user/resetPassword',
    method: 'post',
    data,
  });
}

// 条件查询
export function searchusers(data) {
  return request({
    url: '/user/search',
    method: 'post',
    data,
  });
}