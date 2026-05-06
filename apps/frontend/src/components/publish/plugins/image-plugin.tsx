'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'
import { INSERT_IMAGE_COMMAND } from '../commands/command'
import { $createImageNode, ImageNode } from '../nodes/image-node'
import {
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  PASTE_COMMAND,
} from 'lexical'
import { uploadImageAPI } from '@/api'
import { baseURL } from '@/utils'

export function ImagePlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor')
    }

    const removeInsertCommand = editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createImageNode(payload.src, payload.altText)
        $insertNodes([imageNode])
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )

    const removePasteCommand = editor.registerCommand(
      PASTE_COMMAND,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event: any) => {
        const clipboardData = event.clipboardData
        if (!clipboardData) return false

        const items = clipboardData.items

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            event.preventDefault()

            const file = items[i].getAsFile()
            if (file) {
              ;(async () => {
                const res = await uploadImageAPI(file)
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                  src: baseURL + res.data.data.url,
                  altText: 'Pasted Image',
                })
              })()
            }
            return true
          }
        }
        return false
      },
      COMMAND_PRIORITY_LOW
    )

    return () => {
      removeInsertCommand()
      removePasteCommand()
    }
  }, [editor])

  return null
}
