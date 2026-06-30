/* eslint-disable @next/next/no-img-element */
import { getMeInfoAPI, getUserInfoServerAPI } from '@/api'
import styles from './user-card.module.scss'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

export default async function UserCard({ userId }: { userId?: string }) {
  const t = await getTranslations('Global.text')

  let userInfo
  if (userId) {
    userInfo = await getUserInfoServerAPI(userId)
    if (!userInfo) {
      notFound()
    }
  } else {
    userInfo = await getMeInfoAPI()
  }

  return (
    <>
      <div className={styles['user-card']}>
        {userInfo.avatar && (
          <img
            src={userInfo.avatar}
            alt={'user-avatar'}
            className={styles.avatar}
          />
        )}
        <div className={styles['user-info']}>
          <div className={styles.info}>
            <p className={styles.name}>{userInfo.name}</p>
          </div>
          <div className={styles.count}>
            <p>
              {t('fans')}&nbsp;<span>{userInfo.fanCount}</span>
            </p>
            <p>
              {t('follows')}&nbsp;<span>{userInfo.followCount}</span>
            </p>
          </div>
          <p className={styles.signature}>{userInfo.signature}</p>
        </div>
      </div>
    </>
  )
}
