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

        // 遍历剪贴板内容，寻找是否有图片
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            // 找到了图片，阻止默认的粘贴行为
            event.preventDefault()

            const file = items[i].getAsFile()
            if (file) {
              // 这里的逻辑和之前工具栏上传的逻辑一致
              // 如果需要上传到服务器，在此处调用后端 API
              const reader = new FileReader()
              reader.onload = () => {
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                  src: reader.result as string,
                  altText: 'Pasted Image',
                })
              }
              reader.readAsDataURL(file)
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
