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
import { ERROR_CODE, ERROR_MESSAGE } from '@knowledge_island/error'
@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<AuthRequest>()

    const accessToken = req.cookies.access_token

    if (!accessToken) {
      throw new UnauthorizedException({
        code: ERROR_CODE.NO_TOKEN,
        message: ERROR_MESSAGE[ERROR_CODE.NO_TOKEN],
      })
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(accessToken, {
        secret: process.env.ACCESS_SECRET,
      })

      req.user = { id: payload.id, role: payload.role }
      return true
    } catch {
      throw new UnauthorizedException({
        code: ERROR_CODE.TOKEN_EXPIRED,
        message: ERROR_MESSAGE[ERROR_CODE.TOKEN_EXPIRED],
      })
    }
  }
}
