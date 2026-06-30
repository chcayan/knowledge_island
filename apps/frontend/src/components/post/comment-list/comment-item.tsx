'use client'

/* eslint-disable @next/next/no-img-element */
import { CommentInfo } from '@knowledge_island/schemas'
import { formatDateByYear } from '@/utils'
import LexicalHtml from '../lexical-html/lexical-html'
import styles from './comment-item.module.scss'
import ReplyAction from '../reply-action/reply-action'
import CommentReplies from '../comment-replies/comment-replies'
import { useRouter } from 'next/navigation'
import { RoutePath } from '@/config/path'

type CommentItemProps = {
  comment: CommentInfo
}

export default function CommentItem({ comment }: CommentItemProps) {
  const router = useRouter()

  return (
    <div className={styles['comment-item']}>
      <div className={styles['comment-main']}>
        <img
          src={comment.author.avatar}
          className={styles['avatar']}
          alt={comment.author.name}
          onClick={() => router.push(`${RoutePath.user}/${comment.author.id}`)}
        />

        <div className={styles['content']}>
          <div className={styles['header']}>
            <span
              onClick={() =>
                router.push(`${RoutePath.user}/${comment.author.id}`)
              }
              className={styles['nickname']}
            >
              {comment.author.name}
            </span>

            <span className={styles['time']}>
              {formatDateByYear(comment.createdAt)}
            </span>
          </div>

          <LexicalHtml html={comment.content} />
          <ReplyAction
            commentId={comment.id}
            parentId={comment.id}
            isRoot={true}
            likeCount={comment.likeCount}
            name={comment.author.name}
            userReaction={comment.userReaction}
          />
        </div>
      </div>

      {/* {comment.replies.length > 0 && (
        <div className={styles['replies']}>
          {comment.replies.map((reply) => (
            <CommentReply
              key={reply.id}
              comment={reply}
              parentId={comment.id}
            />
          ))}
        </div>
      )} */}
      {comment.replies.length > 0 && (
        <CommentReplies replies={comment.replies} parentId={comment.id} />
      )}
    </div>
  )
}
