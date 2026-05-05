import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PostService } from './post.service'
import { PostController } from './post.controller'

import { Post } from './entities/post.entity'
import { Tag } from './entities/tag.entity'
import { Image } from './entities/image.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag, Image])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
