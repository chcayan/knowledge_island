import CardSkeleton from '../card-skeleton/card-skeleton'
import styles from './card-list-skeleton.module.scss'

export default function CardListSkeleton() {
  return (
    <>
      <div className={styles['card-list-skeleton']}>
        {Array.from({ length: 5 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </>
  )
}
