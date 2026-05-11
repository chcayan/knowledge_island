'use client'

import ErrorIcon from '@/components/icon/error-icon'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  const t = useTranslations('Home.error')

  useEffect(() => {
    // TODO: track error
    console.error(error)
  }, [error])

  return (
    <main
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 'fit-content',
        }}
      >
        <ErrorIcon width={200} height={200} />
        <h1>{t('tip')}</h1>
        <button
          style={{
            textDecorationLine: 'underline',
            cursor: 'pointer',
            fontSize: '16px',
          }}
          onClick={() => unstable_retry()}
        >
          {t('action')}
        </button>
      </div>
    </main>
  )
}
