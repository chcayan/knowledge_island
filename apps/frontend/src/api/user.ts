import { BASE_URL, REQUEST_TIMEOUT } from '@/config/request'
import { fetchData, request } from '@/utils'
import { compressImage } from '@/utils/compress'
import {
  LoginDto,
  LoginSchema,
  RegisterDto,
  RegisterSchema,
  UserPublic,
} from '@knowledge_island/schemas'
import axios from 'axios'

export async function loginAPI(dto: LoginDto) {
  const data = LoginSchema.parse(dto)
  const res = await request.post('/user/login', data)
  const { id }: { id: string } = res.data.data

  return { id }
}

export async function registerAPI(dto: RegisterDto) {
  const data = RegisterSchema.parse(dto)
  return request.post('/user/register', data)
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

export async function getUserInfoAPI(userId: string) {
  const res = await request.get(`/user/${userId}`)
  const data: UserPublic = res.data.data

  return data
}

export async function getUserInfoServerAPI(userId: string) {
  try {
    const data: UserPublic = await fetchData(`/user/${userId}`)
    return data
  } catch {
    return null
  }
}

export async function getMeInfoAPI() {
  const data: UserPublic = await fetchData('/user/me')
  return data
}

export async function modifyUserNameAPI(name: string) {
  return request.post('/user/name', { name })
}

export async function modifyUserSignatureAPI(signature: string) {
  return request.post('/user/signature', { signature })
}

export async function modifyUserAvatarAPI(avatar: File) {
  const compressedFile = await compressImage(avatar)
  const formData = new FormData()
  formData.append('avatar', compressedFile || avatar)

  return request.post('/user/avatar', formData)
}
