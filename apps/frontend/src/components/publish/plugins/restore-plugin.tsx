'use client'

import { POST_EDITOR_CONTENT } from '@/config/local-storage'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'

export default function RestorePlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const editorStateJSON = localStorage.getItem(POST_EDITOR_CONTENT)
    if (!editorStateJSON) return

    try {
      const parsed = editor.parseEditorState(JSON.parse(editorStateJSON))
      const nodeCount = parsed._nodeMap.size

      if (nodeCount <= 2) return
      queueMicrotask(() => {
        editor.setEditorState(parsed)
      })
      console.log('restore success')
    } catch (e) {
      console.error('restore failed', e)
    }
  }, [editor])

  return null
}
