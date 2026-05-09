import { z } from 'zod'

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
    .max(20, '用户名最多 20 个字')
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/, '只能包含汉字/字母/数字/下划线'),
  email: z.email({ error: '邮箱不能为空' }),
  password: z
    .string()
    .min(6, '密码至少 6 位')
    .max(20, '密码最长 20 位')
    .regex(/^[^\s]{6,20}$/, '只允许数字、字母、符号'),
  avatar: z.string().max(255),
  createdAt: z.date(),
  updatedAt: z.date(),
  followCount: z.number(),
  fanCount: z.number(),
  sex: z.enum(UserSex),
  signature: z.string().min(1, '简介至少 1 个字').max(255, '简介最多 255 个字'),
})

export const RegisterSchema = z
  .object({
    name: UserSchema.shape.name,
    email: UserSchema.shape.email,
    password: UserSchema.shape.password,
    confirmPassword: z.string({ error: '确认密码不能为空' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: '两次密码不一致',
    path: ['confirmPassword'],
  })

export const LoginSchema = z.object({
  email: UserSchema.shape.email,
  password: UserSchema.shape.password,
})

export const UserPublicSchema = UserSchema.omit({
  password: true,
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
