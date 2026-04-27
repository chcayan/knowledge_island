import { createCommand } from 'lexical'

export const INSERT_IMAGE_COMMAND = createCommand<{
  file: File
  src: string
}>()
