import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import type { LoginDto, RegisterDto } from '@knowledge_island/schemas'
import { LoginSchema, RegisterSchema } from '@knowledge_island/schemas'
import { ZodValidationPipe } from '../../common/pipe/zod.pipe'
import { AuthService } from '../auth/auth.service'
import type { Response } from 'express'
import {
  ACCESS_TOKEN_MAX_AGE,
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_MAX_AGE,
  REFRESH_TOKEN_NAME,
} from '../../common/config/cookie.config'
import type { AuthRequest } from '../../common/interface/auth-request.interface'
import { JwtGuard } from '../../common/guard/jwt.guard'
import { User } from '../../common/decorator/user.decorator'

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

    res.cookie(ACCESS_TOKEN_NAME, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: ACCESS_TOKEN_MAX_AGE,
    })

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
        id: userId,
      },
    })
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(@Req() req: AuthRequest, @Res() res: Response) {
    await this.authService.remove(req.user.id, 'user')

    res.clearCookie(ACCESS_TOKEN_NAME)
    res.clearCookie(REFRESH_TOKEN_NAME)

    return res.json({
      code: 0,
      message: 'success',
    })
  }

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(RegisterSchema)) dto: RegisterDto
  ) {
    return this.userService.register(dto)
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getMeInfo(@User() userId: string) {
    return this.userService.findOne(userId)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }
}
