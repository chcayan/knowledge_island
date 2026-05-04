import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useState, useRef, useEffect } from 'react'
import { $getNodeByKey } from 'lexical'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { FormulaNode } from '../nodes/formula-node'

export default function FormulaComponent({
  latex,
  nodeKey,
}: {
  latex: string
  nodeKey: string
}) {
  const [editor] = useLexicalComposerContext()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(latex)

  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return

    try {
      katex.render(latex, ref.current, {
        throwOnError: false,
      })
    } catch {
      ref.current.textContent = latex
    }
  }, [latex, editing])

  function save() {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if (!node) return

      if (!value.trim()) {
        node.remove()
        return
      }

      ;(node as FormulaNode).setLatex(value)
    })

    setEditing(false)
  }

  if (editing) {
    return (
      <input
        value={value}
        autoFocus
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save()
        }}
        placeholder="输入 LaTeX..."
        style={{
          width: '100%',
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
    <span
      ref={ref}
      onClick={() => setEditing(true)}
      style={{ cursor: 'pointer' }}
    />
  )
}
