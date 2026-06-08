import z from 'zod'
import { AuthorSchema } from './common'

enum CommentStatus {
  REVIEWING = '0',
}

export const CommentSchema = z.object({
  id: z.uuid(),
  postId: z.uuid({ error: '帖子 ID 不能为空' }),
  authorId: z.uuid({ error: '用户 ID 不能为空' }),
  parentId: z.uuid().nullable(),
  replyCommentId: z.uuid().nullable(),
  content: z.string(),
  likeCount: z.number(),
  status: z.enum(CommentStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateCommentSchema = z.object({
  contentJSON: z.any().refine((val) => val !== null && val !== undefined, {
    message: '内容不能为空',
  }),
  postId: CommentSchema.shape.postId,
  parentId: CommentSchema.shape.parentId,
  replyCommentId: CommentSchema.shape.replyCommentId,
})

export const CommentInfoSchema = CommentSchema.pick({
  id: true,
  content: true,
  likeCount: true,
  createdAt: true,
}).extend({
  author: AuthorSchema.shape.author,
  replies: z.array(
    z.object({
      id: CommentSchema.shape.id,
      author: AuthorSchema.shape.author,
      content: CommentSchema.shape.content,
      likeCount: CommentSchema.shape.likeCount,
      createdAt: CommentSchema.shape.createdAt,
      replyUser: z.object({
        id: AuthorSchema.shape.author.shape.id,
        name: AuthorSchema.shape.author.shape.name,
      }),
    })
  ),
})

export type Comment = z.infer<typeof CommentSchema>
export type CreateCommentDto = z.infer<typeof CreateCommentSchema>
export type CommentInfo = z.infer<typeof CommentInfoSchema>
