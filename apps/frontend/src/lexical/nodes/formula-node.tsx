import { DecoratorNode } from 'lexical'
import { JSX } from 'react'
import FormulaComponent from '../components/formula-component'
import { SerializedFormulaNode } from '../types/serialized-node'

export class FormulaNode extends DecoratorNode<JSX.Element> {
  __latex: string

  static getType() {
    return 'formula'
  }

  static clone(node: FormulaNode) {
    return new FormulaNode(node.__latex, node.__key)
  }

  static importJSON(serializedNode: SerializedFormulaNode) {
    return new FormulaNode(serializedNode.latex)
  }

  constructor(latex: string = '', key?: string) {
    super(key)
    this.__latex = latex
  }

  exportJSON() {
    return {
      type: 'formula',
      version: 1,
      latex: this.__latex,
    }
  }

  createDOM() {
    return document.createElement('span')
  }

  updateDOM() {
    return false
  }

  setLatex(latex: string) {
    const writable = this.getWritable()
    writable.__latex = latex
  }

  decorate() {
    return <FormulaComponent latex={this.__latex} nodeKey={this.getKey()} />
  }
}
