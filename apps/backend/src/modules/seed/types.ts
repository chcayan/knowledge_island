import { CommentStatus } from '../post/entities/comment.entity'
import { PostStatus, PostType } from '../post/entities/post.entity'

export type UserInfo = Array<{
  id: string
  name: string
  email: string
  password: string
  canReviewPost: boolean
  canManageUserPermission: boolean
}>

export type PostInfo = Array<{
  id: string
  content: JSON
  type: PostType
  status: PostStatus
  author_id: string
  tags: string[]
  comments: Array<{
    id: string
    content: JSON
    status: CommentStatus
    parent_id: string | null
    reply_comment_id: string | null
    reply_user_id: string | null
    author_id: string
  }>
}>
