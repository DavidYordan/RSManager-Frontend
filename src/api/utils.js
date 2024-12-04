import request from '../utils/request';

// 获取所有项目类型
export function fetchAllTypes() {
    return request.get('/system/allglobalparams');
  }

// 获取所有项目类型
export function fetchAllRegions() {
    return request.get('/system/allregionprojects');
  }

// updateProject
export function updateProject(data) {
    return request({
      url: '/system/updateproject',
      method: 'post',
      data
    });
}

// deleteProject
export function deleteProject(data) {
    return request({
      url: '/system/deleteproject',
      method: 'post',
      data
    });
}

// addproject
export function addProject(data) {
    return request({
      url: '/system/addproject',
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

// deleteregioncurrency
export function deleteRegionCurrency(data) {
    return request({
      url: '/system/deleteregioncurrency',
      method: 'post',
      data
    });
}

// addregioncurrency
export function addRegionCurrency(data) {
    return request({
      url: '/system/addregioncurrency',
      method: 'post',
      data
    });
}

// updateregionprojects
export function updateRegionProjects(data) {
    return request({
      url: '/system/updateregionprojects',
      method: 'post',
      data
    });
}

// deleteregionprojects
export function deleteRegionProjects(data) {
    return request({
      url: '/system/deleteregionprojects',
      method: 'post',
      data
    });
}

// addregionprojects
export function addRegionProjects(data) {
    return request({
      url: '/system/addregionprojects',
      method: 'post',
      data
    });
}

// searchrolepermissions
export function searchRolePermissions(data) {
    return request({
      url: '/system/searchrolepermissions',
      method: 'post',
      data
    });
}

// updaterolepermission
export function updateRolePermission(data) {
    return request({
      url: '/system/updaterolepermission',
      method: 'post',
      data
    });
}