'use client'
import { useState } from 'react'
import styles from './reply-action.module.scss'
import LikeIcon from '@/components/icon/like-icon'
import DislikeIcon from '@/components/icon/dislike-icon'
import { formatCount } from '@/utils'
import { useTranslations } from 'next-intl'

export default function ReplyAction({
  id,
  isRoot,
  likeCount,
}: {
  id: string
  isRoot: boolean
  likeCount: number
}) {
  const t = useTranslations('Post')

  const [likeStatus, setLikeStatus] = useState<'none' | 'like' | 'dislike'>(
    'none'
  )

  const [count, setCount] = useState(likeCount)

  const setLike = () => {
    setLikeStatus(likeStatus === 'like' ? 'none' : 'like')
    setCount((count) => {
      if (likeStatus === 'like') return count - 1
      else return count + 1
    })
  }

  const setDislike = () => {
    setLikeStatus(likeStatus === 'dislike' ? 'none' : 'dislike')
    setCount((count) => {
      if (likeStatus === 'like') count -= 1
      return count
    })
  }

  const onReply = (id: string) => {
    console.log(`id: ${id}, isRoot: ${isRoot}`)
  }

  return (
    <div className={styles['reply-action']}>
      <button className={styles.like} onClick={setLike}>
        <LikeIcon isLike={likeStatus === 'like'} />
        <span>{formatCount(count)}</span>
      </button>
      <button className={styles.like} onClick={setDislike}>
        <DislikeIcon isDislike={likeStatus === 'dislike'} />
      </button>
      <button onClick={() => onReply(id)}>{t('comment.reply')}</button>
    </div>
  )
}
