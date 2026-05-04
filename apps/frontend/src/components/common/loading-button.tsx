import styles from './loading-button.module.scss'
import { CSSProperties, ReactNode } from 'react'

export default function LoadingButton({
  text,
  icon,
  loading,
  disabled,
  onClick,
  style,
}: {
  text: string
  icon: ReactNode
  loading: boolean
  disabled: boolean
  onClick: () => void
  style: CSSProperties
}) {
  return (
    <button
      className={styles.btn}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {loading ? <span className={styles.loading} /> : icon}
      <span>{text}</span>
    </button>
  )
}
