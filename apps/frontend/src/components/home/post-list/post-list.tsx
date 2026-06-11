import { getPostListAPI } from '@/api'
import styles from './post-list.module.scss'
import PostCard from '../post-card/post-card'
import Pagination from '../../common/pagination/pagination'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { POST_PAGE_SIZE } from '@/config/post-field'

interface Props {
  searchParams?: Promise<{
    page?: string
  }>
}

export default async function PostList({ searchParams }: Props) {
  const t = await getTranslations('Home')

  const params = await searchParams

  const page = Number(params?.page ?? 1)
  const pageSize = POST_PAGE_SIZE

  const { list, total } = await getPostListAPI(page, pageSize)

  if (total) {
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
  } else {
    return (
      <>
        <p>
          {t('error.noPost')}
          <button
            style={{
              fontSize: '16px',
              cursor: 'pointer',
              textDecorationLine: 'underline',
              fontWeight: 'bold',
            }}
          >
            {t('event.publish')}
          </button>
        </p>
      </>
    )
  }
}
