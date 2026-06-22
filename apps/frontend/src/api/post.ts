import { request } from '@/utils/request'
import { compressImage } from '@/utils/compress'
import {
  CommentInfo,
  CreateCommentDto,
  CreateCommentReactionDto,
  CreateCommentSchema,
  CreatePostSchema,
  DraftInfo,
  PostFilter,
  PostInfo,
  SearchType,
  UserPostFilter,
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

export async function getSearchResultAPI(
  keyword: string,
  type: SearchType,
  page: number,
  pageSize: number
) {
  const data = await fetchData('/post/search', {
    params: {
      keyword,
      type,
      page,
      pageSize,
    },
  })

  const { list, total } = data

  return { list, total }
}

export async function getPostAPI(id: string) {
  try {
    const post: PostInfo = await fetchData(`/post/${id}`, {
      options: {
        cache: 'no-store',
      },
    })
    return post
  } catch {
    return null
  }
}

export async function getCommentsAPI(
  id: string,
  page: number,
  pageSize: number
) {
  const data = await fetchData(`/post/comments/${id}`, {
    params: {
      page,
      pageSize,
    },
    options: {
      cache: 'no-store',
    },
  })

  const {
    list,
    total,
  }: {
    list: CommentInfo[]
    total: number
  } = data

  return {
    list,
    total,
  }
}

export async function getMePostListAPI(
  page: number,
  pageSize: number,
  filter: PostFilter
) {
  const data = await fetchData('/post/me', {
    params: {
      page,
      pageSize,
      filter,
    },
    options: {
      cache: 'no-store',
    },
  })

  const {
    list,
    total,
  }: {
    list: PostInfo[]
    total: number
  } = data

  return {
    list,
    total,
  }
}

export async function getUserPostListAPI(
  userId: string,
  page: number,
  pageSize: number,
  filter: UserPostFilter
) {
  const data = await fetchData(`/post/user/${userId}`, {
    params: {
      page,
      pageSize,
      filter,
    },
    options: {
      cache: 'no-store',
    },
  })

  const {
    list,
    total,
  }: {
    list: PostInfo[]
    total: number
  } = data

  return {
    list,
    total,
  }
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
  const result: TagPostCountType[] = await fetchData('/post/tag-post-count')

  return result
}

export async function changeCommentReactionTypeAPI(
  dto: CreateCommentReactionDto
) {
  return request.post('/post/comment/reaction', dto)
}

export async function toggleCollectionAPI(postId: string) {
  return request.post(`/post/${postId}/collection`)
}
