'use client'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import {
  $isTextNode,
  DOMConversionMap,
  DOMExportOutput,
  DOMExportOutputMap,
  EditorState,
  isHTMLElement,
  Klass,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  TextNode,
} from 'lexical'
import { LinkNode } from '@lexical/link'

import { theme } from './theme'
import ToolbarPlugin from './plugins/toolbar-plugin'
import { parseAllowedColor, parseAllowedFontSize } from './style-config'
import styles from './editor.module.scss'
import './index.scss'
import { useState } from 'react'
import OnChangePlugin from './plugins/on-change-plugin'
import RestorePlugin from './plugins/restore-plugin'
import { ImageNode } from './nodes/image-node'
import { ImagePlugin } from './plugins/image-plugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import AutoUpdateLinkPlugin from './plugins/auto-update-link-plugin'
import 'katex/dist/katex.min.css'
import { FormulaNode } from './nodes/formula-node'
import FormulaPlugin from './plugins/formula-plugin'
import { FormulaInputNode } from './nodes/formula-input-node'

const placeholder = 'Enter some rich text...'

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

let timer: number
export default function Editor() {
  const [, setEditorState] = useState<string>()

  function onChange(_editorState: EditorState) {
    if (timer) clearTimeout(timer)
    timer = window.setTimeout(() => {
      const editorStateJSON = _editorState.toJSON()
      const jsonString = JSON.stringify(editorStateJSON)

      setEditorState(jsonString)
      localStorage.setItem('editor-state', jsonString)
      console.log(_editorState)
    }, 300)
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className={styles['editor-container']}>
        <ToolbarPlugin />
        <div className={styles['editor-inner']}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={styles['editor-input']}
                aria-placeholder={placeholder}
                placeholder={
                  <div className={styles['editor-placeholder']}>
                    {placeholder}
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
          <FormulaPlugin />
          <OnChangePlugin onChange={onChange} />
          <RestorePlugin />
        </div>
      </div>
    </LexicalComposer>
  )
}
