import { DecoratorNode } from 'lexical'
import { JSX } from 'react'
import FormulaInputComponent from '../components/formula-input-component'
import { SerializedFormulaNode } from '../types/serialized-node'

export class FormulaInputNode extends DecoratorNode<JSX.Element> {
  __latex: string

  static getType() {
    return 'formula-input'
  }

  static clone(node: FormulaInputNode) {
    return new FormulaInputNode(node.__latex, node.__key)
  }

  static importJSON(serializedNode: SerializedFormulaNode) {
    return new FormulaInputNode(serializedNode.latex)
  }

  constructor(latex: string = '', key?: string) {
    super(key)
    this.__latex = latex
  }

  exportJSON() {
    return {
      type: 'formula-input',
      version: 1,
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
    return (
      <FormulaInputComponent
        nodeKey={this.getKey()}
        initialLatex={this.__latex}
      />
    )
  }
}
