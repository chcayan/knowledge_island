import { getCommentsAPI } from '@/api'
import CommentItem from './comment-item'
import { getTranslations } from 'next-intl/server'

export default async function CommentListSkeleton({ id }: { id: string }) {
  const t = await getTranslations('Post')
  const comments = await getCommentsAPI(id)
  return comments.length === 0 ? (
    <p style={{ marginTop: '10px' }}>{t('comment.emptyTip')}</p>
  ) : (
    comments.map((comment) => (
      <li key={comment.id}>
        <CommentItem comment={comment} />
      </li>
    ))
  )
}
