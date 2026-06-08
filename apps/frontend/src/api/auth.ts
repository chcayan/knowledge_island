import { BASE_URL, REQUEST_TIMEOUT } from '@/config/request'
import { request } from '@/utils'
import axios from 'axios'

export async function refreshAPI() {
  const request = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT,
    withCredentials: true,
  })

  return request.post('/auth/refresh')
}

export async function getMeAPI() {
  return request.get('/auth/me')
}
