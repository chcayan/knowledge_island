import { DecoratorNode } from 'lexical'
import { SerializedImageNode } from '../types/serialized-node'

export class ImageNode extends DecoratorNode<unknown> {
  __src: string
  __altText: string
  __width: number

  static getType() {
    return 'image'
  }

  static clone(node: ImageNode) {
    return new ImageNode(node.__src, node.__altText, node.__width, node.__key)
  }

  static importJSON(serializedNode: SerializedImageNode) {
    return new ImageNode(
      serializedNode.src,
      serializedNode.altText,
      serializedNode.width
    )
  }

  constructor(
    src: string = '',
    altText: string = 'image',
    width: number = 50,
    key?: string
  ) {
    super(key)
    this.__src = src
    this.__altText = altText
    this.__width = width
  }

  exportJSON() {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
    }
  }

  createDOM() {
    const dom = document.createElement('span')
    dom.setAttribute('data-image', this.__src)
    dom.setAttribute('data-alt', this.__altText)
    dom.setAttribute('data-width', String(this.__width))
    return dom
  }

  updateDOM() {
    return false
  }
}
