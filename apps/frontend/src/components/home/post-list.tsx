import { getPostAPI } from '@/api'
import styles from './post-list.module.scss'
import PostCard from './post-card'

export default async function PostList() {
  const { list, total } = await getPostAPI(1, 20)

  return (
    <div className={styles['post-list']}>
      {list.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
