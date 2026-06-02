/* eslint-disable @next/next/no-img-element */
'use client'

import NotificationIcon from '@/components/icon/notification-icon'
import styles from './user-control.module.scss'
import { useUserStore } from '@/stores'
import { getImgUrl } from '@/utils'
import LoginIcon from '@/components/icon/login-icon'
import { useRouter } from 'next/navigation'
import { RoutePath } from '@/config/path'

export default function UserControl() {
  const userInfo = useUserStore((state) => state.userInfo)
  const router = useRouter()

  return (
    <div className={styles['user-control']}>
      <button
        style={{
          width: '32px',
          height: '32px',
        }}
        tabIndex={0}
        className="notification tab-focus"
      >
        <NotificationIcon />
      </button>
      <button tabIndex={0} className={`${styles.avatar} tab-focus`}>
        {userInfo.id ? (
          <img
            src={getImgUrl(userInfo.avatar)}
            alt={'user-avatar'}
            onClick={() => router.push(RoutePath.my)}
          />
        ) : (
          <div
            className={styles.login}
            onClick={() => router.push(RoutePath.login)}
          >
            <LoginIcon />
          </div>
        )}
      </button>
    </div>
  )
}
