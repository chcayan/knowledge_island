import { DecoratorNode } from 'lexical'
import Image from 'next/image'
import { JSX } from 'react'

export class ImageNode extends DecoratorNode<JSX.Element> {
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

  decorate() {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={this.__src}
        alt={this.__altText}
        style={{
          maxWidth: '50%',
          borderRadius: '4px',
          marginTop: '8px',
        }}
      />
    )
  }
}

export function $createImageNode(src: string, altText: string) {
  return new ImageNode(src, altText)
}

export function $isImageNode(node: ImageNode) {
  return node instanceof ImageNode
}
