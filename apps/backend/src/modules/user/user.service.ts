import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { RegisterDto } from '@knowledge_island/schemas'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {}

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
