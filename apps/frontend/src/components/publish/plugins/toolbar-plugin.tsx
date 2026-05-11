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
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
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
import { baseURL, CustomError } from '@/utils'
import { useTranslations } from 'next-intl'
import { GIF_SIZE_LIMIT } from '@/config/post-field'
import { Toast } from '@/utils/toast'

function Divider() {
  return <div className="divider" />
}

export default function ToolbarPlugin() {
  const t = useTranslations('Publish.error')
  const [editor] = useLexicalComposerContext()

  const toolbarRef = useRef(null)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isLink, setIsLink] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      try {
        const res = await uploadImageAPI(file)
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          src: baseURL + res.data.data.url,
          altText: file.name,
        })
      } catch (err) {
        if (err instanceof CustomError) {
          if (err.type === 'GIF_SIZE_LIMIT') {
            Toast.show({
              msg: t(err.type, { size: GIF_SIZE_LIMIT }),
              type: 'error',
            })
            return
          }
        }
        Toast.show({
          msg: t('UPLOAD_IMAGE_FAILED'),
          type: 'error',
        })
      } finally {
        event.target.value = ''
      }
    }
  }

  function insertLink() {
    editor.update(() => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) return

      const node = selection.anchor.getNode()
      const linkNode = $findMatchingParent(node, $isLinkNode)

      console.log(linkNode)
      if (linkNode) {
        $toggleLink(null)
        return
      }

      const url = selection.getTextContent().trim()

      $toggleLink(url)
    })
  }

  function insertFormula() {
    editor.update(() => {
      const node = new FormulaInputNode()
      $insertNodes([node])
    })
  }

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

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(
          () => {
            $updateToolbar()
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
      )
    )
  }, [editor, $updateToolbar])

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined)
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
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
      >
        <TypeBold />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
        }}
        className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
        aria-label="Format Italics"
      >
        <TypeItalic />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
        }}
        className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
        aria-label="Format Underline"
      >
        <TypeUnderline />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
        }}
        className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
        aria-label="Format Strikethrough"
      >
        <TypeStrikethrough />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
        }}
        className="toolbar-item spaced"
        aria-label="Left Align"
      >
        <TextLeft />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
        }}
        className="toolbar-item spaced"
        aria-label="Center Align"
      >
        <TextCenter />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
        }}
        className="toolbar-item spaced"
        aria-label="Right Align"
      >
        <TextRight />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
        }}
        className="toolbar-item spaced"
        aria-label="Justify Align"
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
      >
        <InsertImage />
      </button>
      <button
        onClick={insertLink}
        className={'toolbar-item spaced ' + (isLink ? 'active' : '')}
        aria-label="toggle link"
      >
        <ToggleLink />
      </button>
      <button
        onClick={insertFormula}
        className="toolbar-item spaced"
        aria-label="toggle link"
      >
        <InsertLatex />
      </button>{' '}
    </div>
  )
}
