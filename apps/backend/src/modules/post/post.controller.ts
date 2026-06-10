import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'

import { PostService } from './post.service'
import { ZodValidationPipe } from '../../common/pipe/zod.pipe'
import {
  CreatePostSchema,
  CreateCommentSchema,
  CreateCommentReactionSchema,
  type CreatePostDto,
  type CreateCommentDto,
  type CreateCommentReactionDto,
} from '@knowledge_island/schemas'
import { FileInterceptor } from '@nestjs/platform-express'
import { uploadOptions } from '../../common/config/upload.config'
import { JwtGuard } from '../../common/guard/jwt.guard'
import { User } from '../../common/decorator/user.decorator'
import { UserPermissionGuard } from '../../common/guard/permission.guard'
import { UserPermission } from '../../common/decorator/permission.decorator'
import { OptionalJwtGuard } from '../../common/guard/optional-jwt.guard'
import { OptionalUser } from '../../common/decorator/optional-user.decorator'

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(JwtGuard, UserPermissionGuard)
  @UserPermission('user_post')
  async createPost(
    @Body(new ZodValidationPipe(CreatePostSchema)) dto: CreatePostDto,
    @User() userId: string
  ) {
    return this.postService.createPost(dto, userId)
  }

  @Post('comment/create')
  @UseGuards(JwtGuard, UserPermissionGuard)
  @UserPermission('user_speak')
  async createComment(
    @Body(new ZodValidationPipe(CreateCommentSchema)) dto: CreateCommentDto,
    @User() userId: string
  ) {
    return this.postService.createComment(dto, userId)
  }

  @Post('comment/reaction')
  @UseGuards(JwtGuard)
  async changeCommentReactionType(
    @Body(new ZodValidationPipe(CreateCommentReactionSchema))
    dto: CreateCommentReactionDto,
    @User() userId: string
  ) {
    return this.postService.changeCommentReactionType(dto, userId)
  }

  @Post('draft')
  @UseGuards(JwtGuard)
  async saveDraft(
    @Body(new ZodValidationPipe(CreatePostSchema)) dto: CreatePostDto,
    @User() userId: string
  ) {
    return this.postService.saveDraft(dto, userId)
  }

  @Get('draft')
  @UseGuards(JwtGuard)
  async getDraft(@User() userId: string) {
    return this.postService.getDraft(userId)
  }

  @Post('upload-image')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image', uploadOptions))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.postService.uploadImage(file)
  }

  @Get('tag-post-count')
  async getTagPostCount() {
    return this.postService.getTagPostCount()
  }

  @Get('comments/:id')
  @UseGuards(OptionalJwtGuard)
  async getComments(
    @Param('id') id: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @OptionalUser() userId: string
  ) {
    return this.postService.getComments(id, page, pageSize, userId)
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    return this.postService.getPost(id)
  }

  @Get()
  async getPostList(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number
  ) {
    return this.postService.getPostList(page, pageSize)
  }
}
