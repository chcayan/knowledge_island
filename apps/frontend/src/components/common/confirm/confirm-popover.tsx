'use client'

import { useEffect, useRef, useState } from 'react'

import styles from './confirm.module.scss'
import { ConfirmState } from './types'
import { useTranslations } from 'next-intl'

export default function ConfirmPopover({
  state,
  close,
}: {
  state: ConfirmState
  close: (value: boolean) => void
}) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('Global.confirm')

  const [position, setPosition] = useState({
    left: state.x,
    top: state.y,
  })

  useEffect(() => {
    if (!state.visible) return

    const updatePosition = () => {
      const el = popoverRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()

      const gap = 12

      let left = state.x
      let top = state.y + gap

      // 右边界
      if (left + rect.width > window.innerWidth - gap) {
        left = window.innerWidth - rect.width - gap
      }

      // 下边界
      if (top + rect.height > window.innerHeight - gap) {
        top = state.y - rect.height - gap
      }

      // 上边界
      if (top < gap) {
        top = gap
      }

      // 左边界
      if (left < gap) {
        left = gap
      }

      setPosition({
        left,
        top,
      })
    }

    requestAnimationFrame(updatePosition)
  }, [state])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        close(false)
      }
    }

    const handleResize = () => {
      close(false)
    }

    if (state.visible) {
      document.addEventListener('mousedown', handleClick)
      window.addEventListener('resize', handleResize)
    }

    return () => {
      document.removeEventListener('mousedown', handleClick)
      window.removeEventListener('resize', handleResize)
    }
  }, [state.visible, close])

  if (!state.visible) return null

  return (
    <div
      ref={popoverRef}
      className={styles.popover}
      style={{
        left: position.left,
        top: position.top,
      }}
    >
      <div className={styles.content}>
        <div className={styles.title}>{state.title ?? t('title')}</div>

        {state.description && (
          <div className={styles.description}>{state.description}</div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.cancelBtn} tab-focus`}
          onClick={() => close(false)}
        >
          {state.cancelText}
        </button>

        <button
          className={`${styles.confirmBtn} ${
            state.danger ? styles.danger : ''
          } tab-focus`}
          onClick={() => close(true)}
        >
          {state.confirmText}
        </button>
      </div>
    </div>
  )
}
