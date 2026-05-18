import { BASE_URL, REQUEST_TIMEOUT } from '@/config/request'
import axios from 'axios'

export async function refreshAPI() {
  return axios
    .create({
      baseURL: BASE_URL,
      timeout: REQUEST_TIMEOUT,
      withCredentials: true,
    })
    .post('/auth/refresh')
}
