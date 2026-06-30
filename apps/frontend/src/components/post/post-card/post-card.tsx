'use client'

/* eslint-disable @next/next/no-img-element */
import { PostInfo } from '@knowledge_island/schemas'
import styles from './post-card.module.scss'
import { formatCount, formatDateByYear } from '@/utils'
import ViewCountIcon from '../../icon/view-count-icon'
import CommentCountIcon from '../../icon/comment-count-icon'
import CollectionCountIcon from '../../icon/collection-count-icon'
import { useState } from 'react'
import 'katex/dist/katex.min.css'
import LexicalHtml from '../lexical-html/lexical-html'
import { toggleCollectionAPI } from '@/api'
import { useTranslations } from 'next-intl'
import { Toast } from '@/utils/toast'
import { useUserStore } from '@/stores'
import { useRouter } from 'next/navigation'
import { RoutePath } from '@/config/path'

export default function PostCard({ post }: { post: PostInfo }) {
  const [isCollected, setIsCollected] = useState(post.isCollected)

  const router = useRouter()
  const t = useTranslations('Post')

  const toggleCollection = async () => {
    const userId = useUserStore.getState().userId
    console.log(userId)
    if (!userId) {
      Toast.show({
        msg: t('event.unLogin'),
        type: 'error',
      })
      return
    }

    await toggleCollectionAPI(post.id).then(() => {
      if (isCollected) {
        Toast.show({
          msg: t('event.cancelCollectSuccess'),
          type: 'success',
        })
      } else {
        Toast.show({
          msg: t('event.collectSuccess'),
          type: 'success',
        })
      }
      setIsCollected((e) => !e)
    })
  }

  return (
    <div tabIndex={0} className={`${styles.post} tab-focus`}>
      <header>
        <img
          onClick={() => router.push(`${RoutePath.user}/${post.author.id}`)}
          src={post.author.avatar}
          alt="avatar"
          style={{ cursor: 'pointer' }}
        />
        <div className={styles.info}>
          <p
            onClick={() => router.push(`${RoutePath.user}/${post.author.id}`)}
            style={{ cursor: 'pointer' }}
          >
            {post.author.name}
          </p>
          <p>{formatDateByYear(post.createdAt)}</p>
        </div>
      </header>
      <div className={styles.main}>
        {/* <div
          className={styles['content-html']}
          dangerouslySetInnerHTML={{
            __html: post.contentHtml,
          }}
        /> */}
        <LexicalHtml html={post.contentHtml} />
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
            <li onClick={toggleCollection} style={{ cursor: 'pointer' }}>
              <CollectionCountIcon isCollected={isCollected} />
            </li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
