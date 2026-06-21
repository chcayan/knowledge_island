import { getUserPostListAPI } from '@/api'
import styles from './post-list.module.scss'
import Pagination from '../../common/pagination/pagination'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { POST_PAGE_SIZE } from '@/config/post-field'
import { UserPostFilter } from '@knowledge_island/schemas'
import PostCard from '@/components/home/post-card/post-card'
import { RoutePath } from '@/config/path'
import EmptyPostIcon from '@/components/icon/empty-post-icon'
import Link from 'next/link'

interface Props {
  searchParams?: Promise<{
    page?: string
    filter?: UserPostFilter
  }>
  userId: string
}

function checkFilterValid(filter: UserPostFilter | undefined) {
  const filterArr = [UserPostFilter.PUBLISHED, UserPostFilter.COLLECTION]

  if (!filter) {
    return UserPostFilter.PUBLISHED
  }

  if (filterArr.includes(filter)) {
    return filter
  } else {
    redirect(RoutePath.my)
  }
}

export default async function PostList({ searchParams, userId }: Props) {
  const t = await getTranslations('My')

  const params = await searchParams

  const page = Number(params?.page ?? 1)
  const filter = checkFilterValid(params?.filter) || UserPostFilter.PUBLISHED
  const pageSize = POST_PAGE_SIZE

  const { list, total } = await getUserPostListAPI(
    userId,
    page,
    pageSize,
    filter
  )

  const setTip = () => {
    switch (filter) {
      case UserPostFilter.COLLECTION:
        return t('tip.emptyCollectedPost')
      default:
        return t('tip.emptyPublishedPost')
    }
  }

  if (total) {
    const totalPages = Math.ceil(total / pageSize)

    if (page > totalPages) {
      redirect(RoutePath.my)
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <EmptyPostIcon />
          <p>
            {setTip()}
            {filter === UserPostFilter.PUBLISHED && (
              <Link href={RoutePath.publish}>
                <span
                  style={{
                    fontSize: '16px',
                    cursor: 'pointer',
                    textDecorationLine: 'underline',
                    fontWeight: 'bold',
                    color: 'var(--theme-font-color)',
                  }}
                >
                  {t('tip.publish')}
                </span>
              </Link>
            )}
            {filter === UserPostFilter.COLLECTION && (
              <Link href={'/'}>
                <span
                  style={{
                    fontSize: '16px',
                    cursor: 'pointer',
                    textDecorationLine: 'underline',
                    fontWeight: 'bold',
                    color: 'var(--theme-font-color)',
                  }}
                >
                  {t('tip.collect')}
                </span>
              </Link>
            )}
          </p>
        </div>
      </>
    )
  }
}
