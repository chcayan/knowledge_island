import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Tag } from './entities/tag.entity'
import { Post, PostStatus } from './entities/post.entity'
import { Image } from './entities/image.entity'

import { Repository } from 'typeorm'
import { getFileMD5, json2html } from '../../utils'
import { CreatePostDto } from '@knowledge_island/schemas'
import fs from 'fs'
import path from 'path'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
    @InjectRepository(Image) private readonly imageRepo: Repository<Image>
  ) {}

  async createPost(dto: CreatePostDto) {
    const tags = [...new Set((dto.tags ?? []).map((t) => t.trim()))]

    const existingTags = await this.tagRepo.find({
      where: tags.map((name) => ({ name })),
    })

    const existingNames = existingTags.map((t) => t.name)

    const newTagNames = tags.filter((name) => !existingNames.includes(name))

    const newTags = this.tagRepo.create(newTagNames.map((name) => ({ name })))

    await this.tagRepo.save(newTags)

    const allTags = [...existingTags, ...newTags]

    const html = json2html(dto.content as JSON)

    const post = this.postRepo.create({
      ...dto,
      tags: allTags,
      contentHtml: html,
      status: dto.status as unknown as PostStatus,
    })

    await this.postRepo.save(post)
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

  async getPost(page: number, pageSize: number) {
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // throw new Error('api failed')
    const [list, total] = await this.postRepo
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.name', 'author.avatar'])
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
