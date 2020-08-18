import request from '@/utils/request'

export function getStudents(query) {
  return request({
    url: '/students',
    method: 'get',
    params: query
  })
}

export function exportStudents(query) {
  return request({
    url: '/students/export',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function createStudents(data, config) {
  return request({
    url: '/students',
    method: 'post',
    data,
    config
  })
}

export function updateStudents(id, data, config) {
  return request({
    url: '/students/' + id,
    method: 'put',
    data,
    config
  })
}

export function deleteStudents(id) {
  return request({
    url: '/students/' + id,
    method: 'delete'
  })
}

export function importStudents(data, config) {
  return request({
    url: '/students/import',
    method: 'post',
    data,
    config
  })
}
