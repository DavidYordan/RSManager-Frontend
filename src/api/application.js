// src/api/application.js
import request from '../utils/request';

// 创建申请单
export function createApplication(formData) {
  return request({
    url: '/application/create',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 修改申请单
export function updateApplication(data) {
  return request({
    url: '/application/update',
    method: 'post',
    data
  });
}

// 提交审核
export function submitApplication(data) {
  return request({
    url: `/application/submit`,
    method: 'post',
    data
  });
}

// 撤回审核
export function withdrawApplication(data) {
  return request({
    url: `/application/withdraw`,
    method: 'post',
    data
  });
}

// 审核
export function approveFinanceApplication(data) {
  return request({
    url: `/application/approvefinance`,
    method: 'post',
    data
  });
}

// 审核申请链接
export function approveLinkApplication(data) {
  return request({
    url: `/application/approvelink`,
    method: 'post',
    data
  });
}

// 上传合同
export function uploadContractFile(formData) {
  return request({
    url: `/application/uploadcontractfiles`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 提交链接申请
export function submitForLink(data) {
  return request({
    url: `/application/submitforlink`,
    method: 'post',
    data
  });
}

// 完成申请
export function finishedApplication(data) {
  return request({
    url: `/application/finished`,
    method: 'post',
    data
  });
}

// 归档申请
export function archiveApplication(data) {
  return request({
    url: `/application/archive`,
    method: 'post',
    data
  });
}

// 无条件查看所有申请
export function listApplications(data) {
  return request({
    url: `/application/list`,
    method: 'post',
    data
  });
}

// 查询申请
export function searchApplications(data) {
  return request({
    url: `/application/search`,
    method: 'post',
    data
  });
}

// 查询待办申请
export function searchTodoApplications(data) {
  return request({
    url: `/application/searchtodo`,
    method: 'post',
    data
  });
}

// 查看单个申请
export function getApplicationInfo(data) {
  return request({
    url: `/application/info`,
    method: 'post',
    data
  });
}

// 查询支付文件
export function getPaymentFileSummary(data) {
  return request({
    url: `/application/files/paymentSummary`,
    method: 'post',
    data
  });
}

// 查询文件摘要
export function getAllFilesSummary(data) {
  return request({
    url: `/application/files/allfilessummary`,
    method: 'post',
    data
  });
}

// 下载文件
export function downloadFile(data) {
  return request({
    url: `/application/file`,
    method: 'post',
    data,
    responseType: 'blob',
    isDownload: true
  });
}

// 添加支付记录
export function addPayment(formData) {
  return request({
    url: `/application/payment/add`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// approvePaymentRecord
export function approvePaymentRecord(data) {
  return request({
    url: `/application/payment/approve`,
    method: 'post',
    data
  });
}

// disApprovePaymentRecord
export function disApprovePaymentRecord(data) {
  return request({
    url: `/application/payment/disapprove`,
    method: 'post',
    data
  });
}

// 删除支付记录
export function deletePaymentRecord(data) {
  return request({
    url: `/application/payment/delete`,
    method: 'post',
    data
  });
}

// 修改支付记录
export function updatePaymentRecord(formData) {
  return request({
    url: `/application/payment/update`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 添加合同
export function addContract(formData) {
  return request({
    url: `/application/contract/add`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 取消申请
export function cancelApplication(data) {
  return request({
    url: `/application/cancel`,
    method: 'post',
    data
  });
}

// 激活申请
export function activateApplication(data) {
  return request({
    url: `/application/activate`,
    method: 'post',
    data
  });
}

export function validateInviter(inviterName) {
  return request({
    url: `/application/validateinviter`,
    method: 'post',
    data: { inviterName }
  });
}

// addroleediting
export function addRoleEditing(data) {
  return request({
    url: `/application/addroleediting`,
    method: 'post',
    data
  });
}

// upgraderoleediting
export function upgradeRoleEditing(data) {
  return request({
    url: `/application/upgraderoleediting`,
    method: 'post',
    data
  });
}

// cancelroleediting
export function cancelRoleEditing(data) {
  return request({
    url: `/application/cancelroleediting`,
    method: 'post',
    data
  });
}

// saveaddroleediting
export function saveAddRoleEditing(data) {
  return request({
    url: `/application/saveaddroleediting`,
    method: 'post',
    data
  });
}

// saveupgraderoleediting
export function saveUpgradeRoleEditing(data) {
  return request({
    url: `/application/saveupgraderoleediting`,
    method: 'post',
    data
  });
}

// submitaddroleupgrade
export function submitAddRoleUpgrade(data) {
  return request({
    url: `/application/submitaddroleupgrade`,
    method: 'post',
    data
  });
}

// submitupgraderoleupgrade
export function submitUpgradeRoleUpgrade(data) {
  return request({
    url: `/application/submitupgraderoleupgrade`,
    method: 'post',
    data
  });
}

// approveRoleAddByFinance
export function approveRoleAddByFinance(data) {
  return request({
    url: `/application/approveroleaddbyfinance`,
    method: 'post',
    data
  });
}

// approveRoleUpgradeByFinance
export function approveRoleUpgradeByFinance(data) {
  return request({
    url: `/application/approveroleupgradebyfinance`,
    method: 'post',
    data
  });
}

// 检查用户姓名是否存在 checkFullname
export function checkFullname(fullname) {
  return request({
    url: `/application/checkfullname`,
    method: 'post',
    data: { fullname }
  });

}