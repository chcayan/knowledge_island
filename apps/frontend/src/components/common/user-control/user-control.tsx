/* eslint-disable @next/next/no-img-element */
import NotificationIcon from '@/components/icon/notification-icon'
import styles from './user-control.module.scss'
import { getImgUrl } from '@/utils'
import LoginIcon from '@/components/icon/login-icon'
import { getMeInfoAPI } from '@/api'
import Link from 'next/link'
import { RoutePath } from '@/config/path'

export default async function UserControl() {
  const userInfo = await getMeInfoAPI().catch(() => {})

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
        {userInfo && userInfo.id ? (
          <Link href={RoutePath.my}>
            <img src={getImgUrl(userInfo.avatar)} alt={'user-avatar'} />
          </Link>
        ) : (
          <Link href={RoutePath.login}>
            <div className={styles.login}>
              <LoginIcon />
            </div>
          </Link>
        )}
      </button>
    </div>
  )
}
