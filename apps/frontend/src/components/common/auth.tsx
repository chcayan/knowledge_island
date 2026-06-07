'use client'

import { getMeAPI } from '@/api/auth'
import { UNAUTHORIZED_CODE } from '@/config/request'
import { useUserStore } from '@/stores'
import { Toast } from '@/utils/toast'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

export default function Auth() {
  const t = useTranslations()

  useEffect(() => {
    const userId = useUserStore.getState().userId

    if (!userId) return
    async function getMe() {
      await getMeAPI().catch((err) => {
        const code = err.response.data.code as typeof UNAUTHORIZED_CODE
        Toast.show({
          msg: t(`RequestError.401.${code}`),
          type: 'error',
        })
        useUserStore.getState().remove()
      })
    }

    getMe()
  }, [t])
  return null
}
