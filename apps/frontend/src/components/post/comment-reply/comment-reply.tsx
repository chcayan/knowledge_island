/* eslint-disable @next/next/no-img-element */
import { formatDateByYear, getImgUrl } from '@/utils'
import { CommentInfo } from '@knowledge_island/schemas'
import LexicalHtml from '../lexical-html/lexical-html'
import styles from './comment-reply.module.scss'
import ReplyAction from '../reply-action/reply-action'
import { useTranslations } from 'next-intl'

type ReplyItemProps = {
  comment: CommentInfo['replies'][number]
  parentId: string
}

export default function CommentReply({ comment, parentId }: ReplyItemProps) {
  const t = useTranslations('Post')

  return (
    <div className={styles['comment-reply']}>
      <img
        src={getImgUrl(comment.author.avatar)}
        className={styles['avatar']}
        alt={comment.author.name}
      />

      <div className={styles['reply-content']}>
        <div className={styles['reply-header']}>
          <span className={styles['nickname']}>{comment.author.name}</span>
          {comment.replyUser && (
            <>
              <span className={styles['reply-label']}>
                {t('comment.replyText')}
              </span>
              <span className={styles['reply-user']}>
                {comment.replyUser.name}
              </span>
            </>
          )}
          <span className={styles['time']}>
            {formatDateByYear(comment.createdAt)}
          </span>
        </div>
        <LexicalHtml html={comment.content} />
        <ReplyAction
          commentId={comment.id}
          parentId={parentId}
          replyCommentId={comment.id}
          isRoot={false}
          likeCount={comment.likeCount}
          name={comment.author.name}
          userReaction={comment.userReaction}
        />
      </div>
    </div>
  )
}
