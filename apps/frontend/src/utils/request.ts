import { BASE_URL, REQUEST_TIMEOUT } from '@/config/request'
import axios from 'axios'
import emitter from './event-emitter'
import { refreshAPI } from '@/api/auth'
import { ERROR_CODE } from '@knowledge_island/error'

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  withCredentials: true,
})

let isRefreshing = false
let refreshSubscribers: (() => void)[] = []

function subscribeTokenRefresh(cb: () => void) {
  refreshSubscribers.push(cb)
}

function onRefreshed() {
  refreshSubscribers.forEach((cb) => cb())
  refreshSubscribers = []
}

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
    const originalRequest = err.config

    if (err.response?.status === 400) {
      emitter.emit('API:BAD_REQUEST', err.response?.data?.code)
    }

    if (err.response?.status === 401) {
      if (originalRequest.url?.includes('/admin/login')) {
        emitter.emit('API:UNAUTHORIZED', err.response?.data?.code)
        return Promise.reject(err)
      }

      if (!isRefreshing) {
        isRefreshing = true

        try {
          await refreshAPI()
          onRefreshed()
          return instance(originalRequest)
        } catch {
          emitter.emit('API:UNAUTHORIZED', err.response?.data?.code)
          return Promise.reject(err)
        } finally {
          isRefreshing = false
        }
      } else {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(instance(originalRequest))
          })
        })
      }
    }

    if (err.response?.status === 403) {
      const code = err.response?.data?.code
      if (
        code &&
        (code === ERROR_CODE.TEMPORARY_FORBIDDEN ||
          code === ERROR_CODE.USER_LOGIN_FORBIDDEN)
      ) {
        emitter.emit(
          'API:FORBIDDEN',
          err.response?.data?.code,
          err.response?.data?.data.time
        )
      } else {
        emitter.emit('API:FORBIDDEN', err.response?.data?.code)
      }
    }

    if (err.response?.status === 404) {
      emitter.emit('API:NOT_FOUND', err.response?.data?.code)
    }

    if (err.response?.status === 409) {
      emitter.emit('API:CONFLICT_EXCEPTION', err.response?.data?.code)
    }

    if (err.response?.status >= 500) {
      emitter.emit('SERVER:EXCEPTION')
    }

    if (err.code === 'ERR_NETWORK') {
      emitter.emit('SERVER:ERR_NETWORK')
    }

    if (err.code === 'ECONNABORTED') {
      emitter.emit('SERVER:ERR_NETWORK')
    }

    return Promise.reject(err)
  }
)

export { instance as request }
