import request from '@/utils/request'

export function getClasses(query) {
  return request({
    url: '/classes',
    method: 'get',
    params: query
  })
}

export function exportClasses(query) {
  return request({
    url: '/classes/export',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function createClasses(data, config) {
  return request({
    url: '/classes',
    method: 'post',
    data,
    config
  })
}

export function updateClasses(id, data, config) {
  return request({
    url: '/classes/' + id,
    method: 'put',
    data,
    config
  })
}

export function deleteClasses(id) {
  return request({
    url: '/classes/' + id,
    method: 'delete'
  })
}

export function importClasses(data, config) {
  return request({
    url: '/classes/import',
    method: 'post',
    data,
    config
  })
}
