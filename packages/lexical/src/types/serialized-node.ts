export type SerializedImageNode = {
  type: 'image'
  version: 1
  src: string
  altText: string
  width: number
}

export type SerializedFormulaNode = {
  type: 'formula'
  version: 1
  latex: string
}
