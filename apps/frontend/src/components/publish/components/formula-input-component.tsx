import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useState } from 'react'
import { $getNodeByKey } from 'lexical'
import { FormulaNode } from '../nodes/formula-node'

export default function FormulaInputComponent({
  nodeKey,
}: {
  nodeKey: string
}) {
  const [editor] = useLexicalComposerContext()
  const [value, setValue] = useState('')

  function confirm() {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if (!node) return

      if (!value.trim()) {
        node.remove()
        return
      }

      const formulaNode = new FormulaNode(value)
      node.replace(formulaNode)
    })
  }

  return (
    <input
      autoFocus
      placeholder="输入 LaTeX..."
      value={value}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          e.stopPropagation()
          confirm()
        }

        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()

          editor.update(() => {
            const node = $getNodeByKey(nodeKey)
            node?.remove()
          })
        }
      }}
      onBlur={confirm}
      style={{
        width: '200px',
        height: '25px',
        padding: '5px',
        fontSize: '15px',
        borderRadius: '5px',
        backgroundColor: 'var(--theme-third-color)',
      }}
    />
  )
}
