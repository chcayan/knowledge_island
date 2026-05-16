import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'
import { AuthRequest } from '../interface/auth-request.interface'
import { JwtPayload } from '../interface/jwt-payload.interface'

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<AuthRequest>()

    const accessToken = req.cookies.access_token
    console.log(accessToken)
    if (!accessToken) throw new UnauthorizedException('no token')

    try {
      const payload = this.jwtService.verify<JwtPayload>(accessToken, {
        secret: process.env.ACCESS_SECRET,
      })

      req.user = { id: payload.id, role: payload.role }
      return true
    } catch {
      throw new UnauthorizedException('登录状态过期，请重新登录')
    }
  }
}
