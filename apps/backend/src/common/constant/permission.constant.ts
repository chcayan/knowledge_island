export const Permission = {
  user: 'userPermission',
  admin: 'adminPermission',
}

export const UserPerm = {
  user_post: 'postBanUntil',
  user_speak: 'commentBanUntil',
  user_login: 'loginBanUntil',
} as const

export type UserPermKey = keyof typeof UserPerm
export type UserPermValue = (typeof UserPerm)[UserPermKey]
