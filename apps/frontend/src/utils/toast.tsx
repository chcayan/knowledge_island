'use client'

import T, { ToastParams } from '@/components/common/toast'
import { createRef, type RefObject } from 'react'
import { createRoot } from 'react-dom/client'

interface ToastRef {
  show: (options: ToastParams) => void
}

let toastRef: RefObject<ToastRef | null>
let initialized = false

function createToast() {
  if (typeof document === 'undefined') return
  if (initialized) return

  initialized = true

  const container = document.createElement('div')
  document.body.appendChild(container)

  toastRef = createRef()

  const root = createRoot(container)

  root.render(<T ref={toastRef} />)
}

export const Toast = {
  init() {
    if (!toastRef) {
      createToast()
      return
    }
    if (toastRef) {
      console.error('已存在 toast 实例')
      console.group('Toast.init')
      console.trace()
      console.groupEnd()
    }
  },
  show(options: ToastParams) {
    toastRef?.current?.show(options)
  },
}
