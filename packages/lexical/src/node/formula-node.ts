import { DecoratorNode } from 'lexical'
import { SerializedFormulaNode } from '../types/serialized-node'

export class FormulaNode extends DecoratorNode<unknown> {
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
    const dom = document.createElement('span')
    dom.setAttribute('data-formula', this.__latex)
    return dom
  }

  updateDOM() {
    return false
  }
}
