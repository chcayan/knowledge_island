/* eslint-disable @next/next/no-img-element */
'use client'

import NotificationIcon from '@/components/icon/notification-icon'
import styles from './user-control.module.scss'
import { useUserStore } from '@/stores'
import { getImgUrl } from '@/utils'
import LoginIcon from '@/components/icon/login-icon'
import { useRouter } from 'next/navigation'
import { RouterPath } from '@/config/path'

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
      <button className={styles.avatar}>
        {userInfo.id ? (
          <img
            src={getImgUrl(userInfo.avatar)}
            alt={'user-avatar'}
            onClick={() => router.push(RouterPath.my)}
          />
        ) : (
          <div
            className={styles.login}
            onClick={() => router.push(RouterPath.login)}
          >
            <LoginIcon />
          </div>
        )}
      </button>
    </div>
  )
}
