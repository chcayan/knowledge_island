'use client'

import Editor from '@/components/publish/editor'
import styles from './publish.module.scss'
import ToggleButton from '@/components/common/toggle-button'
import { useState } from 'react'

export default function PublishPage() {
  const [tab, setTab] = useState<'write' | 'ask' | 'ask1' | 'ask2'>('write')

  return (
    <>
      <div className={styles.publish}>
        <div className={styles.header}>
          <h1>发布帖子</h1>
          <ToggleButton
            value={tab}
            onChange={setTab}
            options={[
              {
                value: 'write',
                label: (
                  <>
                    <span className={styles.full}>Write an Article</span>
                    <span className={styles.short}>Write</span>
                  </>
                ),
              },
              {
                value: 'ask',
                label: (
                  <>
                    <span className={styles.full}>Ask a Question</span>
                    <span className={styles.short}>Ask</span>
                  </>
                ),
              },
              // {
              //   value: 'ask1',
              //   label: (
              //     <>
              //       <span className={styles.full}>Ask a Question</span>
              //       <span className={styles.short}>Ask1</span>
              //     </>
              //   ),
              // },
              // {
              //   value: 'ask2',
              //   label: (
              //     <>
              //       <span className={styles.full}>Ask a Question</span>
              //       <span className={styles.short}>Ask1</span>
              //     </>
              //   ),
              // },
            ]}
          />
        </div>
        {/* <p>Structure your thoughts and share knowledge.</p> */}
        <input
          type="text"
          className={styles['input-title']}
          placeholder="请输入标题"
        />
        <Editor />
      </div>
    </>
  )
}
