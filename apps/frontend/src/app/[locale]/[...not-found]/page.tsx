'use client'

import ErrorIcon from '@/components/icon/error-icon'
import { useTranslations } from 'next-intl'
import { redirect } from 'next/navigation'

export default function NotFoundPage() {
  const t = useTranslations('Global')

  const redirectToHomePage = () => {
    redirect('/')
  }

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
        <h1>{t('error.NOT_FOUND_TIP')}</h1>
        <button
          style={{
            textDecorationLine: 'underline',
            cursor: 'pointer',
            fontSize: '16px',
          }}
          onClick={() => redirectToHomePage()}
        >
          {t('event.navigateToHome')}
        </button>
      </div>
    </main>
  )
}
