import T, { ToastParams } from '@/components/common/toast'
import { createRef, type RefObject } from 'react'
import { createRoot } from 'react-dom/client'

interface ToastRef {
  show: (options: ToastParams) => void
}

let toastRef: RefObject<ToastRef | null>

function createToast() {
  const container = document.createElement('div')
  document.body.appendChild(container)

  toastRef = createRef()

  const root = createRoot(container)

  root.render(<T ref={toastRef} />)
}

createToast()

export const Toast = {
  show(options: ToastParams) {
    toastRef.current?.show(options)
  },
}
