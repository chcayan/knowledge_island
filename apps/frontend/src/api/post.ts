import { request } from '@/utils'
import type { CreatePostDto } from '@knowledge_island/schemas'

export function createPostAPI(dto: CreatePostDto) {
  return request.post('/post/create', dto)
}
