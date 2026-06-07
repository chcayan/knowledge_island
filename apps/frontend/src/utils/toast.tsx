'use client'

import T, { ToastParams } from '@/components/common/toast/toast'
import { createRef, type RefObject } from 'react'
import { createRoot } from 'react-dom/client'

interface ToastRef {
  show: (options: ToastParams) => void
}

let toastRef: RefObject<ToastRef | null>
let initialized = false

let initPromise: Promise<void> | null = null
let resolveInit: (() => void) | null = null

function createToast() {
  if (typeof document === 'undefined') {
    return Promise.resolve()
  }

  if (initialized) {
    return initPromise!
  }

  initialized = true

  initPromise = new Promise<void>((resolve) => {
    resolveInit = resolve
  })

  const container = document.createElement('div')
  document.body.appendChild(container)

  toastRef = createRef()

  const root = createRoot(container)

  root.render(
    <T
      ref={(instance: ToastRef) => {
        toastRef.current = instance

        if (instance) {
          resolveInit?.()
          resolveInit = null
        }
      }}
    />
  )
}

export const Toast = {
  async init() {
    await createToast()
    console.log('init toast success')
  },
  async show(options: ToastParams) {
    await createToast()
    toastRef?.current?.show(options)
  },
}
