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
        <header className={styles.head}>
          <BackButton />
          <Search />
          <div className={styles['user-control']}>
            <UserControl />
          </div>
        </header>
        <main className={styles.main}>
          <div className={styles.post}>
            <Suspense fallback={<CardSkeleton />}>
              <PostCardSkeleton id={params.id} />
            </Suspense>
          </div>
          <aside className={styles.aside}>
            <CommentInput />
          </aside>
          <ul className={styles.comment}>
            <li>发的撒法发</li>
            <li>啊的撒法发</li>
            <li>啊手动阀手动阀方式</li>
            <li>v啊阿斯顿发发发</li>
            <li>啊但是发射点发顺丰的</li>
          </ul>
        </main>
      </div>
    </>
  )
}
