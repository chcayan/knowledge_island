import { request } from '@/utils/request'
import { compressImage } from '@/utils/compress'
import {
  CommentInfo,
  CreateCommentDto,
  CreateCommentSchema,
  CreatePostSchema,
  DraftInfo,
  PostInfo,
  type CreatePostDto,
} from '@knowledge_island/schemas'
import { fetchData } from '@/utils'

export async function createPostAPI(dto: CreatePostDto) {
  const data = CreatePostSchema.parse(dto)
  return request.post('/post/create', data)
}

export async function createCommentAPI(dto: CreateCommentDto) {
  const data = CreateCommentSchema.parse(dto)
  return request.post('/post/comment/create', data)
}

export async function saveDraftAPI(dto: CreatePostDto) {
  const data = CreatePostSchema.parse(dto)
  return request.post('/post/draft', data)
}

export async function uploadImageAPI(file: File) {
  const compressedFile = await compressImage(file)
  const formData = new FormData()
  formData.append('image', compressedFile || file)

  return request.post('/post/upload-image', formData)
}

export async function getPostListAPI(page: number, pageSize: number) {
  const data = await fetchData('/post', {
    params: {
      page,
      pageSize,
    },
  })

  const {
    list,
    total,
  }: {
    list: PostInfo[]
    total: number
  } = data

  return { list, total }
}

export async function getPostAPI(id: string) {
  const post: PostInfo = await fetchData(`/post/${id}`)
  return post
}

export async function getCommentsAPI(id: string) {
  const comments: CommentInfo[] = await fetchData(`/post/comments/${id}`, {
    options: {
      cache: 'no-store',
    },
  })
  return comments
}

export async function getDraftAPI() {
  const res = await request.get('/post/draft')
  const { draft }: { draft: DraftInfo | null } = res.data.data

  return { draft }
}

export type TagPostCountType = {
  id: string
  name: string
  postCount: number
}

export async function getTagPostCountAPI() {
  const res = await request.get('/post/tag-post-count')
  const result: TagPostCountType[] = res.data.data

  return result
}
