import request from '../utils/request';

// 通过手机号查询用户ID
export function findIdByPhoneFromTbuser(platformAccount) {
  return request({
    url: '/tbuser/findIdByPhone',
    method: 'post',
    data: { platformAccount }
  })
}