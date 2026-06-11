'use client'

/* eslint-disable @next/next/no-img-element */
import { CommentInfo } from '@knowledge_island/schemas'
import { formatDateByYear, getImgUrl } from '@/utils'
import LexicalHtml from '../lexical-html/lexical-html'
import styles from './comment-item.module.scss'
import ReplyAction from '../reply-action/reply-action'
import CommentReplies from '../comment-replies/comment-replies'

type CommentItemProps = {
  comment: CommentInfo
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className={styles['comment-item']}>
      <div className={styles['comment-main']}>
        <img
          src={getImgUrl(comment.author.avatar)}
          className={styles['avatar']}
          alt={comment.author.name}
        />

        <div className={styles['content']}>
          <div className={styles['header']}>
            <span className={styles['nickname']}>{comment.author.name}</span>

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
