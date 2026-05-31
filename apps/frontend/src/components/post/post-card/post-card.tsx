'use client'

/* eslint-disable @next/next/no-img-element */
import { PostInfo } from '@knowledge_island/schemas'
import styles from './post-card.module.scss'
import { formatCount, formatDateByYear, getImgUrl } from '@/utils'
import ViewCountIcon from '../../icon/view-count-icon'
import CommentCountIcon from '../../icon/comment-count-icon'
import CollectionCountIcon from '../../icon/collection-count-icon'
import { useState } from 'react'
import 'katex/dist/katex.min.css'

export default function PostCard({ post }: { post: PostInfo }) {
  const [isCollected, setIsCollected] = useState(false)

  return (
    <div tabIndex={0} className={`${styles.post} tab-focus`}>
      <header>
        <img src={getImgUrl(post.author.avatar)} alt="avatar" />
        <div className={styles.info}>
          <p>{post.author.name}</p>
          <p>{formatDateByYear(post.createdAt)}</p>
        </div>
      </header>
      <div className={styles.main}>
        <div
          className={styles['content-html']}
          dangerouslySetInnerHTML={{
            __html: post.contentHtml,
          }}
        />
        <div className={styles.tags}>
          <ul>
            {post.tags.length > 0 &&
              post.tags.map((tag) => (
                <li key={tag.id}>
                  <p># {tag.name}</p>
                </li>
              ))}
          </ul>
        </div>
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
