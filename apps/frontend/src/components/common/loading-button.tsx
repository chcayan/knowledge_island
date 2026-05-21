/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './loading-button.module.scss'
import { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'

export default function LoadingButton({
  text,
  icon,
  loading,
  disabled,
  onClick,
  style,
  type,
}: {
  text: string
  icon?: ReactNode
  loading: boolean
  disabled: boolean
  onClick?: (...arg: any[]) => void
  style?: CSSProperties
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
}) {
  return (
    <button
      className={`${styles.btn} tab-focus`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      type={type}
    >
      {loading ? <span className={styles.loading} /> : icon}
      <span>{text}</span>
    </button>
  )
}
