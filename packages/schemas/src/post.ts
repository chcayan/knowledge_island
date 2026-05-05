import z from 'zod'

enum PostType {
  WRITE = 0,
  ASK = 1,
}

enum PostStatus {
  DRAFT = 0,
  PUBLISHED = 1,
}

export const PostSchema = z.object({
  id: z.uuid(),
  title: z
    .string({ error: '标题不能为空' })
    .min(1, '标题至少 1 个字')
    .max(100, '标题最多 100 个字'),
  content: z.any().refine((val) => val !== null && val !== undefined, {
    message: '内容不能为空',
  }),
  viewCount: z.number(),
  likeCount: z.number(),
  commentCount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  authorId: z.uuid(),
  type: z.enum(PostType, '请选择类型'),
  status: z.enum(PostStatus, '请选择帖子状态（草稿/发布）'),
  tags: z
    .array(
      z.string().min(1, '标签名字至少 1 个字').max(50, '标签名字最多 50 个字')
    )
    .default([]),
})

export const CreatePostSchema = z.object({
  title: PostSchema.shape.title,
  content: PostSchema.shape.content,
  type: PostSchema.shape.type,
  status: PostSchema.shape.status,
  tags: PostSchema.shape.tags,
})

export type Post = z.infer<typeof PostSchema>
export type CreatePostDto = z.infer<typeof CreatePostSchema>
