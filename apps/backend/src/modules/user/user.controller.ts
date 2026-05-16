import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common'
import { UserService } from './user.service'
import type { LoginDto, RegisterDto } from '@knowledge_island/schemas'
import { LoginSchema, RegisterSchema } from '@knowledge_island/schemas'
import { ZodValidationPipe } from '../../common/pipe/zod.pipe'
import { AuthService } from '../auth/auth.service'
import type { Response } from 'express'
import {
  REFRESH_TOKEN_MAX_AGE,
  REFRESH_TOKEN_NAME,
} from '../../common/config/cookie.config'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(LoginSchema)) dto: LoginDto,
    @Res() res: Response
  ) {
    const userId = await this.userService.login(dto)
    const accessToken = this.authService.generateAccessToken(userId, 'user')
    const refreshToken = await this.authService.generateRefreshToken(
      userId,
      'user'
    )

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_MAX_AGE,
    })

    return res.json({
      code: 0,
      message: 'success',
      data: {
        accessToken,
      },
    })
  }

  @Post('register')
  register(@Body(new ZodValidationPipe(RegisterSchema)) dto: RegisterDto) {
    return this.userService.register(dto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }
}
