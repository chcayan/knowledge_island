import { getCommentsAPI } from '@/api'
import CommentItem from './comment-item'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Pagination from '@/components/common/pagination/pagination'
import { COMMENT_PAGE_SIZE } from '@/config/post-field'

interface Props {
  searchParams?: {
    page?: string
  }
  id: string
}

export default async function CommentList({ searchParams, id }: Props) {
  const t = await getTranslations('Post')

  const page = Number(searchParams?.page ?? 1)
  const pageSize = COMMENT_PAGE_SIZE

  const { list, total } = await getCommentsAPI(id, page, pageSize)

  if (total) {
    const totalPages = Math.ceil(total / pageSize)

    if (page > totalPages) {
      redirect('/')
    }

    return (
      <>
        {list.map((comment) => (
          <li key={comment.id}>
            <CommentItem comment={comment} />
          </li>
        ))}
        <div style={{ height: '20px' }}></div>
        <Pagination currentPage={page} total={total} pageSize={pageSize} />
      </>
    )
  } else {
    return <p style={{ marginTop: '10px' }}>{t('comment.emptyTip')}</p>
  }
}
