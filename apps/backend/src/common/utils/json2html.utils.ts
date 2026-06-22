import { createHeadlessEditor } from '@lexical/headless'
import { withDOM } from '@lexical/headless/dom'
import { ParagraphNode, TextNode } from 'lexical'
import { FormulaNode, ImageNode } from '@knowledge_island/lexical'
import { LinkNode } from '@lexical/link'
import { $generateHtmlFromNodes } from '@lexical/html'
import katex from 'katex'
import DOMPurify from 'isomorphic-dompurify'
import { JSDOM } from 'jsdom'

const editor = createHeadlessEditor({
  namespace: 'server',
  nodes: [ParagraphNode, TextNode, ImageNode, LinkNode, FormulaNode],
  onError(error) {
    throw error
  },
})

// export function json2html(json: JSON) {
//   return withDOM(() => {
//     try {
//       const editorState = editor.parseEditorState(JSON.stringify(json))

//       editor.setEditorState(editorState)
//     } catch (err) {
//       // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
//       throw new Error(`LEXICAL_CONTENT_FORMAT_ERROR: ${err}`)
//     }

//     let baseHtml = ''

//     editor.read(() => {
//       baseHtml = $generateHtmlFromNodes(editor)
//     })

//     const html = baseHtml
//       .replace(/<span data-formula="(.*?)"><\/span>/g, (_, latex: string) => {
//         const safeLatex = latex
//           .replace(/&amp;/g, '&')
//           .replace(/&lt;/g, '<')
//           .replace(/&gt;/g, '>')

//         return katex.renderToString(safeLatex, {
//           throwOnError: false,
//         })
//       })
//       .replace(
//         /<span data-image="(.*?)"(?: data-alt="(.*?)")?(?: data-width="(.*?)")?><\/span>/g,
//         (_, src: string, alt: string, width: string) => {
//           return `<img src="${src}" alt="${alt || 'image'}" style="max-width:${width || 50}%;border-radius:4px;" />`
//         }
//       )

//     return DOMPurify.sanitize(html, {
//       ADD_ATTR: ['target', 'rel'],
//     })
//   })
// }

export function json2html(json: JSON) {
  return withDOM(() => {
    try {
      const editorState = editor.parseEditorState(JSON.stringify(json))
      editor.setEditorState(editorState)
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`LEXICAL_CONTENT_FORMAT_ERROR: ${err}`)
    }

    let baseHtml = ''

    editor.read(() => {
      baseHtml = $generateHtmlFromNodes(editor)
    })

    const dom = new JSDOM(baseHtml)
    const doc = dom.window.document

    doc.querySelectorAll('span[data-formula]').forEach((el) => {
      const latex = el.getAttribute('data-formula') || ''

      el.outerHTML = katex.renderToString(latex, {
        throwOnError: false,
      })
    })

    doc.querySelectorAll('span[data-image]').forEach((el) => {
      const src = el.getAttribute('data-image') || ''
      const alt = el.getAttribute('data-alt') || 'image'
      const width = el.getAttribute('data-width') || '50'
      const aspectRatio =
        el.getAttribute('data-aspectRatio') || (16 / 9).toString()

      el.outerHTML = `<img src="${src}" alt="${alt}" style="max-width:${width}%;border-radius:4px;aspect-ratio: ${aspectRatio}" />`
    })

    return DOMPurify.sanitize(doc.body.innerHTML, {
      ADD_ATTR: ['target', 'rel'],
    })
  })
}
