import { createCommand } from 'lexical'

export const INSERT_IMAGE_COMMAND = createCommand<{
  src: string
  altText: string
  aspectRatio: number
}>('INSERT_IMAGE_COMMAND')
