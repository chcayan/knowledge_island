import { request } from '@/utils/request'
import { compressImage } from '@/utils/compress'
import {
  CreatePostSchema,
  PostInfo,
  type CreatePostDto,
} from '@knowledge_island/schemas'
import { fetchData } from '@/utils'

export async function createPostAPI(dto: CreatePostDto) {
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
