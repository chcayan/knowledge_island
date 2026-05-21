'use client'

/* eslint-disable @next/next/no-img-element */
import { PostInfo } from '@knowledge_island/schemas'
import styles from './post-card.module.scss'
import { formatCount, formatDateByYear, getImgUrl } from '@/utils'
import ViewCountIcon from '../icon/view-count-icon'
import CommentCountIcon from '../icon/comment-count-icon'
import CollectionCountIcon from '../icon/collection-count-icon'
import { useEffect, useRef, useState } from 'react'
import 'katex/dist/katex.min.css'

export default function PostCard({ post }: { post: PostInfo }) {
  const [isCollected, setIsCollected] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)
  const [overflow, setOverflow] = useState(false)

  useEffect(() => {
    const el = contentRef.current

    if (el) {
      setOverflow(el.scrollHeight > el.clientHeight)
    }
  }, [])

  return (
    <div className={styles.post}>
      <header>
        <img src={getImgUrl(post.author.avatar)} alt="avatar" />
        <div className={styles.info}>
          <p>{post.author.name}</p>
          <p>{formatDateByYear(post.createdAt)}</p>
        </div>
      </header>
      <div className={styles.main}>
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
        <div className={styles.right}>
          <ul>
            <li onClick={() => setIsCollected((e) => !e)}>
              <CollectionCountIcon isCollected={isCollected} />
            </li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
