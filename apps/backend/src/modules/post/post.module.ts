import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PostService } from './post.service'
import { PostController } from './post.controller'

import { Post } from './entities/post.entity'
import { Tag } from './entities/tag.entity'
import { Image } from './entities/image.entity'
import { AuthModule } from '../auth/auth.module'
import { UserModule } from '../user/user.module'
import { PostSyncTask } from './post.sync-task'

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Tag, Image]),
    AuthModule,
    UserModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostSyncTask],
})
export class PostModule {}
