import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'

import { PostService } from './post.service'
import { ZodValidationPipe } from '../../common/pipe/zod.pipe'
import { CreatePostSchema, type CreatePostDto } from '@knowledge_island/schemas'
import { FileInterceptor } from '@nestjs/platform-express'
import { uploadOptions } from '../../common/config/upload.config'
import { JwtGuard } from '../../common/guard/jwt.guard'

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
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image', uploadOptions))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.postService.uploadImage(file)
  }

  @Get()
  @UseGuards(JwtGuard)
  async getPost(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number
  ) {
    return this.postService.getPost(page, pageSize)
  }
}
