import { createCommand } from 'lexical'

export const INSERT_IMAGE_COMMAND = createCommand<{
  src: string
  altText: string
}>('INSERT_IMAGE_COMMAND')

export const INSERT_FORMULA_COMMAND = createCommand<string>(
  'INSERT_FORMULA_COMMAND'
)
