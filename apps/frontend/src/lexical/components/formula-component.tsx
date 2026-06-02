import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useState, useRef, useEffect } from 'react'
import { $getNodeByKey } from 'lexical'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { FormulaNode } from '../nodes/formula-node'
import { useTranslations } from 'next-intl'

export default function FormulaComponent({
  latex,
  nodeKey,
}: {
  latex: string
  nodeKey: string
}) {
  const t = useTranslations('Publish')

  const [editor] = useLexicalComposerContext()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(latex)

  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current || editing) return

    try {
      katex.render(latex, ref.current, {
        throwOnError: false,
      })
    } catch {
      ref.current.textContent = latex
    }
  }, [latex, editing])

  function save() {
    if (!editing) return

    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if (!node) return

      if (!value.trim()) {
        node.remove()
        return
      }

      ;(node as FormulaNode).setLatex(value)

      const parent = node.getParent()
      if (parent) editor.focus()
    })

    setEditing(false)
  }

  if (editing) {
    return (
      <input
        value={value}
        autoFocus
        onClick={(e) => {
          e.stopPropagation()
        }}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            save()
          } else if (e.key === 'Escape') {
            e.preventDefault()
            setValue(latex)
            setEditing(false)
          }
        }}
        placeholder={t('input.latex')}
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

  return (
    <>
      <span
        ref={ref}
        onClick={() => setEditing(true)}
        style={{ cursor: 'pointer' }}
      />
    </>
  )
}
