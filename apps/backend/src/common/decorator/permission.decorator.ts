import { SetMetadata } from '@nestjs/common'
import {
  Permission,
  UserPerm,
  UserPermKey,
} from '../constant/permission.constant'

export const UserPermission = (permission: UserPermKey) =>
  SetMetadata(Permission.user, UserPerm[permission])
