import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $insertNodes, COMMAND_PRIORITY_EDITOR } from 'lexical'
import { INSERT_FORMULA_COMMAND } from '../commands/command'
import { FormulaNode } from '../nodes/formula-node'

export default function FormulaPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      INSERT_FORMULA_COMMAND,
      (latex) => {
        editor.update(() => {
          const node = new FormulaNode(latex)
          $insertNodes([node])
        })
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
