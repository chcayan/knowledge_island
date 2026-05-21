'use client'

import { ReactNode, useState } from 'react'
import styles from './toggle-button.module.scss'
import clsx from 'clsx'
import { Toast } from '@/utils/toast'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('Global.toast')
  const [innerValue, setInnerValue] = useState<T | undefined>(defaultValue)

  const current = value ?? innerValue
  const activeIndex = options.findIndex((o) => o.value === current)

  function handleChange(val: T) {
    if (value === undefined) {
      setInnerValue(val)
    }
    onChange?.(val)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'Enter' && e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') {
      return
    }

    if (e.repeat) {
      Toast.show({
        msg: `${t('longPressTip')} (┬┬﹏┬┬)`,
        type: 'error',
      })
      return
    }

    e.preventDefault()

    if (e.shiftKey || e.key === 'ArrowLeft') {
      const prevIndex = activeIndex <= 0 ? options.length - 1 : activeIndex - 1

      handleChange(options[prevIndex].value)

      return
    }

    const nextIndex = activeIndex >= options.length - 1 ? 0 : activeIndex + 1

    handleChange(options[nextIndex].value)
  }

  return (
    <>
      <div className={styles['toggle-button']}>
        <div className={styles['shape-left']}></div>
        <div className={styles.wrapper}>
          {/* 滑块 */}
          <div
            className={`${styles.slider} tab-focus`}
            style={{
              width: `${100 / options.length}%`,
              transform: `translateX(${activeIndex * 100}%)`,
            }}
            tabIndex={0}
            onKeyDown={handleKeyDown}
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
                tabIndex={-1}
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
