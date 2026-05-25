'use client'

import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const SettingPage = dynamic(() => import('./setting-page'), {
  ssr: false,
})

export default function Setting() {
  const t = useTranslations('Metadata.setting')

  useEffect(() => {
    document.title = t('title')
  }, [t])

  return <SettingPage />
}
