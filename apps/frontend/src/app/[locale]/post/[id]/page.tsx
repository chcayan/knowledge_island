import Search from '@/components/common/search/search'
import styles from './post.module.scss'
import UserControl from '@/components/home/user-control/user-control'
import { Suspense } from 'react'
import CardSkeleton from '@/components/home/card-skeleton/card-skeleton'
import BackButton from '@/components/common/back-button'
import CommentInput from '@/components/post/comment-input/comment-input'
import CommentList from '@/components/post/comment-list/comment-list'
import { getTranslations } from 'next-intl/server'
import PostCardWrapper from '@/components/post/post-card/post-card-wrapper'
import CommentListSkeleton from '@/components/post/comment-skeleton/comment-list-skeleton'

export default async function PostPage(props: {
  params: Promise<{ id: string }>
}) {
  const t = await getTranslations('Post')
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
              <PostCardWrapper id={params.id} />
            </Suspense>
          </div>
          <aside className={styles.aside}>
            <CommentInput />
          </aside>
          <div className={styles.comment}>
            <h3>{t('comment.title')}</h3>
            <ul>
              <Suspense fallback={<CommentListSkeleton />}>
                <CommentList id={params.id} />
              </Suspense>
            </ul>
          </div>
        </main>
      </div>
    </>
  )
}
