export function getHomeInfo() {
    return request({
      url: '/user/gethomeinfo',
      method: 'get'
  });
}