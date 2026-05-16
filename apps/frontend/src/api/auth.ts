'use server'

import { ACCESS_TOKEN_MAX_AGE, ACCESS_TOKEN_NAME } from '@/config/cookie'
import { request } from '@/utils'
import { LoginDto, LoginSchema } from '@knowledge_island/schemas'
import { cookies } from 'next/headers'

export async function loginAPI(dto: LoginDto) {
  const data = LoginSchema.parse(dto)
  const res = await request.post('/user/login', data)

  const { accessToken } = res.data.data
  ;(await cookies()).set(ACCESS_TOKEN_NAME, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: ACCESS_TOKEN_MAX_AGE,
  })

  return Promise.resolve('登录成功')
}
