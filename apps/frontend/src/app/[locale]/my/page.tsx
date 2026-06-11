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
import CardListSkeleton from '@/components/home/card-list-skeleton/card-list-skeleton'

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
  }>
}) {
  const searchParams = await props.searchParams
  const page = Number(searchParams?.page ?? 1)

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
            {/* <ScrollRestoration />
            <Suspense key={page} fallback={<CardListSkeleton />}>
              <PostList searchParams={props.searchParams} />
            </Suspense> */}
          </div>
          <aside className={styles.aside}>
            {/* <ScrollRestoration /> */}
            <Suspense key={page} fallback={<CardListSkeleton />}>
              <PostList searchParams={props.searchParams} />
            </Suspense>
          </aside>
        </main>
      </div>
    </>
  )
}
