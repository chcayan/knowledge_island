import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { UserService } from '../../modules/user/user.service'
import { AuthRequest } from '../interface/auth-request.interface'
import { Reflector } from '@nestjs/core'
import { Permission, UserPermValue } from '../constant/permission.constant'
import { calculateRemainTime } from '../utils/time.utils'
import { ERROR_CODE, ERROR_MESSAGE } from '@knowledge_island/error'
import { User } from '../../modules/user/entities/user.entity'
import { Response } from 'express'
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '../config/cookie.config'

type ForbiddenExceptionMessageMapType = {
  code: number
  message: string
}
const forbiddenExceptionMessageMap: Record<
  UserPermValue,
  ForbiddenExceptionMessageMapType
> = {
  postBanUntil: {
    code: ERROR_CODE.USER_POST_FORBIDDEN,
    message: ERROR_MESSAGE[ERROR_CODE.USER_POST_FORBIDDEN]!,
  },
  commentBanUntil: {
    code: ERROR_CODE.USER_COMMENT_FORBIDDEN,
    message: ERROR_MESSAGE[ERROR_CODE.USER_COMMENT_FORBIDDEN]!,
  },
  loginBanUntil: {
    code: ERROR_CODE.USER_LOGIN_FORBIDDEN,
    message: ERROR_MESSAGE[ERROR_CODE.USER_LOGIN_FORBIDDEN]!,
  },
}

@Injectable()
export class UserPermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<UserPermValue>(
      Permission.user,
      context.getHandler()
    )

    if (!requiredPermission) {
      throw new Error('backend error: Guard not provide value')
    }

    const req = context.switchToHttp().getRequest<AuthRequest>()
    const res = context.switchToHttp().getResponse<Response>()

    const userId = req.user.id

    if (!userId)
      throw new ForbiddenException({
        code: ERROR_CODE.FORBIDDEN,
        message: ERROR_MESSAGE[ERROR_CODE.FORBIDDEN],
      })

    const user = (await this.userService.findOne(userId, false)) as User

    const banUntil = user[requiredPermission]

    if (banUntil && calculateRemainTime(banUntil)) {
      if (requiredPermission === 'loginBanUntil') {
        res.clearCookie(ACCESS_TOKEN_NAME)
        res.clearCookie(REFRESH_TOKEN_NAME)
      }

      throw new ForbiddenException({
        code: forbiddenExceptionMessageMap[requiredPermission].code,
        message: forbiddenExceptionMessageMap[requiredPermission].message,
        data: {
          time: calculateRemainTime(banUntil),
        },
      })
    }

    return true
  }
}
