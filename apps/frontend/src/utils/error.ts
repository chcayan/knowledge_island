type Options = {
  type: 'DEFAULT' | 'IMG_SIZE_LIMIT'
}

export class CustomError extends Error {
  type: Options['type']
  constructor(
    message: string,
    options: Options = {
      type: 'DEFAULT',
    }
  ) {
    super(message)
    this.name = 'CustomError'
    this.type = options.type
  }
}
