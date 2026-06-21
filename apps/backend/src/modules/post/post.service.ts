import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Tag } from './entities/tag.entity'
import { Post, PostStatus } from './entities/post.entity'

import { In, IsNull, Repository } from 'typeorm'
import { json2html } from '../../common/utils/json2html.utils'
import {
  CommentReactionType,
  CreateCommentDto,
  CreateCommentReactionDto,
  CreatePostDto,
  PostFilter,
  SearchType,
  UserPostFilter,
} from '@knowledge_island/schemas'
import { ERROR_CODE, ERROR_MESSAGE } from '@knowledge_island/error'
import Redis from 'ioredis'
import { Comment, CommentStatus } from './entities/comment.entity'
import { CommentReaction } from './entities/comment-reaction.entity'
import { User } from '../user/entities/user.entity'
import { Collection } from './entities/collection.entity'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(CommentReaction)
    private readonly commentReactionRepo: Repository<CommentReaction>,
    @InjectRepository(Collection)
    private readonly collectionRepo: Repository<Collection>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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

  async getPostList(page: number, pageSize: number) {
    const [list, total] = await this.postRepo
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.name', 'author.avatar'])
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.status = :status', {
        status: PostStatus.REVIEWING, // TODO: PUBLISHED
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

  async getPost(id: string, userId?: string) {
    const qb = this.postRepo
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

    if (userId) {
      qb.leftJoin(
        Collection,
        'collection',
        'collection.postId = post.id AND collection.userId = :userId',
        {
          userId,
        }
      ).addSelect(
        'CASE WHEN collection.id IS NULL THEN 0 ELSE 1 END',
        'isCollected'
      )
    } else {
      qb.addSelect('0', 'isCollected')
    }

    const result = await qb.getRawAndEntities()

    const post = result.entities[0]

    if (!post) {
      throw new NotFoundException({
        code: ERROR_CODE.POST_NOT_FOUND,
        message: ERROR_MESSAGE[ERROR_CODE.POST_NOT_FOUND],
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const isCollected = !!Number(result.raw[0]?.isCollected ?? 0)

    void this.updatePostViewCount(id).catch((err) => {
      this.logger.warn(`更新帖子 ${id} 浏览量失败`, err)
    })

    return { ...post, isCollected }
  }

  async getMePostList(
    page: number,
    pageSize: number,
    userId: string,
    filter: PostFilter
  ) {
    const qb = this.postRepo
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.name', 'author.avatar'])
      .leftJoinAndSelect('post.tags', 'tags')

    if (filter === PostFilter.COLLECTION) {
      qb.innerJoin(
        Collection,
        'collection',
        'collection.postId = post.id AND collection.userId = :userId',
        { userId }
      ).addSelect('collection.createdAt', 'collection_created_at')
    } else {
      const statusMap = {
        [PostFilter.PUBLISHED]: PostStatus.REVIEWING, // TODO: modify to PUBLISHED
        [PostFilter.VIOLATION]: PostStatus.VIOLATION,
        [PostFilter.REVIEWING]: PostStatus.PUBLISHED, // TODO: modify to REVIEWING
      }

      qb.where('author.id = :userId', { userId }).andWhere(
        'post.status = :status',
        {
          status: statusMap[filter],
        }
      )
    }

    qb.orderBy(
      filter === PostFilter.COLLECTION
        ? 'collection.createdAt'
        : 'post.createdAt',
      'DESC'
    )
      .skip((page - 1) * pageSize)
      .take(pageSize)

    const [total, result] = await Promise.all([
      qb.getCount(),
      qb.getRawAndEntities(),
    ])

    const list = result.entities.map((post, index) => ({
      ...post,
      isCollected:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        result.raw[index].isCollected === 1 ||
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        result.raw[index].isCollected === '1',
    }))

    return {
      list,
      total,
    }
  }

  async getUserPostList(
    page: number,
    pageSize: number,
    userId: string,
    filter: UserPostFilter
  ) {
    const qb = this.postRepo
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.name', 'author.avatar'])
      .leftJoinAndSelect('post.tags', 'tags')

    if (filter === UserPostFilter.COLLECTION) {
      qb.innerJoin(
        Collection,
        'collection',
        'collection.postId = post.id AND collection.userId = :userId',
        { userId }
      ).addSelect('collection.createdAt', 'collection_created_at')
    } else {
      const statusMap = {
        [PostFilter.PUBLISHED]: PostStatus.REVIEWING, // TODO: modify to PUBLISHED
      }

      qb.where('author.id = :userId', { userId }).andWhere(
        'post.status = :status',
        {
          status: statusMap[filter],
        }
      )
    }

    qb.orderBy(
      filter === UserPostFilter.COLLECTION
        ? 'collection.createdAt'
        : 'post.createdAt',
      'DESC'
    )
      .skip((page - 1) * pageSize)
      .take(pageSize)

    const [total, result] = await Promise.all([
      qb.getCount(),
      qb.getRawAndEntities(),
    ])

    const list = result.entities.map((post, index) => ({
      ...post,
      isCollected:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        result.raw[index].isCollected === 1 ||
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        result.raw[index].isCollected === '1',
    }))

    return {
      list,
      total,
    }
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

  async getComments(
    postId: string,
    page: number,
    pageSize: number,
    userId?: string
  ) {
    const [roots, total] = await this.commentRepo.findAndCount({
      where: {
        post: {
          id: postId,
        },
        parent: IsNull(),
      },
      relations: {
        author: true,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    const rootIds = roots.map((root) => root.id)

    if (rootIds.length === 0) {
      return {
        list: [],
        total,
      }
    }

    const replies = await this.commentRepo.find({
      where: {
        parent: {
          id: In(rootIds),
        },
      },
      relations: {
        author: true,
        parent: true,
        replyComment: {
          author: true,
        },
        replyUser: true,
      },
      order: {
        createdAt: 'ASC',
      },
    })

    const replyMap = new Map<string, Comment[]>()

    for (const reply of replies) {
      const rootId = reply.parent!.id

      if (!replyMap.has(rootId)) {
        replyMap.set(rootId, [])
      }

      replyMap.get(rootId)!.push(reply)
    }

    const commentIds = [...rootIds, ...replies.map((reply) => reply.id)]

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

    const list = roots.map((root) => ({
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
          replyUser: reply.replyUser
            ? {
                id: reply.replyUser.id,
                name: reply.replyUser.name,
              }
            : null,
        })) ?? [],
    }))

    return { list, total }
  }

  async updateCommentViewCount(id: string) {
    await this.redis.hincrby(
      `${process.env.APP_NAME}:post:comment:count`,
      id,
      1
    )
  }

  async createComment(
    dto: CreateCommentDto,
    userId: string,
    commentId?: string
  ) {
    const html = json2html(dto.contentJSON as JSON)

    const replyComment = dto.replyCommentId
      ? await this.commentRepo.findOne({
          where: {
            id: dto.replyCommentId,
          },
          relations: {
            author: true,
          },
        })
      : null

    const comment = this.commentRepo.create({
      ...(commentId ? { id: commentId } : {}),
      content: html,
      contentJSON: dto.contentJSON as string,
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
      replyUser: {
        id: replyComment?.author.id ?? null,
      } as User,
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

  async toggleCollection(postId: string, userId: string) {
    const post = await this.postRepo.exists({
      where: {
        id: postId,
      },
    })

    if (!post) {
      throw new NotFoundException({
        code: ERROR_CODE.POST_NOT_FOUND,
        message: ERROR_MESSAGE[ERROR_CODE.POST_NOT_FOUND],
      })
    }

    const exists = await this.collectionRepo.exists({
      where: {
        user: {
          id: userId,
        },
        post: {
          id: postId,
        },
      },
    })

    if (exists) {
      await this.collectionRepo.delete({
        user: {
          id: userId,
        },
        post: {
          id: postId,
        },
      })

      return {
        message: '取消收藏成功',
      }
    }

    await this.collectionRepo.insert({
      user: {
        id: userId,
      },
      post: {
        id: postId,
      },
    })

    return {
      message: '收藏成功',
    }
  }

  async getSearchResult(
    page: number,
    pageSize: number,
    result: string,
    type: SearchType
  ) {
    if (type === SearchType.TAG) {
      const [list, total] = await this.tagRepo
        .createQueryBuilder('tag')
        .select(['tag.name'])
        .where('tag.name like :result', { result: `%${result}%` })
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount()

      return {
        list,
        total,
      }
    } else if (type === SearchType.USER) {
      const [list, total] = await this.userRepo
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.name',
          'user.email',
          'user.avatar',
          'user.followCount',
          'user.fanCount',
          'user.sex',
          'user.signature',
        ])
        .where('user.name like :result', {
          result: `%${result}%`,
        })
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount()

      return {
        list,
        total,
      }
    } else {
      const [list, total] = await this.postRepo
        .createQueryBuilder('post')
        .leftJoin('post.author', 'author')
        .addSelect(['author.id', 'author.name', 'author.avatar'])
        .leftJoinAndSelect('post.tags', 'tags')
        .where('post.status = :status', {
          status: PostStatus.REVIEWING, // TODO: PUBLISHED
        })
        .andWhere('post.contentHtml like :result', {
          result: `%${result}%`,
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
  }
}
