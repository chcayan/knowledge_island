'use client'

import styles from './lexical-html.module.scss'

export default function LexicalHtml({ html }: { html: string }) {
  return (
    <div
      className={styles['content-html']}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
}
