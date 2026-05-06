'use client'

import Editor from '@/components/publish/editor'
import styles from './publish.module.scss'
import ToggleButton from '@/components/common/toggle-button'
import { useRef, useState } from 'react'
import PublishIcon from '@/components/icon/publish-icon'
import DraftIcon from '@/components/icon/draft-icon'
import LoadingButton from '@/components/common/loading-button'
import { useTranslations } from 'next-intl'
import { Toast } from '@/utils'
import { createPostAPI } from '@/api'
import { SerializedEditorState, SerializedLexicalNode } from 'lexical'

export default function PublishPage() {
  const t = useTranslations('Publish')

  const [type, setType] = useState<'write' | 'ask'>('write')
  const [tags, setTags] = useState<string[]>([])

  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = () => {
    if (tags.length >= 10) {
      console.log('max tags')
      return
    }

    const inputEl = inputRef.current
    if (!inputEl) return

    const tag = inputEl.value.trim()

    if (!tag) {
      console.log('empty')
      return
    }

    if (tags.includes(tag)) {
      console.log('repeated')
      return
    }

    setTags([...tags, tag])
    inputEl.value = ''
  }

  const delTag = (value: string) => {
    setTags((prev) => prev.filter((tag) => tag !== value))
  }

  const [title, setTitle] = useState('')
  const [content, setContent] =
    useState<SerializedEditorState<SerializedLexicalNode>>()

  const [publishLoading, setPublishLoading] = useState(false)

  const createPost = async (status: 0 | 1) => {
    console.log(title)
    console.log(content)
    const res = await createPostAPI({
      title,
      content,
      type: type === 'write' ? 0 : 1,
      status,
      tags,
    })
    console.log(res.data)
  }

  const handlePublish = () => {
    if (publishLoading) return
    console.log('publish')
    setPublishLoading(true)
    createPost(1)

    setTimeout(() => {
      setPublishLoading(false)
      Toast.show({
        msg: '发布失败',
        type: 'error',
      })
    }, 2000)
  }

  const [draftLoading, setDraftLoading] = useState(false)

  const handleDraft = () => {
    if (draftLoading) return
    console.log('draft')
    setDraftLoading(true)

    setTimeout(() => {
      setDraftLoading(false)
      Toast.show({
        msg: '保存成功',
        type: 'success',
      })
    }, 2000)
  }

  return (
    <>
      <div className={styles.publish}>
        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>{t('title.publish')}</h1>
          </div>
          <p className={styles.description}>{t('description')}</p>
          <input
            type="text"
            className={styles['input-title']}
            placeholder={t('input.title')}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
            }}
          />
          <Editor onChange={setContent} />
        </main>
        <aside className={styles.aside}>
          <div className={styles.type}>
            <p>{t('aside.type')}：</p>
            <ToggleButton
              value={type}
              onChange={setType}
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
            <div className={styles['input-container']}>
              <input
                ref={inputRef}
                type="text"
                placeholder={t('input.tag')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addTag()
                }}
              />
              <button onClick={addTag}>
                <span>+</span>
              </button>
            </div>
            {tags.length > 0 && (
              <div className={styles.tags}>
                {tags.map((tag) => (
                  <div key={tag} className={styles.item}>
                    <span>#&nbsp;</span>
                    <span className={styles['name']}>{tag}</span>
                    <button onClick={() => delTag(tag)}>
                      <span>x</span>
                    </button>
                  </div>
                ))}
              </div>
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
              }}
              disabled={draftLoading || publishLoading}
            />
          </div>
        </aside>
      </div>
    </>
  )
}
