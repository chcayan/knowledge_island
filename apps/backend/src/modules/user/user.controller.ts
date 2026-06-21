import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UserService } from './user.service'
import type {
  LoginDto,
  RegisterDto,
  UpdateUserNameDto,
  UpdateUserSignatureDto,
} from '@knowledge_island/schemas'
import {
  LoginSchema,
  RegisterSchema,
  UpdateUserNameSchema,
  UpdateUserSignatureSchema,
} from '@knowledge_island/schemas'
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
import { FileInterceptor } from '@nestjs/platform-express'
import { uploadOptions } from '../../common/config/upload.config'
import { SharedService } from '../shared/shared.service'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly sharedService: SharedService
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

  @Post('name')
  @UseGuards(JwtGuard)
  async modifyUserName(
    @Body(new ZodValidationPipe(UpdateUserNameSchema)) dto: UpdateUserNameDto,
    @User() userId: string
  ) {
    return this.userService.modifyUserName(dto.name, userId)
  }

  @Post('signature')
  @UseGuards(JwtGuard)
  async modifyUserSignature(
    @Body(new ZodValidationPipe(UpdateUserSignatureSchema))
    dto: UpdateUserSignatureDto,
    @User() userId: string
  ) {
    return this.userService.modifyUserSignature(dto.signature, userId)
  }

  @Post('avatar')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('avatar', uploadOptions))
  async modifyUserAvatar(
    @UploadedFile() file: Express.Multer.File,
    @User() userId: string
  ) {
    const { url } = await this.sharedService.uploadImage(file)
    return this.userService.modifyUserAvatar(url, userId)
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
