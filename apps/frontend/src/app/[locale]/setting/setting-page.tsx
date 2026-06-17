/* eslint-disable @next/next/no-img-element */
'use client'

import { LogoutAPI } from '@/api'
import { useConfirm } from '@/components/common/confirm/useConfirm'
import LocaleToggle from '@/components/common/locale-toggle/locale-toggle'
import ThemeToggle from '@/components/layout/theme-toggle'
import { RoutePath } from '@/config/path'
import { useUserStore } from '@/stores'
import { locale } from '@/types/locale'
import { Toast } from '@/utils/toast'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import styles from './setting.module.scss'
import {
  USER_NAME_MAX_LENGTH,
  USER_SIGNATURE_MAX_LENGTH,
} from '@knowledge_island/schemas'
import { CustomError, getImgUrl } from '@/utils'
import { ChangeEvent, useRef } from 'react'
import { GIF_SIZE_LIMIT } from '@/config/post-field'

export default function SettingPage() {
  const t = useTranslations('Setting')
  const params = useParams()
  const locale = params.locale as locale
  const userInfo = useUserStore((state) => state.userInfo)
  const router = useRouter()

  const confirm = useConfirm()

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (userInfo.id) {
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
      const remove = useUserStore.getState().remove
      remove()
    } else {
      router.push(`${RoutePath.login}?redirect=${RoutePath.setting}`)
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      try {
        // const res = await uploadImageAPI(file)
      } catch (err) {
        if (err instanceof CustomError) {
          if (err.type === 'GIF_SIZE_LIMIT') {
            Toast.show({
              msg: t(`error.${err.type}`, { size: GIF_SIZE_LIMIT }),
              type: 'error',
            })
            return
          }
        }
        Toast.show({
          msg: t('error.MODIFY_AVATAR_FAILED'),
          type: 'error',
        })
      } finally {
        event.target.value = ''
      }
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{t('title')}</h1>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>{t('subModule.general.title')}</div>
          <div className={styles.cardContainer}>
            <div className={styles.cardContent}>
              <p>{t('subModule.general.subItem.language.title')}</p>
              <LocaleToggle locale={locale} />
            </div>
            <div className={styles.cardContent}>
              <p>{t('subModule.general.subItem.theme.title')}</p>
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>
            {t('subModule.individual.title')}
          </div>
          <div className={styles.cardContainer}>
            {userInfo.id && (
              <div className={styles.cardContent}>
                <p>{t('subModule.individual.subItem.nickname.title')}</p>
                <input
                  style={{
                    width: '50%',
                    minWidth: '200px',
                    textAlign: 'end',
                    paddingRight: '10px',
                  }}
                  type="text"
                  placeholder={userInfo.name}
                  minLength={1}
                  maxLength={USER_NAME_MAX_LENGTH}
                />
              </div>
            )}
            {userInfo.id && (
              <div className={`${styles.cardContent} ${styles.signature}`}>
                <p>{t('subModule.individual.subItem.signature.title')}</p>
                <textarea
                  className={styles.textarea}
                  placeholder={userInfo.signature}
                  minLength={1}
                  maxLength={USER_SIGNATURE_MAX_LENGTH}
                />
              </div>
            )}
            {userInfo.id && (
              <div className={`${styles.cardContent} ${styles.avatar}`}>
                <p>{t('subModule.individual.subItem.avatar.title')}</p>
                <img
                  src={getImgUrl(userInfo.avatar)}
                  alt="user-avatar-modify"
                  onClick={() => fileInputRef.current?.click()}
                />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
              </div>
            )}
            <div className={styles.cardContent}>
              <p>{t('subModule.individual.subItem.status.title')}</p>
              <button className={styles.logoutBtn} onClick={handleLogin}>
                {userInfo.id
                  ? t('subModule.individual.subItem.status.options.logout')
                  : t('subModule.individual.subItem.status.options.login')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
