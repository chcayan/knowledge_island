import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useState } from 'react'
import { $getNodeByKey } from 'lexical'
import { FormulaNode } from '../nodes/formula-node'
import { useTranslations } from 'next-intl'
import { FormulaInputNode } from '../nodes/formula-input-node'

export default function FormulaInputComponent({
  initialLatex,
  nodeKey,
}: {
  initialLatex: string
  nodeKey: string
}) {
  const t = useTranslations('Publish')

  const [editor] = useLexicalComposerContext()
  const [value, setValue] = useState(initialLatex || '')

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

      const parent = formulaNode.getParent()
      if (parent) editor.focus()
    })
  }

  return (
    <input
      autoFocus
      placeholder={t('input.latex')}
      value={value}
      onClick={(e) => {
        e.stopPropagation()
      }}
      onChange={(e) => {
        const newValue = e.target.value
        setValue(newValue)

        editor.update(
          () => {
            const node = $getNodeByKey(nodeKey)
            if (node) {
              ;(node as FormulaInputNode).setLatex(newValue)
            }
          },
          { tag: 'history-merge' }
        )
      }}
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
