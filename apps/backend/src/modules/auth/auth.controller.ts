import { Controller, Post, Req, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import type { AuthRequest } from '../../common/interface/auth-request.interface'
import type { Response } from 'express'
import { JwtPayload } from '../../common/interface/jwt-payload.interface'
import {
  REFRESH_TOKEN_MAX_AGE,
  REFRESH_TOKEN_NAME,
} from '../../common/config/cookie.config'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Post('refresh')
  async refreshToken(@Req() req: AuthRequest, @Res() res: Response) {
    const refreshToken = req.cookies.refresh_token

    if (!refreshToken) {
      return res.status(401).json({
        message: 'no token',
        error: 'Unauthorized',
        statusCode: 401,
      })
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: process.env.REFRESH_SECRET,
      })

      const storedToken = await this.authService.get(payload.id, payload.role)

      if (storedToken !== refreshToken) {
        return res.status(401).json({
          message: 'Token mismatch',
          error: 'Unauthorized',
          statusCode: 401,
        })
      }

      await this.authService.remove(payload.id, payload.role)

      const newAccessToken = this.authService.generateAccessToken(
        payload.id,
        payload.role
      )

      const newRefreshToken = await this.authService.generateRefreshToken(
        payload.id,
        payload.role
      )

      res.cookie(REFRESH_TOKEN_NAME, newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: REFRESH_TOKEN_MAX_AGE,
      })

      return res.json({
        code: 0,
        message: 'success',
        data: {
          accessToken: newAccessToken,
        },
      })
    } catch {
      return res.status(401).json({
        message: '登录状态过期，请重新登录',
        error: 'Unauthorized',
        statusCode: 401,
      })
    }
  }
}
