'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'
import { $insertNodes } from 'lexical'
import { INSERT_IMAGE_COMMAND } from '../commands/command'
import { ImageNode } from '../nodes/image-node'

const imageFileMap = new Map<string, File>()

export default function ImagePlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      ({ file, src }) => {
        imageFileMap.set(src, file)

        editor.update(() => {
          const node = new ImageNode(src)
          $insertNodes([node])
        })

        return true
      },
      0
    )
  }, [editor])

  return null
}
