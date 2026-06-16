import Search from '@/components/common/search/search'
import styles from './page.module.scss'
import PostList from '@/components/home/post-list/post-list'
import { Suspense } from 'react'
// import ScrollRestoration from '@/components/layout/scroll-restoration'
import { locale } from '@/types/locale'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import CardListSkeleton from '@/components/common/card-list-skeleton/card-list-skeleton'
import UserControl from '@/components/common/user-control/user-control'
import TagPostCount from '@/components/home/tag-post-count/tag-post-count'

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
        <header className={styles.head}>
          <Search />
          <div className={styles['user-control']}>
            <UserControl />
          </div>
        </header>
        <main className={styles.main}>
          <div className={styles.post}>
            {/* <ScrollRestoration /> */}
            <Suspense key={page} fallback={<CardListSkeleton />}>
              <PostList searchParams={props.searchParams} />
            </Suspense>
          </div>
          <aside className={styles.aside}>
            <TagPostCount />
          </aside>
        </main>
      </div>
    </>
  )
}
