import {
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

  register(dto: RegisterDto) {
    console.log(dto)
  }

  async findOne(id: string) {
    const result = await this.userRepo.findOne({
      where: { id },
    })

    if (!result) {
      throw new NotFoundException({
        code: ERROR_CODE.USER_NOT_FOUND,
        message: ERROR_MESSAGE[ERROR_CODE.USER_NOT_FOUND],
      })
    }

    return result
  }
}
