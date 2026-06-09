import { Inject, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Post } from './entities/post.entity'
import { Repository } from 'typeorm'
import Redis from 'ioredis'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class PostSyncTask {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,

    @Inject('REDIS_CLIENT') private readonly redis: Redis
  ) {}

  private readonly logger = new Logger(PostSyncTask.name)

  @Cron('*/1 * * * *')
  async syncViewCount() {
    const tempKey = `${process.env.APP_NAME}:post:view:count:${Date.now()}`

    const mainKey = `${process.env.APP_NAME}:post:view:count`

    await this.redis.rename(mainKey, tempKey).catch(() => null)

    const counts = await this.redis.hgetall(tempKey)

    if (!Object.keys(counts).length) {
      return
    }

    try {
      const cases = Object.entries(counts)
        .map(([id, count]) => `WHEN '${id}' THEN ${count}`)
        .join(' ')

      const ids = Object.keys(counts)
        .map((id) => `'${id}'`)
        .join(',')

      await this.postRepo.query(`
      UPDATE post
      SET view_count = 
          view_count +
          CASE id
            ${cases}
            ELSE 0
          END
      WHERE id IN (${ids})
    `)

      this.logger.log(`同步浏览量成功，共 ${Object.keys(counts).length} 篇帖子`)
    } catch (err) {
      this.logger.error('同步浏览量失败', err)
    } finally {
      await this.redis.del(tempKey)
    }
  }

  @Cron('*/1 * * * *')
  async syncCommentCount() {
    const tempKey = `${process.env.APP_NAME}:post:comment:count:${Date.now()}`

    const mainKey = `${process.env.APP_NAME}:post:comment:count`

    await this.redis.rename(mainKey, tempKey).catch(() => null)

    const counts = await this.redis.hgetall(tempKey)

    if (!Object.keys(counts).length) {
      return
    }

    try {
      const cases = Object.entries(counts)
        .map(([id, count]) => `WHEN '${id}' THEN ${count}`)
        .join(' ')

      const ids = Object.keys(counts)
        .map((id) => `'${id}'`)
        .join(',')

      await this.postRepo.query(`
      UPDATE post
      SET comment_count = 
          comment_count +
          CASE id
            ${cases}
            ELSE 0
          END
      WHERE id IN (${ids})
    `)

      this.logger.log(`同步评论量成功，共 ${Object.keys(counts).length} 篇帖子`)
    } catch (err) {
      this.logger.error('同步评论量失败', err)
    } finally {
      await this.redis.del(tempKey)
    }
  }
}
