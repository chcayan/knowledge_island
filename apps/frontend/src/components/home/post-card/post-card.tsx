'use client'

/* eslint-disable @next/next/no-img-element */
import { PostInfo } from '@knowledge_island/schemas'
import styles from './post-card.module.scss'
import { formatCount, formatDateByYear } from '@/utils'
import ViewCountIcon from '../../icon/view-count-icon'
import CommentCountIcon from '../../icon/comment-count-icon'
import { useEffect, useRef, useState } from 'react'
import 'katex/dist/katex.min.css'
import { useRouter } from 'next/navigation'
import { RoutePath } from '@/config/path'

export default function PostCard({ post }: { post: PostInfo }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [overflow, setOverflow] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const el = contentRef.current

    if (el) {
      setOverflow(el.scrollHeight > el.clientHeight)
    }
  }, [])

  const navigateToUserPage = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`${RoutePath.user}/${post.author.id}`)
    console.log('navigateToUserPage')
  }

  const navigateToPostPage = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('a')) {
      return
    }

    router.push(`${RoutePath.post}/${post.id}`)

    console.log('navigateToPostPage')
  }

  return (
    <article tabIndex={0} className={`${styles.post} tab-focus`}>
      <header onClick={navigateToPostPage}>
        <img
          onClick={navigateToUserPage}
          src={post.author.avatar}
          alt="avatar"
          style={{ cursor: 'pointer' }}
        />
        <div className={styles.info}>
          <p onClick={navigateToUserPage} style={{ cursor: 'pointer' }}>
            {post.author.name}
          </p>
          <p>{formatDateByYear(post.createdAt)}</p>
        </div>
      </header>
      <div className={styles.main} onClick={navigateToPostPage}>
        <div
          ref={contentRef}
          className={styles['content-html']}
          dangerouslySetInnerHTML={{
            __html: post.contentHtml,
          }}
        />
        {overflow && (
          <>
            <div className={styles.fade} />
          </>
        )}
      </div>
      <div className={styles.divider}></div>
      <footer>
        <div className={styles.left}>
          <ul>
            <li>
              <ViewCountIcon />
              <p>{formatCount(post.viewCount)}</p>
            </li>
            <li>
              <CommentCountIcon />
              <p>{formatCount(post.commentCount)}</p>
            </li>
          </ul>
        </div>
      </footer>
    </article>
  )
}
