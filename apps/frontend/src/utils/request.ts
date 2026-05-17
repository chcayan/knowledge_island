import { BASE_URL } from '@/config/request'
import axios from 'axios'
import emitter from './event-emitter'

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    return res
  },
  async (err) => {
    if (err.response?.status === 400) {
      return Promise.reject(err)
    }

    if (err.response?.status === 401) {
      emitter.emit('API:UNAUTHORIZED', err.response?.data?.code)
      return Promise.reject(err)
    }

    if (err.response?.status === 403) {
      return Promise.reject(err)
    }

    if (err.response?.status === 404) {
      emitter.emit('API:NOT_FOUND', err.response?.data?.code)
      return Promise.reject(err)
    }

    if (err.response?.status) return Promise.reject(err)
  }
)

export { instance as request }
