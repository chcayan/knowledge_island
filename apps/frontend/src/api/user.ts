import { request } from '@/utils'
import { LoginDto, LoginSchema } from '@knowledge_island/schemas'

export async function loginAPI(dto: LoginDto) {
  const data = LoginSchema.parse(dto)
  return request.post('/user/login', data)
}
