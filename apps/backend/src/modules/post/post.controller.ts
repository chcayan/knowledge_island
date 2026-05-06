import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'

import { PostService } from './post.service'
import { ZodValidationPipe } from '../../common/pipe/zod.pipe'
import { CreatePostSchema, type CreatePostDto } from '@knowledge_island/schemas'
import { FileInterceptor } from '@nestjs/platform-express'
import { uploadOptions } from '../../common/config/upload'

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  async createPost(
    @Body(new ZodValidationPipe(CreatePostSchema)) dto: CreatePostDto
  ) {
    return this.postService.createPost(dto)
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image', uploadOptions))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.postService.uploadImage(file)
  }
}
