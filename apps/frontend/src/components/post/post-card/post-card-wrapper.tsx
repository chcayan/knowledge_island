import { getPostAPI } from '@/api'
import PostCard from './post-card'

export default async function PostCardWrapper({ id }: { id: string }) {
  const post = await getPostAPI(id)

  return <PostCard post={post} />
}
