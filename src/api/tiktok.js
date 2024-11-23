import request from '../utils/request';

// 检查tiktok账号是否被占用
export function checkTiktok(tiktokAccount) {
    return request({
      url: '/tiktok/checktiktok',
      method: 'post',
      data: { tiktokAccount }
  });
}