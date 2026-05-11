'use client'

/* eslint-disable @next/next/no-img-element */
import { PostInfo } from '@knowledge_island/schemas'
import styles from './post-card.module.scss'
import { formatCount, formatDateByYear, getImgUrl } from '@/utils'
import ViewCountIcon from '../icon/view-count-icon'
import CommentCountIcon from '../icon/comment-count-icon'
import CollectionCountIcon from '../icon/collection-count-icon'
import { useState } from 'react'

export default function PostCard({ post }: { post: PostInfo }) {
  const [isCollected, setIsCollected] = useState(false)

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
        <p className={styles.title}>{post.title}</p>
        <div
          className={styles['content-html']}
          dangerouslySetInnerHTML={{
            __html: post.contentHtml,
          }}
        />
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
