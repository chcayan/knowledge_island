/* eslint-disable @next/next/no-img-element */
import styles from './page.module.scss'
import { redirect } from 'next/navigation'
import { POST_PAGE_SIZE } from '@/config/post-field'
import { getSearchResultAPI } from '@/api'
import { PostInfo, SearchType, UserPublic } from '@knowledge_island/schemas'
import Search from '@/components/common/search/search'
import UserControl from '@/components/common/user-control/user-control'
import BackButton from '@/components/common/back-button'
import PostCard from '@/components/home/post-card/post-card'
import Pagination from '@/components/common/pagination/pagination'
import ToggleButton from '@/components/common/toggle-button-server/toggle-button-server'
import EmptyPostIcon from '@/components/icon/empty-post-icon'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { RoutePath } from '@/config/path'
import { locale } from '@/types/locale'
import { Metadata } from 'next'

interface Props {
  searchParams: Promise<{
    keyword: string
    type?: SearchType
    page?: string
  }>
}

export async function generateMetadata({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{
    locale: locale
  }>
  searchParams: Promise<{
    keyword: string
  }>
}>): Promise<Metadata> {
  const { locale } = await params
  const { keyword } = await searchParams
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.search',
  })

  return {
    title: t('title', {
      keyword,
    }),
  }
}

function checkFilterValid(type: SearchType | undefined) {
  const filterArr = [SearchType.POST, SearchType.TAG, SearchType.USER]

  if (!type) {
    return SearchType.POST
  }

  if (filterArr.includes(type)) {
    return type
  } else {
    redirect('/')
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const t = await getTranslations('Search')
  const params = await searchParams

  const page = Number(params?.page ?? 1)
  const pageSize = POST_PAGE_SIZE
  const type = checkFilterValid(params.type) || SearchType.POST

  const { list, total } = await getSearchResultAPI(
    params.keyword,
    type,
    page,
    pageSize
  )

  return (
    <div className={styles.search}>
      <header className={styles.head}>
        <div className={styles.left}>
          <BackButton />
          <Search />
        </div>
        <div className={styles['user-control']}>
          <UserControl />
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.toggle}>
            <ToggleButton
              value={type}
              options={[
                {
                  label: t('tab.post'),
                  value: SearchType.POST,
                },
                {
                  label: t('tab.tag'),
                  value: SearchType.TAG,
                },
                {
                  label: t('tab.user'),
                  value: SearchType.USER,
                },
              ]}
              searchParamName={'type'}
              searchParams={params}
            />
          </div>

          {type === SearchType.POST &&
            list.map((post: PostInfo) => (
              <PostCard key={`post-${post.id}`} post={post} />
            ))}
          {type === SearchType.TAG &&
            list.map((tag: { name: string; postCount: number }) => (
              <div
                tabIndex={0}
                key={`tag-${tag.name}`}
                className={`${styles.tag} tab-focus`}
              >
                <p># {tag.name}</p>
                <p>{t('tip.tagCount', { count: tag.postCount })}</p>
              </div>
            ))}
          {type === SearchType.USER &&
            list.map((user: UserPublic) => (
              <Link
                key={`user-${user.id}`}
                className={`${styles.user} tab-focus`}
                href={`${RoutePath.user}/${user.id}`}
              >
                <img src={user.avatar} alt="user-avatar" />
                <div className={styles.info}>
                  <p className={styles.name}>{user.name}</p>
                  <div>
                    <p>
                      {t('tip.fan')} {user.fanCount}
                    </p>
                    <p>
                      {t('tip.follow')} {user.followCount}
                    </p>
                  </div>
                  <p className={styles.signature}>{user.signature}</p>
                </div>
              </Link>
            ))}
          {total === 0 && (
            <div className={styles.empty}>
              <EmptyPostIcon />
              <p>{t('tip.noResult')}</p>
            </div>
          )}
          <Pagination
            currentPage={page}
            total={total}
            pageSize={pageSize}
            replace={false}
          />
        </div>
        <aside className={styles.aside}></aside>
      </main>
    </div>
  )
}
