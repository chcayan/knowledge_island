import { BASE_URL, REQUEST_TIMEOUT } from '@/config/request'
import { request } from '@/utils'
import { LoginDto, LoginSchema } from '@knowledge_island/schemas'
import axios from 'axios'

export async function loginAPI(dto: LoginDto) {
  const data = LoginSchema.parse(dto)
  const res = await request.post('/user/login', data)
  const { id }: { id: string } = res.data.data

  return { id }
}

export async function LogoutAPI() {
  return axios
    .create({
      baseURL: BASE_URL,
      timeout: REQUEST_TIMEOUT,
      withCredentials: true,
    })
    .post('/user/logout')
}
