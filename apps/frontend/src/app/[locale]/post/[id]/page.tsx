import Search from '@/components/common/search/search'
import styles from './post.module.scss'
import UserControl from '@/components/home/user-control/user-control'
import { Suspense } from 'react'
import CardSkeleton from '@/components/home/card-skeleton/card-skeleton'
import BackButton from '@/components/common/back-button'
import CommentInput from '@/components/post/comment-input/comment-input'
import PostCardSkeleton from '@/components/post/post-card/post-card-skeleton'

export default async function PostPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params

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
            <PostCardSkeleton id={params.id} />
          </Suspense>
        </main>
        <aside className={styles.aside}>
          <div className={styles['user-control']}>
            <UserControl />
          </div>
          <CommentInput />
        </aside>
      </div>
    </>
  )
}
