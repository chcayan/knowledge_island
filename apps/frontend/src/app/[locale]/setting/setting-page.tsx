'use client'

import { LogoutAPI } from '@/api'
import LocaleToggle from '@/components/common/locale-toggle'
import { RouterPath } from '@/config/path'
import { useUserStore } from '@/stores'
import { locale } from '@/types/locale'
import { Toast } from '@/utils/toast'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'

export default function SettingPage() {
  const t = useTranslations('Setting')
  const params = useParams()
  const locale = params.locale as locale
  const userId = useUserStore((state) => state.userId)
  const router = useRouter()

  const handleLogin = async () => {
    if (userId) {
      console.log('logout')
      await LogoutAPI()

      Toast.show({
        msg: '退出成功',
        type: 'success',
      })
      const removeUserId = useUserStore.getState().removeUserId
      removeUserId()
    } else {
      console.log('login')
      router.push(`${RouterPath.login}?redirect=${RouterPath.setting}`)
    }
  }

  return (
    <>
      <h1>{t('title')}</h1>
      <h3>语言</h3>
      <LocaleToggle locale={locale} />
      <h3>个人</h3>
      <button onClick={handleLogin}>{userId ? '退出登录' : '登录'}</button>
    </>
  )
}
