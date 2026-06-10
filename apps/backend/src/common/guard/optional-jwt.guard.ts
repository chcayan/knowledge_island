import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'
import { JwtPayload } from '../interface/jwt-payload.interface'
import { OptionalUserRequest } from '../interface/optional-user-request.interface'
@Injectable()
export class OptionalJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<OptionalUserRequest>()

    const accessToken = req.cookies.access_token

    if (!accessToken) {
      req.user = null
      return true
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(accessToken, {
        secret: process.env.ACCESS_SECRET,
      })

      req.user = { id: payload.id, role: payload.role }
      return true
    } catch {
      req.user = null
    }

    return true
  }
}
