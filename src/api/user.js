import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data,
    baseURL: process.env.VUE_APP_USER_API
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
