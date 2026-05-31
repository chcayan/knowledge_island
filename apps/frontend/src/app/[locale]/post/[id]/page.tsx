import Search from '@/components/common/search/search'
import styles from './post.module.scss'
import UserControl from '@/components/home/user-control/user-control'
import { Suspense } from 'react'
import CardSkeleton from '@/components/home/card-skeleton/card-skeleton'
import PostCard from '@/components/post/post-card/post-card'
import { getPostAPI } from '@/api'
import BackButton from '@/components/common/back-button'

export default async function PostPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params

  const post = await getPostAPI(params.id)

  return (
    <>
      <div className={styles.home}>
        <main className={styles.main}>
          <div className={styles.head}>
            <BackButton />
            <Search />
            <div className={styles['user-control']}>
              <UserControl />
            </div>
          </div>
          <Suspense fallback={<CardSkeleton />}>
            <PostCard post={post} />
          </Suspense>
        </main>
        <aside className={styles.aside}>
          <div className={styles['user-control']}>
            <UserControl />
          </div>
        </aside>
      </div>
    </>
  )
}
