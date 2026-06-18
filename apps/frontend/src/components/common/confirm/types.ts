export type ConfirmOptions = {
  // title?: string
  // description?: string
  // confirmText?: string
  // cancelText?: string
  // danger?: boolean
  // x: number
  // y: number
  anchor?: HTMLElement | null
  x?: number
  y?: number
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

export type ConfirmState = ConfirmOptions & {
  visible: boolean
}

export type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}
