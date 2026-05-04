'use client'

import { ReactNode, useState } from 'react'
import styles from './toggle-button.module.scss'
import clsx from 'clsx'

type Option<T extends string> = {
  label: ReactNode
  value: T
}

type Props<T extends string> = {
  options: Option<T>[]
  value?: T
  defaultValue?: T
  onChange?: (val: T) => void
}

export default function ToggleButton<T extends string>({
  options,
  value,
  defaultValue,
  onChange,
}: Props<T>) {
  const [innerValue, setInnerValue] = useState<T | undefined>(defaultValue)

  const current = value ?? innerValue
  const activeIndex = options.findIndex((o) => o.value === current)

  function handleChange(val: T) {
    if (value === undefined) {
      setInnerValue(val)
    }
    onChange?.(val)
  }

  return (
    <>
      <div className={styles['toggle-button']}>
        <div className={styles['shape-left']}></div>
        <div className={styles.wrapper}>
          {/* 滑块 */}
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
              gridTemplateColumns: `repeat(${options.length}, 1fr)`,
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleChange(option.value)}
                className={clsx(
                  styles.item,
                  current === option.value && styles.active
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles['shape-right']}></div>
      </div>
    </>
  )
}
