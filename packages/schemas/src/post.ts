import z from 'zod'
import { TAG_NAME_MAX_LENGTH } from './config/config'
import { AuthorSchema } from './common'

export enum PostType {
  WRITE = '0',
  ASK = '1',
}

enum PostStatus {
  DRAFT = '0',
  REVIEWING = '1',
  PUBLISHED = '2',
  VIOLATION = '3',
}

export enum PostEditableStatus {
  DRAFT = '0',
  REVIEWING = '1',
}

export const PostSchema = z.object({
  id: z.uuid(),
  content: z.any().refine((val) => val !== null && val !== undefined, {
    message: '内容不能为空',
  }),
  contentHtml: z.string(),
  viewCount: z.number(),
  CollectionCount: z.number(),
  commentCount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  type: z.enum(PostType, '请选择类型'),
  status: z.enum(PostEditableStatus, '请选择帖子状态（草稿/发布）'),
  authorId: z.uuid(),
})

export const CreatePostSchema = z.object({
  content: PostSchema.shape.content,
  type: PostSchema.shape.type,
  status: PostSchema.shape.status,
  tags: z
    .array(
      z
        .string()
        .min(1, '标签名字至少 1 个字')
        .max(TAG_NAME_MAX_LENGTH, `标签名字最多 ${TAG_NAME_MAX_LENGTH} 个字`)
    )
    .default([]),
})

export const PostInfoSchema = PostSchema.omit({
  content: true,
  status: true,
}).extend({
  status: z.enum(PostStatus),
  author: AuthorSchema.shape.author,
  tags: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      createdAt: z.date(),
    })
  ),
})

export const DraftInfoSchema = PostInfoSchema.omit({
  status: true,
}).extend({
  status: z.literal('0'),
  content: PostSchema.shape.content,
})

export type Post = z.infer<typeof PostSchema>
export type CreatePostDto = z.infer<typeof CreatePostSchema>
export type PostInfo = z.infer<typeof PostInfoSchema>
export type DraftInfo = z.infer<typeof DraftInfoSchema>
