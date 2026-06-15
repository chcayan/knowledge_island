import { locale } from '@/types/locale'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import styles from './page.module.scss'
import Search from '@/components/common/search/search'
import UserControl from '@/components/home/user-control/user-control'
import BackButton from '@/components/common/back-button'
import UserCard from '@/components/my/user-card/user-card'
import { Suspense } from 'react'
import PostList from '@/components/home/post-list/post-list'
import CardListSkeleton from '@/components/common/card-list-skeleton/card-list-skeleton'
import ToggleButton from '@/components/common/toggle-button-server/toggle-button-server'

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

  return {
    title: t('title', {
      name: 'cxk',
    }),
  }
}

export default async function MyPage(props: {
  searchParams?: Promise<{
    page?: string
    filter?: 'published' | 'violation' | 'reviewing' | 'collection'
  }>
}) {
  const searchParams = await props.searchParams
  const page = Number(searchParams?.page ?? 1)
  const filter = searchParams?.filter || 'published'

  return (
    <>
      <div className={styles.my}>
        <header className={styles.head}>
          <div className={styles['head-left']}>
            <BackButton />
            <Search />
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
                    label: '已发布',
                    value: 'published',
                  },
                  {
                    label: '收藏',
                    value: 'collection',
                  },
                  {
                    label: '待审核',
                    value: 'reviewing',
                  },

                  {
                    label: '违规',
                    value: 'violation',
                  },
                ]}
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
