import request from '@/utils/request'

export function getStatistics(query) {
  return request({
    url: '/statistics',
    method: 'get',
    params: query
  })
}

export function exportStatistics(query) {
  return request({
    url: '/statistics/export',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function createStatistics(data, config) {
  return request({
    url: '/statistics',
    method: 'post',
    data,
    config
  })
}

export function updateStatistics(id) {
  return request({
    url: '/statistics/' + id,
    method: 'put'
  })
}

export function deleteStatistics(id) {
  return request({
    url: '/statistics/' + id,
    method: 'delete'
  })
}

export function analyseStatistics() {
  return request({
    url: '/statistics/analyse',
    method: 'get'
  })
}
