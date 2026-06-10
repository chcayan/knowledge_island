'use client'
import { useState } from 'react'
import styles from './reply-action.module.scss'
import LikeIcon from '@/components/icon/like-icon'
import DislikeIcon from '@/components/icon/dislike-icon'
import { formatCount } from '@/utils'
import { useTranslations } from 'next-intl'
import emitter from '@/utils/event-emitter'
import { CommentReactionType } from '@knowledge_island/schemas'
import { changeCommentReactionTypeAPI } from '@/api'

export default function ReplyAction({
  commentId,
  parentId,
  replyCommentId,
  name,
  isRoot,
  likeCount,
  userReaction,
}: {
  commentId: string
  parentId: string
  replyCommentId?: string
  name: string
  isRoot: boolean
  likeCount: number
  userReaction: CommentReactionType | null
}) {
  const t = useTranslations('Post')

  const [likeStatus, setLikeStatus] = useState<CommentReactionType | null>(
    userReaction
  )

  const [count, setCount] = useState(likeCount)

  const setLike = async () => {
    await changeCommentReactionTypeAPI({
      type: CommentReactionType.LIKE,
      commentId,
    }).then(() => {
      setLikeStatus(
        likeStatus === CommentReactionType.LIKE
          ? null
          : CommentReactionType.LIKE
      )
      setCount((count) => {
        if (likeStatus === CommentReactionType.LIKE) return count - 1
        else return count + 1
      })
    })
  }

  const setDislike = async () => {
    await changeCommentReactionTypeAPI({
      type: CommentReactionType.DISLIKE,
      commentId,
    }).then(() => {
      setLikeStatus(
        likeStatus === CommentReactionType.DISLIKE
          ? null
          : CommentReactionType.DISLIKE
      )
      setCount((count) => {
        if (likeStatus === CommentReactionType.LIKE) count -= 1
        return count
      })
    })
  }

  const onReply = (parentId: string, replyCommentId?: string) => {
    emitter.emit('EVENT:COMMENT_INPUT_FOCUS')
    // console.log(
    //   `isRoot: ${isRoot}, parentId: ${parentId}, replyCommentId: ${replyCommentId}, name: ${name} `
    // )
    if (isRoot) {
      emitter.emit('EVENT:COMMENT_REPLY_WITH_ROOT', parentId, name)
    } else {
      emitter.emit(
        'EVENT:COMMENT_REPLY_WITHOUT_ROOT',
        parentId,
        replyCommentId,
        name
      )
    }
  }

  return (
    <div className={styles['reply-action']}>
      <button className={styles.like} onClick={setLike}>
        <LikeIcon isLike={likeStatus === CommentReactionType.LIKE} />
        <span>{formatCount(count)}</span>
      </button>
      <button className={styles.like} onClick={setDislike}>
        <DislikeIcon isDislike={likeStatus === CommentReactionType.DISLIKE} />
      </button>
      <button onClick={() => onReply(parentId, replyCommentId)}>
        {t('comment.reply')}
      </button>
    </div>
  )
}
