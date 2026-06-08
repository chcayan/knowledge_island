import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Tag } from './entities/tag.entity'
import { Post, PostStatus } from './entities/post.entity'
import { Image } from './entities/image.entity'

import { Repository } from 'typeorm'
import { json2html } from '../../common/utils/json2html.utils'
import { getFileMD5 } from '../../common/utils/md5.utils'
import { CreatePostDto } from '@knowledge_island/schemas'
import fs from 'fs'
import path from 'path'
import { ERROR_CODE, ERROR_MESSAGE } from '@knowledge_island/error'
import Redis from 'ioredis'
import { Comment } from './entities/comment.entity'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis
  ) {}

  private readonly logger = new Logger(PostService.name)

  async createTags(_tags: string[]) {
    const tags = [...new Set((_tags ?? []).map((t) => t.trim()))].filter(
      Boolean
    )

    if (tags.length === 0) {
      return []
    }

    const existingTags = await this.tagRepo.find({
      where: tags.map((name) => ({ name })),
    })

    const existingNames = existingTags.map((t) => t.name)

    const newTagNames = tags.filter((name) => !existingNames.includes(name))

    const newTags = this.tagRepo.create(newTagNames.map((name) => ({ name })))

    await this.tagRepo.save(newTags)

    const allTags = [...existingTags, ...newTags]

    return allTags
  }

  async createPost(dto: CreatePostDto, userId: string) {
    const { draft: exist } = await this.getDraft(userId)

    if (exist) {
      await this.postRepo.remove(exist)
    }

    const allTags = await this.createTags(dto.tags)

    const html = json2html(dto.content as JSON)

    const post = this.postRepo.create({
      ...dto,
      tags: allTags,
      contentHtml: html,
      status: dto.status as unknown as PostStatus,
      author: {
        id: userId,
      },
    })

    await this.postRepo.save(post)
  }

  async getDraft(userId: string) {
    const exist = await this.postRepo
      .createQueryBuilder('post')
      .addSelect('post.content')
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.name', 'author.avatar'])
      .leftJoinAndSelect('post.tags', 'tags')
      .where('author.id = :userId', {
        userId,
      })
      .andWhere('post.status = :status', {
        status: PostStatus.DRAFT,
      })
      .getOne()

    return { draft: exist }
  }

  async saveDraft(dto: CreatePostDto, userId: string) {
    const { draft: exist } = await this.getDraft(userId)

    if (exist) {
      const allTags = await this.createTags(dto.tags)
      const html = json2html(dto.content as JSON)

      exist.content = dto.content as string
      exist.type = dto.type
      exist.tags = allTags
      exist.contentHtml = html
      exist.status = PostStatus.DRAFT

      await this.postRepo.save(exist)
    } else {
      await this.createPost(dto, userId)
    }
  }

  async uploadImage(file: Express.Multer.File) {
    const ext = path.extname(file.originalname).slice(1)

    const md5 = await getFileMD5(file.path)

    const existing = await this.imageRepo.findOne({
      where: { md5 },
    })

    if (existing) {
      await fs.promises.unlink(file.path)
      return { url: existing.url }
    }

    const uploadDir = path.resolve(process.cwd(), 'public/uploads/images')
    await fs.promises.mkdir(uploadDir, { recursive: true })

    const finalPath = path.resolve(
      process.cwd(),
      `public/uploads/images/${md5}.${ext}`
    )

    await fs.promises.rename(file.path, finalPath)

    try {
      const image = this.imageRepo.create({
        md5,
        url: `/uploads/images/${md5}.${ext}`,
        size: file.size,
        mime: file.mimetype,
      })

      await this.imageRepo.save(image)
      return { url: image.url }
    } catch (e) {
      const existing = await this.imageRepo.findOne({
        where: { md5 },
      })

      if (existing) return existing

      throw e
    }
  }

  async getPostList(page: number, pageSize: number) {
    // await new Promise((resolve) => setTimeout(resolve, 3000))

    // throw new Error('api failed')
    const [list, total] = await this.postRepo
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.name', 'author.avatar'])
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.status = :status', {
        status: PostStatus.REVIEWING, // TODO: modify to PUBLISHED
      })
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount()

    return {
      list,
      total,
    }
  }

  async getPost(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const post = await this.postRepo
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.name', 'author.avatar'])
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.status = :status', {
        status: PostStatus.REVIEWING, // TODO: modify to PUBLISHED
      })
      .andWhere('post.id = :id', {
        id,
      })
      .getOne()

    if (!post) {
      throw new NotFoundException({
        code: ERROR_CODE.POST_NOT_FOUND,
        message: ERROR_MESSAGE[ERROR_CODE.POST_NOT_FOUND],
      })
    }

    void this.updatePostViewCount(id).catch((err) => {
      this.logger.warn(`更新帖子 ${id} 浏览量失败`, err)
    })

    return post
  }

  async getTagPostCount() {
    return this.tagRepo
      .createQueryBuilder('tag')
      .leftJoin('tag.posts', 'post')
      .select('tag.id', 'id')
      .addSelect('tag.name', 'name')
      .addSelect('COUNT(post.id)', 'postCount')
      .groupBy('tag.id')
      .addGroupBy('tag.name')
      .orderBy('postCount', 'DESC')
      .getRawMany()
  }

  async updatePostViewCount(id: string) {
    await this.redis.hincrby(`${process.env.APP_NAME}:post:view:count`, id, 1)
  }

  async getComments(postId: string) {
    const comments = await this.commentRepo.find({
      where: {
        post: {
          id: postId,
        },
      },
      relations: {
        author: true,
        parent: true,
        replyComment: {
          author: true,
        },
      },
      order: {
        createdAt: 'ASC',
      },
    })

    const roots = comments.filter((comment) => comment.parent === null)

    const replies = comments.filter((comment) => comment.parent !== null)

    const replyMap = new Map<string, Comment[]>()

    for (const reply of replies) {
      const rootId = reply.parent!.id

      if (!replyMap.has(rootId)) {
        replyMap.set(rootId, [])
      }

      replyMap.get(rootId)!.push(reply)
    }

    return roots.map((root) => ({
      id: root.id,
      content: root.content,
      createdAt: root.createdAt,
      likeCount: root.likeCount,
      author: {
        id: root.author.id,
        name: root.author.name,
        avatar: root.author.avatar,
      },
      replies:
        replyMap.get(root.id)?.map((reply) => ({
          id: reply.id,
          content: reply.content,
          createdAt: reply.createdAt,
          likeCount: reply.likeCount,
          author: {
            id: reply.author.id,
            name: reply.author.name,
            avatar: reply.author.avatar,
          },
          replyUser: reply.replyComment
            ? {
                id: reply.replyComment.author.id,
                name: reply.replyComment.author.name,
              }
            : null,
        })) ?? [],
    }))
  }
}
