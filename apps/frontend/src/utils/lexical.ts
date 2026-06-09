import { SerializedEditorState, SerializedLexicalNode } from 'lexical'
import { Toast } from './toast'

export function checkContentIsNotEmpty(
  content: SerializedEditorState<SerializedLexicalNode>,
  errorMsg: string
) {
  if (!content || !content.root) {
    Toast.show({
      msg: errorMsg,
      type: 'error',
    })
    return false
  }

  for (let i = 0; i < content.root.children.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const node = content.root.children[i] as any
    if (node.children.length !== 0) {
      if (node.children?.[0]?.type === 'image') {
        return true
      }
      if (node.children?.[0]?.type === 'formula') {
        return true
      }
      if (node.children?.[0]?.text?.trim()) {
        return true
      }
    }

    if (node.children.length === 0 && i + 1 === content.root.children.length) {
      Toast.show({
        msg: errorMsg,
        type: 'error',
      })
      return false
    }

    if (node.children.length !== 0 && i + 1 === content.root.children.length) {
      if (node.children?.[0]?.type === 'linebreak') {
        Toast.show({
          msg: errorMsg,
          type: 'error',
        })
        return false
      }
    }
  }

  return true
}
