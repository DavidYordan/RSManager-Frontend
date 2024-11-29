import request from '../utils/request';

// 获取所有项目类型
export function fetchAllTypes() {
    return request.get('/system/allglobalparams');
  }

// 获取所有项目类型
export function fetchAllRegions() {
    return request.get('/system/allregionprojects');
  }

// 按条件获取角色权限
export function searchUserPermissions(data) {
return request({
    url: '/system/searchuserpermissions',
    method: 'post',
    data
  })
}

export function updateRolePermissions(data) {
    return request({
      url: '/system/updaterolepermission',
      method: 'post',
      data
    });
}

export function updateuserpermission(data) {
    return request({
      url: '/system/updateuserpermission',
      method: 'POST',
      data
    });
}

export function deleteRegion(data) {
    return request({
      url: '/system/deleteregion',
      method: 'post',
      data
    });
}

export function updateRegion(data) {
    return request({
      url: '/system/updateregion',
      method: 'post',
      data
    });
}

export function updateProject(data) {
    return request({
      url: '/system/updateproject',
      method: 'post',
      data
    });
}
