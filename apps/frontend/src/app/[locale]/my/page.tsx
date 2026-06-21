import { locale } from '@/types/locale'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import styles from './page.module.scss'
// import Search from '@/components/common/search/search'
import UserControl from '@/components/common/user-control/user-control'
import BackButton from '@/components/common/back-button'
import UserCard from '@/components/my/user-card/user-card'
import { Suspense } from 'react'
import CardListSkeleton from '@/components/common/card-list-skeleton/card-list-skeleton'
import ToggleButton from '@/components/common/toggle-button-server/toggle-button-server'
import { PostFilter } from '@knowledge_island/schemas'
import PostList from '@/components/my/post-list/post-list'
import { getMeInfoAPI } from '@/api'

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{
    locale: locale
  }>
}>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.my',
  })

  const userInfo = await getMeInfoAPI().catch(() => {})

  return {
    title: t('title', {
      name: (userInfo && userInfo.name) || 'guest',
    }),
  }
}

export default async function MyPage(props: {
  searchParams?: Promise<{
    page?: string
    filter?: PostFilter
  }>
}) {
  const t = await getTranslations('My')
  const searchParams = await props.searchParams
  const page = Number(searchParams?.page ?? 1)
  const filter = searchParams?.filter || PostFilter.PUBLISHED

  return (
    <>
      <div className={styles.my}>
        <header className={styles.head}>
          <div className={styles['head-left']}>
            <BackButton />
            {/* <Search /> */}
          </div>
          <div className={styles['user-control']}>
            <UserControl />
          </div>
        </header>
        <main className={styles.main}>
          <div className={styles.user}>
            <UserCard />
          </div>
          <aside className={styles.aside}>
            <div className={styles.toggle}>
              <ToggleButton
                value={filter}
                options={[
                  {
                    label: t('tab.published'),
                    value: PostFilter.PUBLISHED,
                  },
                  {
                    label: t('tab.collected'),
                    value: PostFilter.COLLECTION,
                  },
                  {
                    label: t('tab.reviewing'),
                    value: PostFilter.REVIEWING,
                  },

                  {
                    label: t('tab.violated'),
                    value: PostFilter.VIOLATION,
                  },
                ]}
                searchParamName={'filter'}
                searchParams={searchParams}
              />
            </div>

            <Suspense key={page} fallback={<CardListSkeleton />}>
              <PostList searchParams={props.searchParams} />
            </Suspense>
          </aside>
        </main>
      </div>
    </>
  )
}
