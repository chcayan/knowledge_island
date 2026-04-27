import { DecoratorNode } from 'lexical'
import Image from 'next/image'
import { JSX } from 'react'

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string

  static getType() {
    return 'image'
  }

  static clone(node: ImageNode) {
    return new ImageNode(node.__src, node.__key)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static importJSON(serializedNode: any) {
    return new ImageNode(serializedNode.src)
  }

  constructor(src: string = '', key?: string) {
    super(key)
    this.__src = src
  }

  exportJSON() {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
    }
  }

  createDOM() {
    return document.createElement('span')
  }

  updateDOM() {
    return false
  }

  decorate() {
    return (
      <div
        style={{
          position: 'relative',
          width: '90%',
          height: '300px',
        }}
      >
        <Image
          src={this.__src}
          alt="image"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
    )
  }
}
