import { createHeadlessEditor } from '@lexical/headless'
import { withDOM } from '@lexical/headless/dom'
import { ParagraphNode, TextNode } from 'lexical'
import { FormulaNode, ImageNode } from '@knowledge_island/lexical'
import { LinkNode } from '@lexical/link'
import { $generateHtmlFromNodes } from '@lexical/html'
import katex from 'katex'

const editor = createHeadlessEditor({
  namespace: 'server',
  nodes: [ParagraphNode, TextNode, ImageNode, LinkNode, FormulaNode],
})

export function json2html(json: JSON) {
  return withDOM(() => {
    const editorState = editor.parseEditorState(JSON.stringify(json))

    editor.setEditorState(editorState)

    let baseHtml = ''

    editor.getEditorState().read(() => {
      baseHtml = $generateHtmlFromNodes(editor)
    })

    // 处理 LaTeX
    const html = baseHtml.replace(
      /<span data-formula="(.*?)"><\/span>/g,
      (_, latex: string) => {
        return katex.renderToString(latex, {
          throwOnError: false,
        })
      }
    )

    return html
  })
}
