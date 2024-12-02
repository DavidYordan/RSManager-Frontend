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

// updateProject
export function updateProject(data) {
    return request({
      url: '/system/updateproject',
      method: 'post',
      data
    });
}

// updateRegionCurrency
export function updateRegionCurrency(data) {
    return request({
      url: '/system/updateregioncurrency',
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

export function updateRegionProjects(data) {
    return request({
      url: '/system/updateregionprojects',
      method: 'post',
      data
    });
}

export function deleteRegionProjects(data) {
    return request({
      url: '/system/deleteregionprojects',
      method: 'post',
      data
    });
}
