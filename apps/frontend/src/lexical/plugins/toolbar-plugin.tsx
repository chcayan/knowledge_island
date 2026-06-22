'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import {
  $findMatchingParent,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  KEY_DOWN_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import ArrowCounterclockwise from '../icons/arrow-counterclockwise'
import ArrowClockwise from '../icons/arrow-clockwise'
import TypeBold from '../icons/type-bold'
import TypeItalic from '../icons/type-italic'
import TypeUnderline from '../icons/type-underline'
import TypeStrikethrough from '../icons/type-strikethrough'
import TextLeft from '../icons/text-left'
import TextCenter from '../icons/text-center'
import TextRight from '../icons/text-right'
import TextJustify from '../icons/text-justify'
import { INSERT_IMAGE_COMMAND } from '../commands/command'
import InsertImage from '../icons/insert-image'
import { $isLinkNode, $toggleLink } from '@lexical/link'
import ToggleLink from '../icons/toggle-link'
import { FormulaInputNode } from '../nodes/formula-input-node'
import InsertLatex from '../icons/insert-latex'
import { uploadImageAPI } from '@/api'
import { CustomError, getImageDimensions } from '@/utils'
import { useTranslations } from 'next-intl'
import { Toast } from '@/utils/toast'
import { BASE_URL } from '@/config/request'
import { GIF_SIZE_LIMIT } from '@/config/post-field'
import '../scss/toolbar-plugin.scss'

function Divider() {
  return <div className="divider" />
}

export default function ToolbarPlugin({
  saveDraft,
}: {
  saveDraft: () => void
}) {
  const t = useTranslations('Publish')
  const [editor] = useLexicalComposerContext()

  const toolbarRef = useRef(null)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isLink, setIsLink] = useState(false)
  const [align, setAlign] = useState('left')

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

  const insertLink = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) return

      const node = selection.anchor.getNode()
      const linkNode = $findMatchingParent(node, $isLinkNode)

      if (linkNode) {
        $toggleLink(null)
        return
      }

      const url = selection.getTextContent().trim()

      $toggleLink({
        url,
        target: '_blank',
      })
    })
  }, [editor])

  const insertFormula = useCallback(() => {
    editor.update(() => {
      const node = new FormulaInputNode()
      $insertNodes([node])
    })
  }, [editor])

  function isLinkActive() {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) return false

    const node = selection.anchor.getNode()

    const linkNode = $findMatchingParent(node, $isLinkNode)

    return !!linkNode
  }

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      setIsLink(isLinkActive())
    }
  }, [])

  const $updateAlignStatus = useCallback(() => {
    const selection = $getSelection()

    if (!$isRangeSelection(selection)) return

    const anchorNode = selection.anchor.getNode()

    const element = anchorNode.getTopLevelElementOrThrow()

    const format = element.getFormatType()

    setAlign(format || 'left')
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(
          () => {
            $updateToolbar()
            $updateAlignStatus()
          },
          { editor }
        )
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar()
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DOWN_COMMAND,
        (event: KeyboardEvent) => {
          const isMod = event.ctrlKey || event.metaKey

          if (isMod && event.key.toLowerCase() === 'd') {
            event.preventDefault()
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
            return true
          }

          if (isMod && event.key.toLowerCase() === 'l') {
            event.preventDefault()
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
            return true
          }

          if (isMod && event.key.toLowerCase() === 'e') {
            event.preventDefault()
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
            return true
          }

          if (isMod && event.key.toLowerCase() === 'r') {
            event.preventDefault()
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
            return true
          }

          if (isMod && event.key.toLowerCase() === 'j') {
            event.preventDefault()
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
            return true
          }

          if (isMod && (event.key === '1' || event.code === 'Digit1')) {
            event.preventDefault()
            fileInputRef.current?.click()
            return true
          }

          if (isMod && (event.key === '2' || event.code === 'Digit2')) {
            event.preventDefault()
            insertLink()
            return true
          }

          if (isMod && (event.key === '3' || event.code === 'Digit3')) {
            event.preventDefault()
            insertFormula()
            return true
          }

          if (isMod && event.key.toLowerCase() === 's') {
            event.preventDefault()
            saveDraft()
            return true
          }

          return false
        },
        COMMAND_PRIORITY_HIGH
      )
    )
  }, [
    editor,
    $updateToolbar,
    $updateAlignStatus,
    insertLink,
    insertFormula,
    saveDraft,
  ])

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined)
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
        tabIndex={-1}
        title={t('toolbar.undo')}
      >
        <ArrowCounterclockwise />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined)
        }}
        className="toolbar-item spaced"
        aria-label="Redo"
        tabIndex={-1}
        title={t('toolbar.redo')}
      >
        <ArrowClockwise />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
        }}
        className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
        aria-label="Format Bold"
        tabIndex={-1}
        title={t('toolbar.bold')}
      >
        <TypeBold />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
        }}
        className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
        aria-label="Format Italics"
        tabIndex={-1}
        title={t('toolbar.italics')}
      >
        <TypeItalic />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
        }}
        className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
        aria-label="Format Underline"
        tabIndex={-1}
        title={t('toolbar.underline')}
      >
        <TypeUnderline />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
        }}
        className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
        aria-label="Format Strikethrough"
        tabIndex={-1}
        title={t('toolbar.strikethrough')}
      >
        <TypeStrikethrough />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
        }}
        className={'toolbar-item spaced ' + (align === 'left' ? 'active' : '')}
        aria-label="Left Align"
        tabIndex={-1}
        title={t('toolbar.leftAlign')}
      >
        <TextLeft />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
        }}
        className={
          'toolbar-item spaced ' + (align === 'center' ? 'active' : '')
        }
        aria-label="Center Align"
        tabIndex={-1}
        title={t('toolbar.centerAlign')}
      >
        <TextCenter />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
        }}
        className={'toolbar-item spaced ' + (align === 'right' ? 'active' : '')}
        aria-label="Right Align"
        tabIndex={-1}
        title={t('toolbar.rightAlign')}
      >
        <TextRight />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
        }}
        className={
          'toolbar-item spaced ' + (align === 'justify' ? 'active' : '')
        }
        aria-label="Justify Align"
        tabIndex={-1}
        title={t('toolbar.justifyAlign')}
      >
        <TextJustify />
      </button>
      <Divider />
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="toolbar-item spaced"
        aria-label="Insert image"
        tabIndex={-1}
        title={t('toolbar.insertImage')}
      >
        <InsertImage />
      </button>
      <button
        onClick={insertLink}
        className={'toolbar-item spaced ' + (isLink ? 'active' : '')}
        aria-label="toggle link"
        tabIndex={-1}
        title={t('toolbar.toggleLink')}
      >
        <ToggleLink />
      </button>
      <button
        onClick={insertFormula}
        className="toolbar-item spaced"
        aria-label="insert LaTeX"
        tabIndex={-1}
        title={t('toolbar.insertLaTeX')}
      >
        <InsertLatex />
      </button>{' '}
    </div>
  )
}
