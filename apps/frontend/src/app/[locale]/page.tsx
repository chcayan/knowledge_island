import Search from '@/components/common/search/search'
import ThemeToggle from '@/components/layout/theme-toggle'
import styles from './page.module.scss'
import PostList from '@/components/home/post-list/post-list'
import { Suspense } from 'react'
import ScrollRestoration from '@/components/layout/scroll-restoration'
import { locale } from '@/types/locale'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import CardListSkeleton from '@/components/home/card-list-skeleton/card-list-skeleton'
import UserControl from '@/components/home/user-control/user-control'

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{
    locale: locale
  }>
}>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata.home' })

  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      t('keywords.1'),
      t('keywords.2'),
      t('keywords.3'),
      t('keywords.4'),
    ],
  }
}

export default async function Home(props: {
  searchParams?: Promise<{
    page?: string
  }>
}) {
  const searchParams = await props.searchParams
  const page = Number(searchParams?.page ?? 1)

  return (
    <>
      <div className={styles.home}>
        <main className={styles.main}>
          <ScrollRestoration />
          <div className={styles.head}>
            <Search />
            <div className={styles['user-control']}>
              <UserControl />
            </div>
          </div>
          <Suspense key={page} fallback={<CardListSkeleton />}>
            <PostList searchParams={props.searchParams} />
          </Suspense>
        </main>
        <aside className={styles.aside}>
          <div className={styles['user-control']}>
            <UserControl />
          </div>
          <ThemeToggle />
        </aside>
      </div>
    </>
  )
}
