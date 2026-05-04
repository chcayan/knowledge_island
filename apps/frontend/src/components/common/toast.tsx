'use client'

import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import styles from './toast.module.scss'

export type ColorType = 'normal' | 'success' | 'error'

export type ToastParams = {
  msg: string
  type: ColorType
  duration?: number
}

function isInt(time: number) {
  if (Number.isNaN(time) || time === Infinity || typeof time !== 'number') {
    console.error('请输入一个正确的数字')
    return false
  }
  if (parseInt((time / 1000) as unknown as string) !== time / 1000) {
    console.error('请输入1000倍数的正整数')
    return false
  }
  return true
}

const Toast = forwardRef((_, ref) => {
  const toastRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | null>(null)

  const [msg, setMsg] = useState('')
  const [type, setType] = useState<ColorType>('normal')

  function show(options: ToastParams) {
    const { msg, type, duration = 3000 } = options
    if (duration && !isInt(duration)) return

    setMsg(msg)
    setType(type)

    toastRef.current?.animate(
      [{ transform: `translateY(0) translateX(-50%)` }],
      { duration: 700, easing: 'ease', fill: 'forwards' }
    )

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = window.setTimeout(hide, duration)
  }

  function hide() {
    // setMsg('拜拜')
    toastRef.current?.animate(
      [{ transform: 'translateY(-100px) translateX(-50%)' }],
      { duration: 700, easing: 'ease', fill: 'forwards' }
    )
  }

  useImperativeHandle(ref, () => ({ show, hide }))

  return (
    <>
      <div className={`${styles.toast} ${styles[type]}`} ref={toastRef}>
        <p className={styles.p}>{msg}</p>
      </div>
    </>
  )
})

Toast.displayName = 'Toast'

export default Toast
