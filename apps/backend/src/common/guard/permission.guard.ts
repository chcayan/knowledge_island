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
    const userId = req.user.id

    if (!userId) throw new ForbiddenException('未查询到用户')

    const user = await this.userService.findOne(userId)

    const banUntil = user[requiredPermission]

    if (banUntil && calculateRemainTime(banUntil)) {
      throw new ForbiddenException({
        message: '该用户权限暂时被禁用',
        time: calculateRemainTime(banUntil),
      })
    }

    return true
  }
}
