'use client'

import { NOT_FOUND_CODE, UNAUTHORIZED_CODE } from '@/config/request'
import emitter from '@/utils/event-emitter'
import { Toast } from '@/utils/toast'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function EmitterNotification() {
  const t = useTranslations('RequestError')
  const router = useRouter()

  useEffect(() => {
    Toast.init()

    const unAuthOff = emitter.on(
      'API:UNAUTHORIZED',
      (code: typeof UNAUTHORIZED_CODE) => {
        Toast.show({
          msg: t(`401.${code}`),
          type: 'error',
        })
        if (Number(code) !== 401005) {
          router.replace('/login')
        }
      }
    )

    const notFoundOff = emitter.on(
      'API:NOT_FOUND',
      (code: typeof NOT_FOUND_CODE) => {
        Toast.show({
          msg: t(`404.${code}`),
          type: 'error',
        })
      }
    )

    return () => {
      unAuthOff()
      notFoundOff()
    }
  }, [router, t])

  return null
}
