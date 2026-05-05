import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Tag } from './entities/tag.entity'
import { Post } from './entities/post.entity'
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
      return existing
    }

    const uploadDir = path.resolve('./public/uploads')
    await fs.promises.mkdir(uploadDir, { recursive: true })

    const finalPath = `./public/uploads/${md5}.${ext}`

    await fs.promises.rename(file.path, finalPath)

    try {
      const image = this.imageRepo.create({
        md5,
        url: `/uploads/${md5}.${ext}`,
        size: file.size,
        mime: file.mimetype,
      })

      return await this.imageRepo.save(image)
    } catch (e) {
      const existing = await this.imageRepo.findOne({
        where: { md5 },
      })

      if (existing) return existing

      throw e
    }
  }
}
