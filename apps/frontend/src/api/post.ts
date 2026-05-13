import { baseURL, request } from '@/utils/request'
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
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  })

  const res = await fetch(`${baseURL}/post?${params}`, {
    next: {
      revalidate: 60,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }

  const data = await res.json()

  const {
    list,
    total,
  }: {
    list: PostInfo[]
    total: number
  } = data.data

  return { list, total }
}
