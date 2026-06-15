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
import { Comment } from './entities/comment.entity'
import { CommentReaction } from './entities/comment-reaction.entity'
import { Collection } from './entities/collection.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      Tag,
      Image,
      Comment,
      CommentReaction,
      Collection,
    ]),
    AuthModule,
    UserModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostSyncTask],
})
export class PostModule {}
