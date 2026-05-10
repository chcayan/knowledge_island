import { request } from '@/utils/request'
import { compressImage } from '@/utils/compress'
import { CreatePostSchema, type CreatePostDto } from '@knowledge_island/schemas'

export function createPostAPI(dto: CreatePostDto) {
  const data = CreatePostSchema.parse(dto)
  return request.post('/post/create', data)
}

export async function uploadImageAPI(file: File) {
  const compressedFile = await compressImage(file)
  const formData = new FormData()
  formData.append('image', compressedFile || file)

  return request.post('/post/upload-image', formData)
}

export function getPostAPI(page: number, pageSize: number) {
  return request.get('/post', {
    params: {
      page,
      pageSize,
    },
  })
}
