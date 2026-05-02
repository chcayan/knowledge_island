import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'
import { $getSelection, $isRangeSelection } from 'lexical'
import { $findMatchingParent } from '@lexical/utils'
import { $isLinkNode } from '@lexical/link'

export default function AutoUpdateLinkPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      let needUpdate = false
      let newURL = ''

      editorState.read(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return

        const node = selection.anchor.getNode()
        const linkNode = $findMatchingParent(node, $isLinkNode)

        if (!linkNode) return

        const text = linkNode.getTextContent()

        if (linkNode.getURL() !== text) {
          needUpdate = true
          newURL = text
        }
      })

      if (needUpdate) {
        editor.update(() => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection)) return

          const node = selection.anchor.getNode()
          const linkNode = $findMatchingParent(node, $isLinkNode)

          if (linkNode) {
            linkNode.setURL(newURL)
          }
        })

        needUpdate = false
      }
    })
  }, [editor])

  return null
}
