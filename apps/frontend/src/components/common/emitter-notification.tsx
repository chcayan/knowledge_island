'use client'

import {
  CONFLICT_EXCEPTION_CODE,
  FORBIDDEN_CODE,
  NOT_FOUND_CODE,
  UNAUTHORIZED_CODE,
} from '@/config/request'
import { formatRemainTimeWithText } from '@/utils'
import emitter from '@/utils/event-emitter'
import { Toast } from '@/utils/toast'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function EmitterNotification() {
  const t = useTranslations()
  const router = useRouter()

  useEffect(() => {
    Toast.init()

    const unAuthOff = emitter.on(
      'API:UNAUTHORIZED',
      (code: typeof UNAUTHORIZED_CODE) => {
        Toast.show({
          msg: t(`RequestError.401.${code}`),
          type: 'error',
        })
      }
    )

    const forbiddenOff = emitter.on(
      'API:FORBIDDEN',
      (code: typeof FORBIDDEN_CODE, time?: number) => {
        Toast.show({
          msg: t(
            `RequestError.403.${code}`,
            time
              ? {
                  time: formatRemainTimeWithText(time, {
                    second: t('Global.date.timeUnit.second'),
                    minute: t('Global.date.timeUnit.minute'),
                    hour: t('Global.date.timeUnit.hour'),
                    day: t('Global.date.timeUnit.day'),
                  }),
                }
              : undefined
          ),
          type: 'error',
        })
      }
    )

    const notFoundOff = emitter.on(
      'API:NOT_FOUND',
      (code: typeof NOT_FOUND_CODE) => {
        Toast.show({
          msg: t(`RequestError.404.${code}`),
          type: 'error',
        })
      }
    )

    const conflictExceptionOff = emitter.on(
      'API:CONFLICT_EXCEPTION',
      (code: typeof CONFLICT_EXCEPTION_CODE) => {
        Toast.show({
          msg: t(`RequestError.409.${code}`),
          type: 'error',
        })
      }
    )

    const errNetworkOff = emitter.on('SERVER:ERR_NETWORK', () => {
      Toast.show({
        msg: t('RequestError.common.ERR_NETWORK'),
        type: 'error',
      })
    })

    const econnabortedOff = emitter.on('SERVER:ECONNABORTED', () => {
      Toast.show({
        msg: t('RequestError.common.ECONNABORTED'),
        type: 'error',
      })
    })

    const serverExceptionOff = emitter.on('SERVER:EXCEPTION', () => {
      Toast.show({
        msg: t('RequestError.common.SERVER_EXCEPTION'),
        type: 'error',
      })
    })

    return () => {
      unAuthOff()
      forbiddenOff()
      notFoundOff()
      conflictExceptionOff()
      errNetworkOff()
      econnabortedOff()
      serverExceptionOff()
    }
  }, [router, t])

  return null
}
