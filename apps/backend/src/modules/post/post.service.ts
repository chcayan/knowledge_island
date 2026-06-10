import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Tag } from './entities/tag.entity'
import { Post, PostStatus } from './entities/post.entity'
import { Image } from './entities/image.entity'

import { In, Repository } from 'typeorm'
import { json2html } from '../../common/utils/json2html.utils'
import { getFileMD5 } from '../../common/utils/md5.utils'
import {
  CommentReactionType,
  CreateCommentDto,
  CreateCommentReactionDto,
  CreatePostDto,
} from '@knowledge_island/schemas'
import fs from 'fs'
import path from 'path'
import { ERROR_CODE, ERROR_MESSAGE } from '@knowledge_island/error'
import Redis from 'ioredis'
import { Comment, CommentStatus } from './entities/comment.entity'
import { CommentReaction } from './entities/comment-reaction.entity'

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
    @InjectRepository(CommentReaction)
    private readonly commentReactionRepo: Repository<CommentReaction>,
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

  async getComments(postId: string, userId?: string) {
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
        createdAt: 'DESC',
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

    for (const replyList of replyMap.values()) {
      replyList.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    }

    const commentIds = comments.map((comment) => comment.id)

    const userReactions = userId
      ? await this.commentReactionRepo.find({
          where: {
            user: {
              id: userId,
            },
            comment: {
              id: In(commentIds),
            },
          },
          relations: {
            comment: true,
          },
        })
      : []

    const reactionMap = new Map(
      userReactions.map((reaction) => [reaction.comment.id, reaction.type])
    )

    return roots.map((root) => ({
      id: root.id,
      content: root.content,
      createdAt: root.createdAt,
      likeCount: root.likeCount,
      userReaction: reactionMap.get(root.id) ?? null,
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
          userReaction: reactionMap.get(reply.id) ?? null,
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

  async updateCommentViewCount(id: string) {
    await this.redis.hincrby(
      `${process.env.APP_NAME}:post:comment:count`,
      id,
      1
    )
  }

  async createComment(dto: CreateCommentDto, userId: string) {
    const html = json2html(dto.contentJSON as JSON)

    const comment = this.commentRepo.create({
      content: html,
      status: CommentStatus.PUBLISHED, // TODO: modify to REVIEWING
      post: {
        id: dto.postId,
      } as Post,
      parent: {
        id: dto.parentId,
      } as Comment,
      replyComment: {
        id: dto.replyCommentId,
      } as Comment,
      author: {
        id: userId,
      },
    })

    await this.commentRepo.save(comment)

    void this.updateCommentViewCount(dto.postId).catch((err) => {
      this.logger.warn(`更新帖子 ${dto.postId} 评论量失败`, err)
    })
  }

  async changeCommentReactionType(
    dto: CreateCommentReactionDto,
    userId: string
  ) {
    const comment = await this.commentRepo.findOne({
      where: {
        id: dto.commentId,
      },
    })

    if (!comment) {
      throw new NotFoundException({
        code: ERROR_CODE.COMMENT_NOT_FOUND,
        message: ERROR_MESSAGE[ERROR_CODE.COMMENT_NOT_FOUND],
      })
    }

    const reaction = await this.commentReactionRepo.findOne({
      where: {
        user: {
          id: userId,
        },
        comment: {
          id: dto.commentId,
        },
      },
    })

    // let currentUserVote: CommentReactionType | null

    /**
     * NONE -> UPVOTE
     * NONE -> DOWNVOTE
     */
    if (!reaction) {
      await this.commentReactionRepo.save({
        user: {
          id: userId,
        },
        comment: {
          id: dto.commentId,
        },
        type: dto.type,
      })

      if (dto.type === CommentReactionType.LIKE) {
        await this.commentRepo.increment({ id: dto.commentId }, 'likeCount', 1)
      } else {
        await this.commentRepo.increment(
          { id: dto.commentId },
          'dislikeCount',
          1
        )
      }

      // currentUserVote = dto.type
    } else if (reaction.type === dto.type) {
      /**
       * UPVOTE -> NONE
       * DOWNVOTE -> NONE
       */

      await this.commentReactionRepo.remove(reaction)

      if (dto.type === CommentReactionType.LIKE) {
        await this.commentRepo.decrement({ id: dto.commentId }, 'likeCount', 1)
      } else {
        await this.commentRepo.decrement(
          { id: dto.commentId },
          'dislikeCount',
          1
        )
      }

      // currentUserVote = null
    } else {
      /**
       * UPVOTE -> DOWNVOTE
       * DOWNVOTE -> UPVOTE
       */

      const oldType = reaction.type

      reaction.type = dto.type

      await this.commentReactionRepo.save(reaction)

      if (
        oldType === CommentReactionType.LIKE &&
        dto.type === CommentReactionType.DISLIKE
      ) {
        await this.commentRepo.decrement({ id: dto.commentId }, 'likeCount', 1)

        await this.commentRepo.increment(
          { id: dto.commentId },
          'dislikeCount',
          1
        )
      }

      if (
        oldType === CommentReactionType.DISLIKE &&
        dto.type === CommentReactionType.LIKE
      ) {
        await this.commentRepo.decrement(
          { id: dto.commentId },
          'dislikeCount',
          1
        )

        await this.commentRepo.increment({ id: dto.commentId }, 'likeCount', 1)
      }

      // currentUserVote = dto.type
    }
  }
}
