/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { LoginDto, RegisterDto } from '@knowledge_island/schemas'
import { calculateRemainTime } from '../../common/utils/time.utils'
import bcrypt from 'bcryptjs'
import { ERROR_CODE, ERROR_MESSAGE } from '@knowledge_island/error'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', {
        email: dto.email,
      })
      .getOne()

    if (!user) {
      throw new NotFoundException({
        code: ERROR_CODE.USER_NOT_FOUND,
        message: ERROR_MESSAGE[ERROR_CODE.USER_NOT_FOUND],
      })
    }

    const loginBanUntil = user.loginBanUntil
    if (loginBanUntil && calculateRemainTime(loginBanUntil)) {
      throw new ForbiddenException({
        code: ERROR_CODE.USER_LOGIN_FORBIDDEN,
        message: ERROR_MESSAGE[ERROR_CODE.USER_LOGIN_FORBIDDEN],
        data: {
          time: calculateRemainTime(loginBanUntil),
        },
      })
    }

    const isMatch = await bcrypt.compare(dto.password, user.password)

    if (!isMatch) {
      throw new UnauthorizedException({
        code: ERROR_CODE.USER_IDENTITY_VERIFICATION_FAILED,
        message: ERROR_MESSAGE[ERROR_CODE.USER_IDENTITY_VERIFICATION_FAILED],
      })
    }

    return user.id
  }

  async register(dto: RegisterDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    })

    if (user) {
      throw new ConflictException({
        code: ERROR_CODE.EMAIL_HAS_BEEN_REGISTERED,
        message: ERROR_MESSAGE[ERROR_CODE.EMAIL_HAS_BEEN_REGISTERED],
      })
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10)

    const newUser = this.userRepo.create({
      name: '默认名字',
      email: dto.email,
      password: hashedPassword,
    })

    await this.userRepo.save(newUser)
  }

  async findOne(id: string, hidePermField = true) {
    const result = await this.userRepo.findOne({
      where: { id },
    })

    if (!result) {
      throw new NotFoundException({
        code: ERROR_CODE.USER_NOT_FOUND,
        message: ERROR_MESSAGE[ERROR_CODE.USER_NOT_FOUND],
      })
    }

    if (!hidePermField) {
      return result
    }

    const {
      postBanUntil,
      commentBanUntil,
      loginBanUntil,
      canReviewPost,
      canManageUserPermission,
      ...hidePermFieldResult
    } = result

    return hidePermFieldResult
  }

  async modifyUserName(name: string, userId: string) {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new NotFoundException({
        code: ERROR_CODE.USER_NOT_FOUND,
        message: ERROR_MESSAGE[ERROR_CODE.USER_NOT_FOUND],
      })
    }

    await this.userRepo.update({ id: userId }, { name })
  }

  async modifyUserSignature(signature: string, userId: string) {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new NotFoundException({
        code: ERROR_CODE.USER_NOT_FOUND,
        message: ERROR_MESSAGE[ERROR_CODE.USER_NOT_FOUND],
      })
    }

    await this.userRepo.update({ id: userId }, { signature })
  }

  async modifyUserAvatar(avatar: string, userId: string) {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new NotFoundException({
        code: ERROR_CODE.USER_NOT_FOUND,
        message: ERROR_MESSAGE[ERROR_CODE.USER_NOT_FOUND],
      })
    }

    await this.userRepo.update({ id: userId }, { avatar })

    return { url: avatar }
  }
}
