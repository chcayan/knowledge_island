'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import { $insertNodes, COMMAND_PRIORITY_HIGH, KEY_DOWN_COMMAND } from 'lexical'
import { ChangeEvent, useCallback, useEffect, useRef } from 'react'
import { INSERT_IMAGE_COMMAND } from '../commands/command'
import InsertImage from '../icons/insert-image'
import { FormulaInputNode } from '../nodes/formula-input-node'
import InsertLatex from '../icons/insert-latex'
import { uploadImageAPI } from '@/api'
import { CustomError, getImageDimensions } from '@/utils'
import { useTranslations } from 'next-intl'
import { Toast } from '@/utils/toast'
import { BASE_URL } from '@/config/request'
import { GIF_SIZE_LIMIT } from '@/config/post-field'
import '../scss/mini-toolbar-plugin.scss'

export default function MiniToolbarPlugin() {
  const t = useTranslations('Publish')
  const [editor] = useLexicalComposerContext()

  const toolbarRef = useRef(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      try {
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
          altText: file.name,
          aspectRatio,
        })
      } catch (err) {
        if (err instanceof CustomError) {
          if (err.type === 'GIF_SIZE_LIMIT') {
            Toast.show({
              msg: t(`error.${err.type}`, { size: GIF_SIZE_LIMIT }),
              type: 'error',
            })
            return
          }
        }
        Toast.show({
          msg: t('error.UPLOAD_IMAGE_FAILED'),
          type: 'error',
        })
      } finally {
        event.target.value = ''
      }
    }
  }

  const insertFormula = useCallback(() => {
    editor.update(() => {
      const node = new FormulaInputNode()
      $insertNodes([node])
    })
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        KEY_DOWN_COMMAND,
        (event: KeyboardEvent) => {
          const isMod = event.ctrlKey || event.metaKey

          if (isMod && (event.key === '1' || event.code === 'Digit1')) {
            event.preventDefault()
            fileInputRef.current?.click()
            return true
          }

          if (isMod && (event.key === '3' || event.code === 'Digit3')) {
            event.preventDefault()
            insertFormula()
            return true
          }

          return false
        },
        COMMAND_PRIORITY_HIGH
      )
    )
  }, [editor, insertFormula])

  return (
    <div className="mini-toolbar" ref={toolbarRef}>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="mini-toolbar-item spaced"
        aria-label="Insert image"
        tabIndex={-1}
        title={t('toolbar.insertImage')}
      >
        <InsertImage />
      </button>
      <button
        onClick={insertFormula}
        className="mini-toolbar-item spaced"
        aria-label="insert LaTeX"
        tabIndex={-1}
        title={t('toolbar.insertLaTeX')}
      >
        <InsertLatex />
      </button>{' '}
    </div>
  )
}
