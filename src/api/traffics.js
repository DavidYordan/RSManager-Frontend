import request from '../utils/request';

// 条件查询
export function searchTraffics(data) {
    return request({
      url: '/traffic/search',
      method: 'post',
      data,
    });
  }