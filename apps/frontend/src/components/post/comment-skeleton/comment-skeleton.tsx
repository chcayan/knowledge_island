import styles from './comment-skeleton.module.scss'

export default function CommentSkeleton() {
  return (
    <div className={styles['comment-item']}>
      <div className={styles['comment-main']}>
        <div className={styles['avatar']}></div>

        <div className={styles['content']}>
          <div className={styles['header']}>
            <div className={styles['nickname']}></div>

            <div className={styles['time']}></div>
          </div>

          <div className={styles.html}></div>

          <div className={styles['reply-action']}>
            <div className={styles.icon}></div>
            <div className={styles['like-count']}></div>
            <div className={styles.icon}></div>
            <div className={styles.reply}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
