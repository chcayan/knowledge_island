import { getPostAPI } from '@/api'
import PostCard from './post-card'
import { notFound } from 'next/navigation'

export default async function PostCardWrapper({ id }: { id: string }) {
  const post = await getPostAPI(id)

  if (!post) {
    notFound()
  }

  return <PostCard post={post} />
}
