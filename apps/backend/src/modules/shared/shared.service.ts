import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'
import fs from 'fs'
import path from 'path'
import { Image } from './entities/image.entity'
import { getFileMD5 } from '../../common/utils/md5.utils'

@Injectable()
export class SharedService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>
  ) {}

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
}
