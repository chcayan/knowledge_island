import { createHeadlessEditor } from '@lexical/headless'
import { withDOM } from '@lexical/headless/dom'
import { ParagraphNode, TextNode } from 'lexical'
import { FormulaNode, ImageNode } from '@knowledge_island/lexical'
import { LinkNode } from '@lexical/link'
import { $generateHtmlFromNodes } from '@lexical/html'
import katex from 'katex'
import DOMPurify from 'isomorphic-dompurify'

const editor = createHeadlessEditor({
  namespace: 'server',
  nodes: [ParagraphNode, TextNode, ImageNode, LinkNode, FormulaNode],
  onError(error) {
    throw error
  },
})

export function json2html(json: JSON) {
  return withDOM(() => {
    try {
      const editorState = editor.parseEditorState(JSON.stringify(json))

      editor.setEditorState(editorState)
    } catch {
      throw new Error('LEXICAL_CONTENT_FORMAT_ERROR')
    }

    let baseHtml = ''

    editor.getEditorState().read(() => {
      baseHtml = $generateHtmlFromNodes(editor)
    })

    const html = baseHtml
      .replace(/<span data-formula="(.*?)"><\/span>/g, (_, latex: string) => {
        return katex.renderToString(latex, {
          throwOnError: false,
        })
      })
      .replace(
        /<span data-image="(.*?)"(?: data-alt="(.*?)")?(?: data-width="(.*?)")?><\/span>/g,
        (_, src: string, alt: string, width: string) => {
          return `<img src="${src}" alt="${alt || 'image'}" style="max-width:${width || 50}%;border-radius:4px;" />`
        }
      )

    return DOMPurify.sanitize(html, {
      ADD_ATTR: ['target', 'rel'],
    })
  })
}
