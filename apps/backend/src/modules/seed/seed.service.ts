import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import bcrypt from 'bcryptjs'
import { User } from '../user/entities/user.entity'

const EMAIL = 'admin@ki.com'

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {}

  async onApplicationBootstrap() {
    await this.initUserSeed()
  }

  async initUserSeed() {
    const exist = await this.userRepo.findOne({
      where: {
        email: EMAIL,
      },
    })

    if (exist) return

    const password = await bcrypt.hash('admin123', 10)

    const user = this.userRepo.create({
      password,
      name: 'admin',
      email: EMAIL,
      canReviewPost: true,
      canManageUserPermission: true,
    })

    await this.userRepo.save(user)
  }
}
