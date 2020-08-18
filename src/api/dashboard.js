import request from '@/utils/request'

export function getCount() {
  return request({
    url: '/getCount',
    method: 'get'
  })
}

export function exportAll(query) {
  return request({
    url: '/export',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
