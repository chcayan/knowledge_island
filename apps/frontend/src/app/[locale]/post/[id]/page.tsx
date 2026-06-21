import Search from '@/components/common/search/search'
import styles from './post.module.scss'
import UserControl from '@/components/common/user-control/user-control'
import { Suspense } from 'react'
import CardSkeleton from '@/components/common/card-skeleton/card-skeleton'
import BackButton from '@/components/common/back-button'
import CommentInput from '@/components/post/comment-input/comment-input'
import CommentList from '@/components/post/comment-list/comment-list'
import { getTranslations } from 'next-intl/server'
import PostCardWrapper from '@/components/post/post-card/post-card-wrapper'
import CommentListSkeleton from '@/components/post/comment-skeleton/comment-list-skeleton'
import { COMMENTS_ANCHOR } from '@/config/path'
import { Metadata } from 'next'
import { locale } from '@/types/locale'

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
    namespace: 'Metadata.post',
  })

  return {
    title: t('title'),
  }
}

export default async function PostPage(props: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{
    page?: string
  }>
}) {
  const t = await getTranslations('Post')
  const params = await props.params
  const searchParams = await props.searchParams

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
            <h3
              id={COMMENTS_ANCHOR}
              style={{
                scrollMarginTop: '80px',
              }}
            >
              {t('comment.title')}
            </h3>
            <ul>
              <Suspense fallback={<CommentListSkeleton />}>
                <CommentList searchParams={searchParams} id={params.id} />
              </Suspense>
            </ul>
          </div>
        </main>
      </div>
    </>
  )
}
