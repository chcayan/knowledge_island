'use client'

import { SerializedEditorState, SerializedLexicalNode } from 'lexical'
import Editor from './editor'
import { checkContentIsNotEmpty } from '@/utils'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import emitter from '@/utils/event-emitter'
import { createCommentAPI } from '@/api'
import { Toast } from '@/utils/toast'

export default function CommentInput() {
  const pathname = usePathname()
  const postId = pathname.slice(9)

  const t = useTranslations('Post')
  const editorRef = useRef<{ focus: () => void; reset: () => void }>(null)

  const [content, setContent] =
    useState<SerializedEditorState<SerializedLexicalNode>>()

  const parentId = useRef<string | null>(null)
  const replyCommentId = useRef<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const commentReplyWithRootOff = emitter.on(
      'EVENT:COMMENT_REPLY_WITH_ROOT',
      (_parentId: string) => {
        parentId.current = _parentId
        replyCommentId.current = null
      }
    )

    const commentReplyWithoutRootOff = emitter.on(
      'EVENT:COMMENT_REPLY_WITHOUT_ROOT',
      (_parentId: string, _replyCommentId: string) => {
        parentId.current = _parentId
        replyCommentId.current = _replyCommentId
      }
    )

    const commentReplyResetOff = emitter.on('EVENT:COMMENT_REPLY_RESET', () => {
      parentId.current = null
      replyCommentId.current = null
    })

    const commentInputFocusOff = emitter.on('EVENT:COMMENT_INPUT_FOCUS', () => {
      editorRef.current?.focus()
    })

    return () => {
      commentReplyWithRootOff()
      commentReplyWithoutRootOff()
      commentReplyResetOff()
      commentInputFocusOff()
    }
  }, [])

  const createComment = async () => {
    if (!checkContentIsNotEmpty(content!, t('comment.emptyInputTip'))) {
      return
    }

    try {
      await createCommentAPI({
        contentJSON: content,
        postId,
        parentId: parentId.current,
        replyCommentId: replyCommentId.current,
      })

      Toast.show({
        msg: t('event.success'),
        type: 'success',
      })
      editorRef.current?.reset()
      router.refresh()
    } catch {
      /* empty */
    }
  }

  return <Editor ref={editorRef} onChange={setContent} send={createComment} />
}
