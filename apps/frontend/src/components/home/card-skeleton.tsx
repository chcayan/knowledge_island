import styles from './card-skeleton.module.scss'

export default function CardSkeleton() {
  return (
    <div className={styles['card-skeleton']}>
      <header>
        <div className={styles.avatar} />
        <div className={styles.info}>
          <div className={styles.name} />
          <div className={styles.date} />
        </div>
      </header>
      <div className={styles.main}>
        <div className={styles.title} />
        <div className={styles.content}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div className={styles.line} key={index} />
          ))}
          <div className={`${styles.line} ${styles.short}`} />
        </div>
        <div className={styles.content}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div className={styles.line} key={index} />
          ))}
          <div className={`${styles.line} ${styles.short1}`} />
        </div>
      </div>
      <div className={styles.divider}></div>
      <footer>
        <div className={styles.left}>
          <div className={styles['icon-text']} />
          <div className={styles['icon-text']} />
        </div>
        <div className={styles.right}>
          <div className={styles.icon} />
        </div>
      </footer>
    </div>
  )
}
