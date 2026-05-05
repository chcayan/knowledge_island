import { DecoratorNode } from 'lexical'

export class ImageNode extends DecoratorNode<unknown> {
  __src: string
  __altText: string

  static getType() {
    return 'image'
  }

  static clone(node: ImageNode) {
    return new ImageNode(node.__src, node.__altText, node.__key)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static importJSON(serializedNode: any) {
    return new ImageNode(serializedNode.src)
  }

  constructor(src: string = '', altText: string = 'image', key?: string) {
    super(key)
    this.__src = src
    this.__altText = altText
  }

  exportJSON() {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
    }
  }

  createDOM() {
    const dom = document.createElement('span')
    return dom
  }

  updateDOM() {
    return false
  }
}
