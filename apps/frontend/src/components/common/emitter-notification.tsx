'use client'

import {
  CONFLICT_EXCEPTION_CODE,
  NOT_FOUND_CODE,
  UNAUTHORIZED_CODE,
} from '@/config/request'
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

    const conflictExceptionOff = emitter.on(
      'API:CONFLICT_EXCEPTION',
      (code: typeof CONFLICT_EXCEPTION_CODE) => {
        Toast.show({
          msg: t(`409.${code}`),
          type: 'error',
        })
      }
    )

    const errNetworkOff = emitter.on('SERVER:ERR_NETWORK', () => {
      Toast.show({
        msg: t('common.ERR_NETWORK'),
        type: 'error',
      })
    })

    const econnabortedOff = emitter.on('SERVER:ECONNABORTED', () => {
      Toast.show({
        msg: t('common.ECONNABORTED'),
        type: 'error',
      })
    })

    const serverExceptionOff = emitter.on('SERVER:EXCEPTION', () => {
      Toast.show({
        msg: t('common.SERVER_EXCEPTION'),
        type: 'error',
      })
    })

    return () => {
      unAuthOff()
      notFoundOff()
      conflictExceptionOff()
      errNetworkOff()
      econnabortedOff()
      serverExceptionOff()
    }
  }, [router, t])

  return null
}
