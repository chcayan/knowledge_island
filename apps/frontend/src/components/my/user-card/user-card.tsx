/* eslint-disable @next/next/no-img-element */
import { getMeInfoAPI } from '@/api'
import styles from './user-card.module.scss'
import { getImgUrl } from '@/utils'

export default async function UserCard() {
  const userInfo = await getMeInfoAPI()

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
        <div className={styles['user-info']}>
          <div className={styles.info}>
            <p className={styles.name}>{userInfo.name}</p>
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
      </div>
    </>
  )
}
