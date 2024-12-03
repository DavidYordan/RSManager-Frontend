import request from '../utils/request';


export function searchCashOut(data) {
  return request({
    url: '/finance/search',
    method: 'post',
    data
  })
}

export function syncCashOut() {
  return request({
    url: '/finance/sync',
    method: 'get'
  });
}

// searchtodo
export function searchTodoCashOut(data) {
  return request({
    url: '/finance/searchtodo',
    method: 'post',
    data
  });
}

// complete
export function completeCashOut(id) {
  return request({
    url: '/finance/complete',
    method: 'post',
    data: { id }
  });
}

// reject
export function rejectCashOut(data) {
  return request({
    url: '/finance/reject',
    method: 'post',
    data
  });
}

// exportCashOut
export function exportCashOut(data) {
  return request({
    url: '/finance/export',
    method: 'post',
    data,
    responseType: 'blob',
    isDownload: true
  });
}

// /paymentaccount/add
export function addPaymentAccount(data) {
  return request({
    url: '/finance/paymentaccount/add',
    method: 'post',
    data
  });
}

// /paymentaccount/update
export function updatePaymentAccount(data) {
  return request({
    url: '/finance/paymentaccount/update',
    method: 'post',
    data
  });
}

// /paymentaccount/search
export function searchPaymentAccount(data) {
  return request({
    url: '/finance/paymentaccount/search',
    method: 'post',
    data
  });
}

// /paymentaccount/delete
export function deletePaymentAccount(data) {
  return request({
    url: '/finance/paymentaccount/delete',
    method: 'post',
    data
  });
}