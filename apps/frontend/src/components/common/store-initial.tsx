'use client'

import { useUserStore } from '@/stores'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

export default function StoreInitial() {
  const t = useTranslations()
  useEffect(() => {
    useUserStore.getState().init(t)
  }, [t])
  return null
}
