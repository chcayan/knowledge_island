import Link from 'next/link'
import clsx from 'clsx'
import styles from './toggle-button.module.scss'

type Option<T extends string> = {
  label: React.ReactNode
  value: T
}

type Props<T extends string> = {
  options: Option<T>[]
  value: T
}

export default function ToggleButton<T extends string>({
  options,
  value,
}: Props<T>) {
  const activeIndex = options.findIndex((o) => o.value === value)

  return (
    <div className={styles['toggle-button']}>
      <div className={styles['shape-left']} />

      <div className={styles.wrapper}>
        <div
          className={styles.slider}
          style={{
            width: `${100 / options.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />

        <div
          className={styles.items}
          style={{
            gridTemplateColumns: `repeat(${options.length},1fr)`,
          }}
        >
          {options.map((option) => (
            <Link
              replace
              key={option.value}
              href={`?filter=${option.value}`}
              className={clsx(
                styles.item,
                value === option.value && styles.active
              )}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      <div className={styles['shape-right']} />
    </div>
  )
}
