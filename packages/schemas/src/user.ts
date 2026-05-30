import { z } from 'zod'
import {
  USER_NAME_MAX_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
  USER_PASSWORD_REGEX,
  USER_SIGNATURE_MAX_LENGTH,
} from './config/config'

enum UserSex {
  UNKNOWN = 0,
  MALE = 1,
  FEMALE = 2,
}

export const UserSchema = z.object({
  id: z.uuid(),
  name: z
    .string()
    .min(1, '用户名至少 1 个字')
    .max(USER_NAME_MAX_LENGTH, `用户名最多 ${USER_NAME_MAX_LENGTH} 个字`)
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/, '只能包含汉字/字母/数字/下划线'),
  email: z.email({ error: '邮箱不能为空' }),
  password: z
    .string()
    .min(USER_PASSWORD_MIN_LENGTH, `密码至少 ${USER_PASSWORD_MIN_LENGTH} 位`)
    .max(USER_PASSWORD_MAX_LENGTH, `密码最长 ${USER_PASSWORD_MAX_LENGTH} 位`)
    .regex(USER_PASSWORD_REGEX, '只允许数字、字母、符号'),
  avatar: z.string().max(255),
  createdAt: z.date(),
  updatedAt: z.date(),
  followCount: z.number(),
  fanCount: z.number(),
  sex: z.enum(UserSex),
  signature: z
    .string()
    .min(1, '简介至少 1 个字')
    .max(
      USER_SIGNATURE_MAX_LENGTH,
      `简介最多 ${USER_SIGNATURE_MAX_LENGTH} 个字`
    ),
  postBanUntil: z.date(),
  commentBanUntil: z.date(),
  loginBanUntil: z.date(),
  canReviewPost: z.number(),
  canManageUserPermission: z.number(),
})

export const RegisterSchema = z.object({
  email: UserSchema.shape.email,
  password: UserSchema.shape.password,
})

export const LoginSchema = z.object({
  email: UserSchema.shape.email,
  password: UserSchema.shape.password,
})

export const UserPublicSchema = UserSchema.omit({
  password: true,
  postBanUntil: true,
  commentBanUntil: true,
  loginBanUntil: true,
  canReviewPost: true,
  canManageUserPermission: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateUserSchema = z.object({
  name: UserSchema.shape.name.optional(),
  avatar: UserSchema.shape.avatar.optional(),
  sex: UserSchema.shape.sex.optional(),
  signature: UserSchema.shape.signature.optional(),
})

export type User = z.infer<typeof UserSchema>
export type UserPublic = z.infer<typeof UserPublicSchema>

export type RegisterDto = z.infer<typeof RegisterSchema>
export type LoginDto = z.infer<typeof LoginSchema>
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>
