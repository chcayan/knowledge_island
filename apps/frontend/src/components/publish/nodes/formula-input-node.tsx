import { DecoratorNode } from 'lexical'
import { JSX } from 'react'
import FormulaInputComponent from '../components/formula-input-component'
import { SerializedFormulaNode } from '../types/serialized-node'

export class FormulaInputNode extends DecoratorNode<JSX.Element> {
  static getType() {
    return 'formula-input'
  }

  static clone(node: FormulaInputNode) {
    return new FormulaInputNode(node.__key)
  }

  static importJSON(serializedNode: SerializedFormulaNode) {
    return new FormulaInputNode(serializedNode.latex)
  }

  constructor(key?: string) {
    super(key)
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

  decorate() {
    return <FormulaInputComponent nodeKey={this.getKey()} />
  }
}
