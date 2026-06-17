/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef, useState } from 'react'

import styles from './select.module.scss'

export interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  value: any
  options: SelectOption[]
  onChange: (value: any) => void
  placeholder?: string
}

export default function Select({
  value,
  options,
  onChange,
  placeholder,
}: SelectProps) {
  const [open, setOpen] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)

    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [])

  const selected = options.find((item) => item.value === value)

  return (
    <div className={styles.select} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{selected?.label ?? placeholder}</span>

        <span className={`${styles.arrow} ${open ? styles.open : ''}`}>▼</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          {options.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`${styles.option} ${
                value === item.value ? styles.active : ''
              }`}
              onClick={() => {
                onChange(item.value)
                setOpen(false)
              }}
            >
              <span>{item.label}</span>

              {value === item.value && <span>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
