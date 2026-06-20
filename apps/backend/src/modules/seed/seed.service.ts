import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import bcrypt from 'bcryptjs'
import { User } from '../user/entities/user.entity'
import { join } from 'path'
import { readFileSync } from 'fs'
import { Post } from '../post/entities/post.entity'
import { PostInfo, UserInfo } from './types'
import { PostService } from '../post/post.service'
import { json2html } from '../../common/utils/json2html.utils'
import { Comment } from '../post/entities/comment.entity'

// const EMAIL = 'admin@ki.com'

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly postService: PostService
  ) {}

  async onApplicationBootstrap() {
    await this.initUserSeed()
    await this.initPostSeed()
  }

  async initUserSeed() {
    const filePath = join(process.cwd(), 'src/modules/seed/users.json')

    const users = JSON.parse(readFileSync(filePath, 'utf8')) as UserInfo

    const emails = users.map((u) => u.email)

    const exists = await this.userRepo.find({
      where: {
        email: In(emails),
      },
      select: ['email'],
    })

    const existEmails = new Set(exists.map((u) => u.email))

    const entities = await Promise.all(
      users
        .filter((u) => !existEmails.has(u.email))
        .map(async (u) =>
          this.userRepo.create({
            id: u.id,
            name: u.name,
            email: u.email,
            password: await bcrypt.hash(u.password, 10),
            canReviewPost: u.canReviewPost,
            canManageUserPermission: u.canManageUserPermission,
          })
        )
    )

    if (entities.length) {
      await this.userRepo.save(entities)
    }

    // const exist = await this.userRepo.findOne({
    //   where: {
    //     email: EMAIL,
    //   },
    // })

    // if (exist) return

    // const password = await bcrypt.hash('admin123', 10)

    // const user = this.userRepo.create({
    //   password,
    //   name: 'admin',
    //   email: EMAIL,
    //   canReviewPost: true,
    //   canManageUserPermission: true,
    // })

    // await this.userRepo.save(user)
  }

  async initPostSeed() {
    const filePath = join(process.cwd(), 'src/modules/seed/posts.json')

    const posts = JSON.parse(readFileSync(filePath, 'utf8')) as PostInfo

    const ids = posts.map((p) => p.id)

    const exists = await this.postRepo.find({
      where: {
        id: In(ids),
      },
      select: ['id'],
    })

    const existIds = new Set(exists.map((p) => p.id))

    const postEntities = await Promise.all(
      posts
        .filter((p) => !existIds.has(p.id))
        .map(async (p) => {
          const allTags = await this.postService.createTags(p.tags)

          const html = json2html(p.content)

          return this.postRepo.create({
            id: p.id,
            content: p.content as unknown as string,
            contentHtml: html,
            type: p.type,
            status: p.status,
            author: {
              id: p.author_id,
            },
            tags: allTags,
          })
        })
    )

    if (postEntities.length) {
      await this.postRepo.save(postEntities)

      for (const p of posts) {
        for (const comment of p.comments) {
          await this.postService.createComment(
            {
              contentJSON: comment.content,
              postId: p.id,
              parentId: comment.parent_id,
              replyCommentId: comment.reply_comment_id,
            },
            comment.author_id,
            comment.id
          )
        }
      }
    }
  }
}
