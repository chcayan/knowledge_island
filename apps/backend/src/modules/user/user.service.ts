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
      throw new NotFoundException('用户不存在')
    }

    const loginBanUntil = user.loginBanUntil
    if (loginBanUntil && calculateRemainTime(loginBanUntil)) {
      throw new ForbiddenException({
        message: '该用户暂时禁止登录',
        time: calculateRemainTime(loginBanUntil),
      })
    }

    const isMatch = await bcrypt.compare(dto.password, user.password)

    if (!isMatch) {
      throw new UnauthorizedException('用户名或密码错误')
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

    if (!result) throw new NotFoundException('未找到该用户')

    return result
  }
}
