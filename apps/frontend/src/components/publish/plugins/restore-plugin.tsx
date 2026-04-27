'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'

export default function RestorePlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const editorStateJSON = localStorage.getItem('editor-state')
    if (!editorStateJSON) return

    try {
      const parsed = editor.parseEditorState(JSON.parse(editorStateJSON))
      queueMicrotask(() => {
        editor.setEditorState(parsed)
      })
      console.log('restore success')
    } catch (e) {
      console.error('恢复失败', e)
    }
  }, [editor])

  return null
}
