import Search from '@/components/common/search'
import ThemeToggle from '@/components/layout/theme-toggle'
import styles from './page.module.scss'
import PostList from '@/components/home/post-list'
import { Suspense } from 'react'
import CardListSkeleton from '@/components/home/card-list-skeleton'
import ScrollRestoration from '@/components/layout/scroll-restoration'

export default async function Home() {
  // const t = useTranslations('HomePage')

  // const total: number = res.data.data.total
  // const list: PostInfo[] = res.data.data.list
  // console.log(list)

  return (
    <>
      <div className={styles.home}>
        <main className={styles.main}>
          <ScrollRestoration />
          <div className={styles.search}>
            <Search />
          </div>
          <Suspense fallback={<CardListSkeleton />}>
            <PostList />
          </Suspense>
        </main>
        <aside className={styles.aside}>
          <ThemeToggle />
        </aside>
      </div>
    </>
  )
}
