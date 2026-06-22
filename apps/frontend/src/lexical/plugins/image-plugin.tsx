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
import { BASE_URL } from '@/config/request'
import { getImageDimensions } from '@/utils'

export default function ImagePlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor')
    }

    const removeInsertCommand = editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createImageNode(
          payload.src,
          payload.altText,
          50,
          payload.aspectRatio
        )
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

                let aspectRatio
                const { width, height } = await getImageDimensions(file)
                if (width > 0 && height > 0) {
                  aspectRatio = width / height
                } else {
                  aspectRatio = 16 / 9
                }
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                  src: BASE_URL + res.data.data.url,
                  altText: 'Image',
                  aspectRatio,
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

    const rootElement = editor.getRootElement()
    const handleDrop = async (event: DragEvent) => {
      const files = event.dataTransfer?.files

      if (!files || files.length === 0) {
        return
      }

      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith('image/')
      )

      if (imageFiles.length === 0) {
        return
      }

      event.preventDefault()

      for (const file of imageFiles) {
        const res = await uploadImageAPI(file)

        let aspectRatio
        const { width, height } = await getImageDimensions(file)
        if (width > 0 && height > 0) {
          aspectRatio = width / height
        } else {
          aspectRatio = 16 / 9
        }

        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          src: BASE_URL + res.data.data.url,
          altText: 'Image',
          aspectRatio,
        })
      }
    }

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault()
    }

    rootElement?.addEventListener('drop', handleDrop)
    rootElement?.addEventListener('dragover', handleDragOver)

    return () => {
      removeInsertCommand()
      removePasteCommand()

      rootElement?.removeEventListener('drop', handleDrop)
      rootElement?.removeEventListener('dragover', handleDragOver)
    }
  }, [editor])

  return null
}
