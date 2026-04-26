import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Post } from './entities/post.entity'
import { Repository } from 'typeorm'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>
  ) {}

  async createPost(content: string) {
    const post = this.postRepo.create({
      content,
    })

    await this.postRepo.save(post)
  }
}
