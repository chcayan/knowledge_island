'use client'

import { useMemo, useState } from 'react'
import styles from './comment-replies.module.scss'
import { CommentInfo } from '@knowledge_island/schemas'
import CommentReply from '../comment-reply/comment-reply'
import { COMMENT_REPLY_COUNT } from '@/config/post-field'

interface Props {
  replies: CommentInfo['replies']
  parentId: string
}

const STEP = COMMENT_REPLY_COUNT

export default function CommentReplies({ replies, parentId }: Props) {
  const [visibleCount, setVisibleCount] = useState(STEP)

  const visibleReplies = useMemo(
    () => replies.slice(0, visibleCount),
    [replies, visibleCount]
  )

  const hasMore = visibleCount < replies.length

  // const remainingCount = replies.length - visibleCount

  return (
    <div className={styles.wrapper}>
      <div className={styles.replies}>
        {visibleReplies.map((reply) => (
          <CommentReply key={reply.id} comment={reply} parentId={parentId} />
        ))}
      </div>

      {replies.length > STEP && (
        <div className={styles.actions}>
          {hasMore ? (
            <button
              className={styles.button}
              onClick={() => setVisibleCount((count) => count + STEP)}
            >
              查看更多回复
              {/* {remainingCount > 0 && `（剩余 ${remainingCount} 条）`} */}
            </button>
          ) : (
            <button
              className={styles.button}
              onClick={() => setVisibleCount(STEP)}
            >
              收起回复
            </button>
          )}
        </div>
      )}
    </div>
  )
}
