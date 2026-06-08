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
  }: {
    onChange: Dispatch<
      SetStateAction<SerializedEditorState<SerializedLexicalNode> | undefined>
    >
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
    }, 300)
  }

  useEffect(() => {
    return () => {
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
                aria-placeholder={t('comment.input')}
                placeholder={
                  <div className={styles['editor-placeholder']}>
                    {t('comment.input')}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ImagePlugin />
          <OnChangePlugin onChange={handleEditorChange} />
          <ClearEditorPlugin />
          <RefController ref={ref} />
        </div>
        <div className={styles['editor-toolbar']}>
          <MiniToolbarPlugin />
          <LoadingButton
            text={t('comment.send')}
            loading={false}
            disabled={false}
            style={{
              marginRight: '5px',
              background: 'var(--theme-third-color)',
              height: '30px',
              width: '70px',
            }}
          />
        </div>
      </div>
      <HistoryPlugin />
    </LexicalComposer>
  )
})
