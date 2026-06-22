'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import styles from './pagination.module.scss'

interface Props {
  currentPage: number
  total: number
  pageSize: number
  anchor?: string
}

export default function Pagination({
  currentPage,
  total,
  pageSize,
  anchor,
}: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const totalPages = Math.ceil(total / pageSize)

  if (totalPages <= 1) return null

  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams)

    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', String(page))
    }

    const query = params.toString()

    const path = query ? `${pathname}?${query}` : pathname

    if (anchor) {
      return path + `#${anchor}`
    } else {
      return path
    }
  }

  const generatePages = () => {
    const pages: (number | '...')[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }

      return pages
    }

    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages)
      return pages
    }

    if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      )

      return pages
    }

    pages.push(
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages
    )

    return pages
  }

  return (
    <div className={styles.pagination}>
      <Link
        replace
        href={createPageURL(Math.max(currentPage - 1, 1))}
        className={`${styles.button} ${
          currentPage === 1 ? styles.disabled : ''
        } tab-focus`}
      >
        ←
      </Link>

      {generatePages().map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              ...
            </span>
          )
        }

        return (
          <Link
            replace
            key={`page-${page}`}
            href={createPageURL(page)}
            className={`${styles.button} ${
              currentPage === page ? styles.active : ''
            } tab-focus`}
          >
            {page}
          </Link>
        )
      })}

      <Link
        replace
        href={createPageURL(Math.min(currentPage + 1, totalPages))}
        className={`${styles.button} ${
          currentPage === totalPages ? styles.disabled : ''
        } tab-focus`}
      >
        →
      </Link>
    </div>
  )
}
