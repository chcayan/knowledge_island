import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/entities/user.entity'
import { SeedService } from './seed.service'
import { Post } from '../post/entities/post.entity'
import { PostModule } from '../post/post.module'
import { Comment } from '../post/entities/comment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Comment]), PostModule],
  controllers: [],
  providers: [SeedService],
})
export class SeedModule {}
