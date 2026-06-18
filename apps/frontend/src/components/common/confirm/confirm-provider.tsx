'use client'

import {
  createContext,
  useCallback,
  useRef,
  useState,
  ReactNode,
  useEffect,
} from 'react'

import { createPortal } from 'react-dom'
import ConfirmPopover from './confirm-popover'
import { ConfirmContextType, ConfirmOptions, ConfirmState } from './types'
import { useTranslations } from 'next-intl'

export const ConfirmContext = createContext<ConfirmContextType | null>(null)

export default function ConfirmProvider({ children }: { children: ReactNode }) {
  const t = useTranslations('Global.confirm')

  const [state, setState] = useState<ConfirmState>({
    visible: false,
    x: 0,
    y: 0,
  })

  const resolverRef = useRef<(value: boolean) => void>(null)

  const close = useCallback((result: boolean) => {
    resolverRef.current?.(result)

    setState((prev) => ({
      ...prev,
      visible: false,
    }))
  }, [])

  const confirm = useCallback(
    (options: ConfirmOptions) => {
      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve

        setState({
          visible: true,
          title: options.title,
          description: options.description,
          confirmText: options.confirmText ?? t('confirmText'),
          cancelText: options.cancelText ?? t('cancelText'),
          danger: options.danger,
          x: options.x,
          y: options.y,
          anchor: options.anchor,
        })
      })
    },
    [t]
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [close])

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {typeof document !== 'undefined' &&
        createPortal(
          <ConfirmPopover state={state} close={close} />,
          document.body
        )}
    </ConfirmContext.Provider>
  )
}
