/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, JSX } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
// import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
// import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  DecoratorNode,
} from 'lexical'

import { TOGGLE_LINK_COMMAND } from '@lexical/link'
import Image from 'next/image'
import { LinkNode } from '@lexical/link'

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string

  constructor(src: string = '', key?: string) {
    super(key)
    this.__src = src
  }

  static getType() {
    return 'image'
  }

  static clone(node: ImageNode) {
    return new ImageNode(node.__src, node.__key)
  }

  static importJSON(serializedNode: any) {
    const { src } = serializedNode
    return new ImageNode(src)
  }

  exportJSON() {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
    }
  }

  createDOM() {
    return document.createElement('div')
  }

  updateDOM() {
    return false
  }

  decorate() {
    return (
      <Image
        src={this.__src}
        style={{ maxWidth: '100%', borderRadius: 8 }}
        alt={''}
      />
    )
  }
}

function setTextColor(editor: any, color: string) {
  editor.update(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      selection.getNodes().forEach((node: any) => {
        if (node.setStyle) {
          node.setStyle(`color: ${color}`)
        }
      })
    }
  })
}

function setFontSize(editor: any, size: number) {
  editor.update(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      selection.getNodes().forEach((node: any) => {
        if (node.setStyle) {
          node.setStyle(`font-size: ${size}px`)
        }
      })
    }
  })
}

function insertImage(editor: any, url: string) {
  editor.update(() => {
    const selection = $getSelection()
    const node = new ImageNode(url)
    selection?.insertNodes([node])
  })
}

function Toolbar() {
  const [editor] = useLexicalComposerContext()

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
      >
        B
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
      >
        I
      </button>

      <button onClick={() => setTextColor(editor, 'red')}>红</button>

      <button onClick={() => setFontSize(editor, 20)}>大</button>

      <button
        onClick={() => {
          const url = prompt('输入链接')
          if (url) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
          }
        }}
      >
        🔗
      </button>

      <button
        onClick={() => {
          const url = prompt('输入图片URL')
          if (url) {
            insertImage(editor, url)
          }
        }}
      >
        🖼️
      </button>
    </div>
  )
}

export function Editor() {
  const [value, setValue] = useState<any>(null)

  const initialConfig = {
    namespace: 'Editor',
    theme: {},
    onError(error: any) {
      console.error(error)
    },
    nodes: [ImageNode, LinkNode],
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div style={{ border: '1px solid #ddd', padding: 12 }}>
        <Toolbar />

        {/* <RichTextPlugin
          contentEditable={<ContentEditable
            style={{
              minHeight: 150,
              outline: 'none',
            }} />}
          placeholder={<div style={{ opacity: 0.3 }}>开始输入...</div>} ErrorBoundary={undefined}        /> */}

        <HistoryPlugin />
        <LinkPlugin />

        <OnChangePlugin
          onChange={(editorState) => {
            setValue(editorState.toJSON())
          }}
        />
      </div>
    </LexicalComposer>
  )
}
