import request from '@/utils/request'
import qs from 'qs'

export function getResults(query) {
  return request({
    url: '/results',
    method: 'get',
    params: query,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

export function exportResults(query) {
  return request({
    url: '/results/export',
    method: 'get',
    params: query,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
    responseType: 'blob'
  })
}

export function createResults(data, config) {
  return request({
    url: '/results',
    method: 'post',
    data,
    config
  })
}

export function updateResults(id, data, config) {
  return request({
    url: '/results/' + id,
    method: 'put',
    data,
    config
  })
}

export function deleteResults(id) {
  return request({
    url: '/results/' + id,
    method: 'delete'
  })
}

export function importResults(data, config) {
  return request({
    url: '/results/import',
    method: 'post',
    data,
    config
  })
}

export function getId(query) {
  return request({
    url: '/results/getId',
    method: 'get',
    params: query
  })
}
