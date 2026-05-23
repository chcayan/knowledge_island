'use client'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import {
  $isTextNode,
  CLEAR_EDITOR_COMMAND,
  CLEAR_HISTORY_COMMAND,
  DOMConversionMap,
  DOMExportOutput,
  DOMExportOutputMap,
  EditorState,
  isHTMLElement,
  Klass,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  SerializedEditorState,
  SerializedLexicalNode,
  TextNode,
} from 'lexical'
import { LinkNode } from '@lexical/link'

import { theme } from './theme'
import ToolbarPlugin from './plugins/toolbar-plugin'
import { parseAllowedColor, parseAllowedFontSize } from './style-config'
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
import RestorePlugin from './plugins/restore-plugin'
import { ImageNode } from './nodes/image-node'
import { ImagePlugin } from './plugins/image-plugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import AutoUpdateLinkPlugin from './plugins/auto-update-link-plugin'
import 'katex/dist/katex.min.css'
import { FormulaNode } from './nodes/formula-node'
import { FormulaInputNode } from './nodes/formula-input-node'
import { useTranslations } from 'next-intl'
import { POST_EDITOR_CONTENT } from '@/config/local-storage'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

const removeStylesExportDOM = (
  editor: LexicalEditor,
  target: LexicalNode
): DOMExportOutput => {
  const output = target.exportDOM(editor)
  if (output && isHTMLElement(output.element)) {
    for (const el of [
      output.element,
      ...output.element.querySelectorAll('[style],[class]'),
    ]) {
      el.removeAttribute('class')
      el.removeAttribute('style')
    }
  }
  return output
}

const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [ParagraphNode, removeStylesExportDOM],
  [TextNode, removeStylesExportDOM],
])

const getExtraStyles = (element: HTMLElement): string => {
  let extraStyles = ''
  const fontSize = parseAllowedFontSize(element.style.fontSize)
  const backgroundColor = parseAllowedColor(element.style.backgroundColor)
  const color = parseAllowedColor(element.style.color)
  if (fontSize !== '' && fontSize !== '15px') {
    extraStyles += `font-size: ${fontSize};`
  }
  if (backgroundColor !== '' && backgroundColor !== 'rgb(255, 255, 255)') {
    extraStyles += `background-color: ${backgroundColor};`
  }
  if (color !== '' && color !== 'rgb(0, 0, 0)') {
    extraStyles += `color: ${color};`
  }
  return extraStyles
}

const constructImportMap = (): DOMConversionMap => {
  const importMap: DOMConversionMap = {}

  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode)
      if (!importer) {
        return null
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element)
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output
          }
          const extraStyles = getExtraStyles(element)
          if (extraStyles) {
            const { forChild } = output
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent)
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles)
                }
                return textNode
              },
            }
          }
          return output
        },
      }
    }
  }

  return importMap
}

const editorConfig = {
  html: {
    export: exportMap,
    import: constructImportMap(),
  },
  namespace: 'editor',
  nodes: [
    ParagraphNode,
    TextNode,
    ImageNode,
    LinkNode,
    FormulaNode,
    FormulaInputNode,
  ],
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
      editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined)
    },
  }))

  return null
})

RefController.displayName = 'ref_controller'

export default forwardRef(function Editor(
  {
    onChange,
    saveDraft,
  }: {
    onChange: Dispatch<
      SetStateAction<SerializedEditorState<SerializedLexicalNode> | undefined>
    >
    saveDraft: () => void
  },
  ref
) {
  const t = useTranslations('Publish')

  const [, setEditorState] = useState<string>()

  const timerRef = useRef<number | null>(null)

  function handleEditorChange(editorState: EditorState) {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
    }

    timerRef.current = window.setTimeout(() => {
      const editorStateJSON = editorState.toJSON()
      const jsonString = JSON.stringify(editorStateJSON)

      onChange(editorStateJSON)
      setEditorState(jsonString)
      localStorage.setItem(POST_EDITOR_CONTENT, jsonString)
      // console.log(editorState)
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
        <ToolbarPlugin saveDraft={saveDraft} />
        <div className={styles['editor-inner']}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                tabIndex={0}
                className={styles['editor-input']}
                aria-placeholder={t('input.content')}
                placeholder={
                  <div className={styles['editor-placeholder']}>
                    {t('input.content')}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <AutoUpdateLinkPlugin />
          <ImagePlugin />
          <LinkPlugin />
          <OnChangePlugin onChange={handleEditorChange} />
          <RestorePlugin />
          <ClearEditorPlugin />
          <RefController ref={ref} />
        </div>
      </div>
    </LexicalComposer>
  )
})
