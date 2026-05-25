import { BASE_URL, REQUEST_TIMEOUT } from '@/config/request'
import axios from 'axios'

const request = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  withCredentials: true,
})

export async function refreshAPI() {
  return request.post('/auth/refresh')
}

export async function getMeAPI() {
  return request.get('/auth/me')
}
