/* eslint-disable @next/next/no-img-element */
import NotificationIcon from '@/components/icon/notification-icon'
import styles from './user-control.module.scss'
import LoginIcon from '@/components/icon/login-icon'
import { getMeInfoAPI } from '@/api'
import Link from 'next/link'
import { RoutePath } from '@/config/path'

export default async function UserControl() {
  const userInfo = await getMeInfoAPI().catch(() => {})

  return (
    <div className={styles['user-control']}>
      <Link
        className={`${styles.notification} tab-focus`}
        href={RoutePath.notification}
      >
        <NotificationIcon />
      </Link>
      {userInfo && userInfo.id ? (
        <Link href={RoutePath.my} className={`${styles.avatar} tab-focus`}>
          <img src={userInfo.avatar} alt={'user-avatar'} />
        </Link>
      ) : (
        <Link href={RoutePath.login} className="tab-focus">
          <div className={styles.login}>
            <LoginIcon />
          </div>
        </Link>
      )}
    </div>
  )
}
