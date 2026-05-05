import axios from 'axios'

export const baseURL = 'http://localhost:8080'

const instance = axios.create({
  baseURL,
  timeout: 30000,
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
      return Promise.reject(err)
    }

    if (err.response?.status === 403) {
      return Promise.reject(err)
    }

    if (err.response?.status) return Promise.reject(err)
  }
)

export { instance as request }
