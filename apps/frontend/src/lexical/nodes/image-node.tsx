import { DecoratorNode, LexicalEditor, LexicalNode } from 'lexical'
import { JSX } from 'react'
import ImageComponent from '../components/image-component'
import { SerializedImageNode } from '../types/serialized-node'

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string
  __altText: string
  __width: number
  __aspectRatio: number

  static getType() {
    return 'image'
  }

  static clone(node: ImageNode) {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__aspectRatio,
      node.__key
    )
  }

  static importJSON(serializedNode: SerializedImageNode) {
    return new ImageNode(
      serializedNode.src,
      serializedNode.altText,
      serializedNode.width,
      serializedNode.aspectRatio
    )
  }

  constructor(
    src: string = '',
    altText: string = 'image',
    width: number = 50,
    aspectRatio: number = 16 / 9,
    key?: string
  ) {
    super(key)
    this.__src = src
    this.__altText = altText
    this.__width = width
    this.__aspectRatio = aspectRatio
  }

  exportJSON() {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      aspectRatio: this.__aspectRatio,
    }
  }

  createDOM() {
    const dom = document.createElement('span')
    dom.style.display = 'inline-block'
    dom.style.width = `${this.__width}%`
    return dom
  }

  updateDOM() {
    return false
  }

  setWidth(width: number) {
    const writable = this.getWritable()
    writable.__width = width
  }

  getWidth() {
    return this.__width
  }

  decorate(editor: LexicalEditor) {
    return (
      <ImageComponent
        src={this.__src}
        alt={this.__altText}
        width={this.__width}
        nodeKey={this.getKey()}
        editor={editor}
      />
    )
  }
}

export function $createImageNode(
  src: string,
  altText: string,
  width: number = 50,
  aspectRatio: number = 16 / 9
) {
  return new ImageNode(src, altText, width, aspectRatio)
}

export function $isImageNode(node: LexicalNode) {
  return node instanceof ImageNode
}
