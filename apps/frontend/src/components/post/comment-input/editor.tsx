'use client'

import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import {
  CLEAR_EDITOR_COMMAND,
  EditorState,
  ParagraphNode,
  SerializedEditorState,
  SerializedLexicalNode,
  TextNode,
} from 'lexical'

import { theme } from './theme'
import styles from './editor.module.scss'
import './index.scss'
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { ImageNode } from '@/lexical/nodes/image-node'
import { FormulaNode } from '@/lexical/nodes/formula-node'
import { FormulaInputNode } from '@/lexical/nodes/formula-input-node'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useTranslations } from 'next-intl'
import ImagePlugin from '@/lexical/plugins/image-plugin'
import MiniToolbarPlugin from '@/lexical/plugins/mini-toolbar-plugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import LoadingButton from '@/components/common/loading-button/loading-button'
import emitter from '@/utils/event-emitter'

const editorConfig = {
  namespace: 'comment-input',
  nodes: [ParagraphNode, TextNode, ImageNode, FormulaNode, FormulaInputNode],
  onError(error: Error) {
    console.error(error)
  },
  theme,
}

const RefController = forwardRef((props, ref) => {
  const [editor] = useLexicalComposerContext()

  useImperativeHandle(ref, () => ({
    focus() {
      editor.focus()
    },
    reset() {
      editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined)
    },
  }))

  return null
})

RefController.displayName = 'ref_controller_by_comment_input'

export default forwardRef(function Editor(
  {
    onChange,
    send,
  }: {
    onChange: Dispatch<
      SetStateAction<SerializedEditorState<SerializedLexicalNode> | undefined>
    >
    send: () => void
  },
  ref
) {
  const t = useTranslations('Post')

  const timerRef = useRef<number | null>(null)

  function handleEditorChange(editorState: EditorState) {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
    }

    timerRef.current = window.setTimeout(() => {
      const editorStateJSON = editorState.toJSON()
      onChange(editorStateJSON)
    }, 100)
  }

  const [name, setName] = useState('')

  useEffect(() => {
    const commentReplyWithRootOff = emitter.on(
      'EVENT:COMMENT_REPLY_WITH_ROOT',
      (_parentId: string, name: string) => {
        setName(name)
      }
    )

    const commentReplyWithoutRootOff = emitter.on(
      'EVENT:COMMENT_REPLY_WITHOUT_ROOT',
      (_parentId: string, _replyCommentId: string, name: string) => {
        setName(name)
      }
    )

    return () => {
      commentReplyWithRootOff()
      commentReplyWithoutRootOff()

      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className={styles['editor-container']}>
        <div className={styles['editor-inner']}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                tabIndex={0}
                className={styles['editor-input']}
                aria-placeholder={
                  name ? t('comment.replyToUser', { name }) : t('comment.input')
                }
                placeholder={
                  <div className={styles['editor-placeholder']}>
                    {name
                      ? t('comment.replyToUser', { name })
                      : t('comment.input')}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <div className={styles['editor-toolbar']}>
          <MiniToolbarPlugin />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
            }}
          >
            {name && (
              <button
                className="tab-focus"
                style={{
                  height: '30px',
                  width: 'fit-content',
                  padding: '0 5px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setName('')
                  emitter.emit('EVENT:COMMENT_REPLY_RESET')
                }}
              >
                {t('comment.cancelReply')}
              </button>
            )}
            <LoadingButton
              text={t('comment.send')}
              loading={false}
              disabled={false}
              style={{
                marginRight: '5px',
                background: 'var(--theme-primary-color)',
                height: '30px',
                width: '70px',
              }}
              onClick={() => {
                send()
                setName('')
                emitter.emit('EVENT:COMMENT_REPLY_RESET')
              }}
            />
          </div>
        </div>
        <ImagePlugin />
        <OnChangePlugin onChange={handleEditorChange} />
        <ClearEditorPlugin />
        <RefController ref={ref} />
        <HistoryPlugin />
      </div>
    </LexicalComposer>
  )
})
