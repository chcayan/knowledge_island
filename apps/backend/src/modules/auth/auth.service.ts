import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import Redis from 'ioredis'
import {
  ACCESS_TOKEN_EXPIRED_TIME,
  REFRESH_TOKEN_EXPIRED_TIME,
} from '../../common/config/redis.config'
import { JwtPayload } from '../../common/interface/jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly jwtService: JwtService
  ) {}

  async save(userId: string, refreshToken: string, role: 'user' | 'admin') {
    const key = `${process.env.APP_NAME}:refresh:${userId}:${role}`
    await this.redis.set(key, refreshToken, 'EX', REFRESH_TOKEN_EXPIRED_TIME)
  }

  async get(userId: string, role: 'user' | 'admin') {
    const key = `${process.env.APP_NAME}:refresh:${userId}:${role}`
    return this.redis.get(key)
  }

  async remove(userId: string, role: 'user' | 'admin') {
    const key = `${process.env.APP_NAME}:refresh:${userId}:${role}`
    await this.redis.del(key)
  }

  generateAccessToken(userId: string, role: 'user' | 'admin') {
    return this.jwtService.sign<JwtPayload>(
      { id: userId, role },
      {
        secret: process.env.ACCESS_SECRET,
        expiresIn: ACCESS_TOKEN_EXPIRED_TIME,
      }
    )
  }

  async generateRefreshToken(userId: string, role: 'user' | 'admin') {
    const refreshToken = this.jwtService.sign<JwtPayload>(
      { id: userId, role },
      {
        secret: process.env.REFRESH_SECRET,
        expiresIn: REFRESH_TOKEN_EXPIRED_TIME,
      }
    )

    await this.save(userId, refreshToken, role)

    return refreshToken
  }
}
