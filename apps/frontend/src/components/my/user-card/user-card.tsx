/* eslint-disable @next/next/no-img-element */
'use client'

import styles from './user-card.module.scss'
import { useUserStore } from '@/stores'
import { getImgUrl } from '@/utils'

export default function UserCard() {
  const userInfo = useUserStore((state) => state.userInfo)

  return (
    <>
      <div className={styles['user-card']}>
        {userInfo.avatar && (
          <img
            src={getImgUrl(userInfo.avatar)}
            alt={'user-avatar'}
            className={styles.avatar}
          />
        )}
        <div className={styles.info}>
          <p className={styles.name}>{userInfo.name}</p>
          <p>-</p>
          <p className={styles.email}>{userInfo.email}</p>
        </div>
        <div className={styles.count}>
          <p>
            粉丝&nbsp;<span>{userInfo.fanCount}</span>
          </p>
          <p>
            关注&nbsp;<span>{userInfo.followCount}</span>
          </p>
        </div>
        <p className={styles.signature}>{userInfo.signature}</p>
      </div>
    </>
  )
}
