import { getMePostListAPI } from '@/api'
import styles from './post-list.module.scss'
import Pagination from '../../common/pagination/pagination'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { POST_PAGE_SIZE } from '@/config/post-field'
import { PostFilter } from '@knowledge_island/schemas'
import PostCard from '@/components/home/post-card/post-card'
import { RoutePath } from '@/config/path'
import EmptyPostIcon from '@/components/icon/empty-post-icon'
import Link from 'next/link'

interface Props {
  searchParams?: Promise<{
    page?: string
    filter?: PostFilter
  }>
}

function checkFilterValid(filter: PostFilter | undefined) {
  const filterArr = [
    PostFilter.PUBLISHED,
    PostFilter.COLLECTION,
    PostFilter.REVIEWING,
    PostFilter.VIOLATION,
  ]

  if (!filter) {
    return PostFilter.PUBLISHED
  }

  if (filterArr.includes(filter)) {
    return filter
  } else {
    redirect(RoutePath.my)
  }
}

export default async function PostList({ searchParams }: Props) {
  const t = await getTranslations('My')

  const params = await searchParams

  const page = Number(params?.page ?? 1)
  const pageSize = POST_PAGE_SIZE
  const filter = checkFilterValid(params?.filter) || PostFilter.PUBLISHED

  const { list, total } = await getMePostListAPI(page, pageSize, filter)

  const setTip = () => {
    switch (filter) {
      case PostFilter.COLLECTION:
        return t('tip.emptyCollectedPost')
      case PostFilter.REVIEWING:
        return t('tip.emptyReviewingPost')
      case PostFilter.VIOLATION:
        return t('tip.emptyViolatedPost')
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
            {filter === PostFilter.PUBLISHED && (
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
            {filter === PostFilter.COLLECTION && (
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
