import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserService } from './user.service'
import { UserController } from './user.controller'

import { User } from './entities/user.entity'
import { AuthModule } from '../auth/auth.module'
import { SharedModule } from '../shared/shared.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SharedModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
