import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import bcrypt from 'bcryptjs'

const EMAIL = 'admin@ki.com'

@Injectable()
export class UserSeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {}

  async onApplicationBootstrap() {
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
    })

    await this.userRepo.save(user)
  }
}
