'use client'

import { LogoutAPI } from '@/api'
import { useConfirm } from '@/components/common/confirm/useConfirm'
import LocaleToggle from '@/components/common/locale-toggle'
import ThemeToggle from '@/components/layout/theme-toggle'
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

  const confirm = useConfirm()

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (userId) {
      const ok = await confirm({
        title: t('individual.logout.confirm.title'),
        description: t('individual.logout.confirm.description'),
        confirmText: t('individual.logout.confirm.confirmText'),
        danger: true,
        x: e.clientX,
        y: e.clientY,
      })

      if (!ok) return

      await LogoutAPI()

      Toast.show({
        msg: '退出成功',
        type: 'success',
      })
      const removeUserId = useUserStore.getState().removeUserId
      removeUserId()
    } else {
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
      <ThemeToggle />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, sunt
        minus, facere eveniet perspiciatis, ut odio nobis corporis molestias
        placeat doloribus praesentium repudiandae distinctio? Laboriosam
        asperiores dolorem facilis perspiciatis culpa.
      </p>
    </>
  )
}
