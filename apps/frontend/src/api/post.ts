import { request } from '@/utils/request'
import { compressImage } from '@/utils/compress'
import {
  CreatePostSchema,
  PostInfo,
  type CreatePostDto,
} from '@knowledge_island/schemas'

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

export async function getPostAPI(page: number, pageSize: number) {
  // try {
  const res = await request.get('/post', {
    params: {
      page,
      pageSize,
    },
  })

  const { list, total }: { list: PostInfo[]; total: number } = res.data.data

  return { list, total }
  // } catch (err) {
  //   console.error('API Error: ', err)
  //   throw new Error('Failed to fetch data.')
  // }
}
