'use client'

import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const PublishPage = dynamic(() => import('./publish-page'), {
  ssr: false,
})

export default function PublishClientPage() {
  const t = useTranslations('Metadata.publish')

  useEffect(() => {
    document.title = t('title')
  }, [t])

  return <PublishPage />
}
