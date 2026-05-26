export type ConfirmOptions = {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  x: number
  y: number
}

export type ConfirmState = ConfirmOptions & {
  visible: boolean
}

export type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}
