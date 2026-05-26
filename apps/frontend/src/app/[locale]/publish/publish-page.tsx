'use client'

import Editor from '@/components/publish/editor'
import styles from './publish.module.scss'
import ToggleButton from '@/components/common/toggle-button/toggle-button'
import { useEffect, useRef, useState } from 'react'
import PublishIcon from '@/components/icon/publish-icon'
import DraftIcon from '@/components/icon/draft-icon'
import LoadingButton from '@/components/common/loading-button/loading-button'
import { useTranslations } from 'next-intl'
import { Toast } from '@/utils/toast'
import { createPostAPI, getDraftAPI, saveDraftAPI } from '@/api'
import { SerializedEditorState, SerializedLexicalNode } from 'lexical'
import {
  POST_EDITOR_CONTENT,
  POST_TAGS,
  POST_TITLE,
  POST_TYPE,
} from '@/config/local-storage'
import {
  PostEditableStatus,
  PostType,
  TAG_NAME_MAX_LENGTH,
} from '@knowledge_island/schemas'
import { TAG_COUNT_LIMIT } from '@/config/post-field'

function checkContentIsNotEmpty(
  content: SerializedEditorState<SerializedLexicalNode>,
  errorMsg: string
) {
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

export default function PublishPage() {
  const t = useTranslations('Publish')

  const [type, setType] = useState<'write' | 'ask'>(
    (localStorage.getItem(POST_TYPE) as 'write') || 'write'
  )

  const [tags, setTags] = useState<string[]>(
    JSON.parse(localStorage.getItem(POST_TAGS) || '[]') || []
  )

  useEffect(() => {
    async function recoverDraft() {
      if (tags.length !== 0 && localStorage.getItem(POST_TYPE)) return
      const { draft } = await getDraftAPI()
      if (!draft) {
        localStorage.setItem(POST_TYPE, 'write')
        return
      }

      if (tags.length === 0) {
        const tags = draft.tags.map((tag) => tag.name)
        setTags(tags)
      }

      if (!localStorage.getItem(POST_TYPE)) {
        setType(draft.type === '0' ? 'write' : 'ask')
      }
    }

    recoverDraft()

    // recoverDraft 仅需要初始化一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const inputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<{ reset: () => void }>(null)

  const addTag = () => {
    if (tags.length >= TAG_COUNT_LIMIT) {
      Toast.show({
        msg: t('error.TAG_COUNT_LIMIT', { size: TAG_COUNT_LIMIT }),
        type: 'error',
      })
      return
    }

    const inputEl = inputRef.current
    if (!inputEl) return

    const tag = inputEl.value.trim()

    if (!tag) {
      Toast.show({
        msg: t('error.TAG_EMPTY'),
        type: 'error',
      })
      return
    }

    if (tags.includes(tag)) {
      Toast.show({
        msg: t('error.TAG_REPEAT'),
        type: 'error',
      })
      return
    }

    setTags([...tags, tag])
    localStorage.setItem(POST_TAGS, JSON.stringify([...tags, tag]))
    inputEl.value = ''
  }

  const delTag = (value: string) => {
    setTags((prev) => prev.filter((tag) => tag !== value))
    localStorage.setItem(
      POST_TAGS,
      JSON.stringify([...tags.filter((tag) => tag !== value)])
    )
  }

  const [content, setContent] =
    useState<SerializedEditorState<SerializedLexicalNode>>()

  const [publishLoading, setPublishLoading] = useState(false)

  const reset = () => {
    setTags([])
    editorRef.current?.reset()

    localStorage.removeItem(POST_TITLE)
    localStorage.removeItem(POST_TYPE)
    localStorage.removeItem(POST_TAGS)
    localStorage.removeItem(POST_EDITOR_CONTENT)
  }

  const createPost = async () => {
    if (!checkContentIsNotEmpty(content!, t('error.CONTENT_IS_NOT_NULL'))) {
      return
    }

    try {
      await createPostAPI({
        content,
        type: type === 'write' ? PostType.WRITE : PostType.ASK,
        status: PostEditableStatus.REVIEWING,
        tags,
      })
      Toast.show({
        msg: t('event.publishSuccess'),
        type: 'success',
      })
      reset()
    } catch (err) {
      // TODO: track error
      console.log(err)
      Toast.show({
        msg: t('error.PUBLISH_POST_FAILED'),
        type: 'error',
      })
    }
  }

  const saveDraft = async () => {
    try {
      await saveDraftAPI({
        content,
        type: type === 'write' ? PostType.WRITE : PostType.ASK,
        status: PostEditableStatus.DRAFT,
        tags,
      })
      Toast.show({
        msg: t('event.saveSuccess'),
        type: 'success',
      })
    } catch (err) {
      // TODO: track error
      console.log(err)
      Toast.show({
        msg: t('error.PUBLISH_POST_FAILED'),
        type: 'error',
      })
    }
  }

  const handlePublish = async () => {
    if (publishLoading) return
    console.log('publish')

    setPublishLoading(true)
    await createPost()
    setPublishLoading(false)
  }

  const [draftLoading, setDraftLoading] = useState(false)

  const handleDraft = async () => {
    if (draftLoading) return
    console.log('draft')

    setDraftLoading(true)
    await saveDraft()
    setDraftLoading(false)
  }

  return (
    <>
      <div className={styles.publish}>
        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>{t('title.publish')}</h1>
          </div>
          <p className={styles.description}>{t('description')}</p>
          <Editor
            ref={editorRef}
            onChange={setContent}
            saveDraft={handleDraft}
          />
        </main>
        <aside className={styles.aside}>
          <div className={styles.type}>
            <p>{t('aside.type')}：</p>
            <ToggleButton
              value={type}
              onChange={(type) => {
                setType(type)
                localStorage.setItem(POST_TYPE, type)
              }}
              options={[
                { value: 'write', label: 'Write' },
                { value: 'ask', label: 'ask' },
              ]}
            />
          </div>
          <div className={styles.tag}>
            <div className={styles.total}>
              <p>{t('aside.tag')}：</p>
              <span>{tags.length} / 10</span>
            </div>
            <div
              style={{
                marginBottom: tags.length ? '0' : '15px',
              }}
              className={styles['input-container']}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder={t('input.tag')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addTag()
                }}
                maxLength={TAG_NAME_MAX_LENGTH}
              />
              <button className="tab-focus" onClick={addTag}>
                <span>+</span>
              </button>
            </div>
            {tags.length > 0 && (
              <ul className={styles.tags}>
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className={`${styles.item} tab-focus`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return
                      delTag(tag)
                    }}
                  >
                    <span>#&nbsp;</span>
                    <span className={styles['name']}>{tag}</span>
                    <button tabIndex={-1} onClick={() => delTag(tag)}>
                      <span>x</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.operate}>
            <LoadingButton
              text={t('aside.draft')}
              icon={<DraftIcon width={16} height={16} />}
              loading={draftLoading}
              onClick={handleDraft}
              style={{
                backgroundColor: 'var(--theme-third-color)',
                height: '40px',
              }}
              disabled={publishLoading || draftLoading}
            />
            <LoadingButton
              text={t('aside.publish')}
              icon={<PublishIcon width={16} height={16} />}
              loading={publishLoading}
              onClick={handlePublish}
              style={{
                backgroundColor: 'var(--theme-primary-color)',
                height: '40px',
              }}
              disabled={draftLoading || publishLoading}
            />
          </div>
        </aside>
      </div>
    </>
  )
}
