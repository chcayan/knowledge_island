import { getPostAPI } from '@/api'
import styles from './post-list.module.scss'
import PostCard from './post-card'
import Pagination from './pagination'
import { redirect } from 'next/navigation'

interface Props {
  searchParams?: Promise<{
    page?: string
  }>
}

export default async function PostList({ searchParams }: Props) {
  const params = await searchParams

  const page = Number(params?.page ?? 1)
  const pageSize = 20

  const { list, total } = await getPostAPI(page, pageSize)

  const totalPages = Math.ceil(total / pageSize)

  if (page > totalPages) {
    redirect('/')
  }

  return (
    <>
      <div className={styles['post-list']}>
        {list.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination currentPage={page} total={total} pageSize={pageSize} />
    </>
  )
}
