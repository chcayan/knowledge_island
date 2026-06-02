'use client'

import { getDraftAPI } from '@/api'
import { POST_EDITOR_CONTENT } from '@/config/local-storage'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'

export default function RestorePlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    function restore(content: string) {
      try {
        const parsed = editor.parseEditorState(content)

        if (parsed._nodeMap.size <= 2) return false

        queueMicrotask(() => {
          editor.setEditorState(parsed)
        })

        return true
      } catch (e) {
        console.error('restore failed', e)
        return false
      }
    }

    async function recoverDraft() {
      const { draft } = await getDraftAPI()
      if (draft) {
        restore(draft.content)
      }
    }

    const editorStateJSON = localStorage.getItem(POST_EDITOR_CONTENT)
    if (!editorStateJSON) {
      console.log('cloud restore success')
      recoverDraft()
      return
    }

    const restored = restore(JSON.parse(editorStateJSON))
    console.log('local restore success')

    if (!restored) {
      recoverDraft()
      console.log('local content is empty, try to get data from cloud')
    }
  }, [editor])

  return null
}
