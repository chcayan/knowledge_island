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

  // const selectedIndex = options.findIndex((item) => item.value === value)
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null)

  const getCurrentIndex = () => {
    const index = options.findIndex((item) => item.value === value)

    return index >= 0 ? index : 0
  }

  const openDropdown = () => {
    setHighlightIndex(getCurrentIndex())
    setOpen(true)
  }

  const closeDropdown = () => {
    setOpen(false)
    setHighlightIndex(null)
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeDropdown()
      }
    }

    document.addEventListener('mousedown', handler)

    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()

        if (!open) {
          openDropdown()
          return
        }

        setHighlightIndex((prev) => {
          if (prev == null) return 0

          return Math.min(prev + 1, options.length - 1)
        })

        break

      case 'ArrowUp':
        e.preventDefault()

        if (!open) {
          openDropdown()
          return
        }

        setHighlightIndex((prev) => {
          if (prev == null) return 0

          return Math.max(prev - 1, 0)
        })

        break

      case 'Enter':
      case ' ':
        e.preventDefault()

        if (!open) {
          openDropdown()
          return
        }

        if (highlightIndex != null && options[highlightIndex]) {
          onChange(options[highlightIndex].value)
          closeDropdown()
        }

        break

      case 'Escape':
        e.preventDefault()
        closeDropdown()
        break
    }
  }

  return (
    <div
      className={styles.select}
      ref={ref}
      onBlur={(e) => {
        const nextFocus = e.relatedTarget as Node | null

        if (nextFocus && ref.current?.contains(nextFocus)) {
          return
        }

        closeDropdown()
      }}
    >
      <button
        tabIndex={0}
        type="button"
        className={`${styles.trigger} tab-focus`}
        onClick={() => {
          if (open) {
            closeDropdown()
          } else {
            openDropdown()
          }
        }}
        // onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
      >
        <span>{selected?.label ?? placeholder}</span>

        <span className={`${styles.arrow} ${open ? styles.open : ''}`}>▼</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          {options.map((item, index) => (
            <button
              tabIndex={-1}
              key={item.value}
              type="button"
              className={`${styles.option} ${
                value === item.value ? styles.active : ''
              } ${highlightIndex === index ? styles.highlight : ''}`}
              onClick={() => {
                onChange(item.value)
                setOpen(false)
              }}
              onMouseEnter={() => setHighlightIndex(index)}
            >
              <span>{item.label}</span>

              {/* {value === item.value && <span>✓</span>} */}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
