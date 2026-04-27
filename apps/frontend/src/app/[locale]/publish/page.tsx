import Editor from '@/components/publish/editor'
import styles from './publish.module.scss'

export default function Publish() {
  return (
    <>
      <div className={styles.publish}>
        <h1>发布帖子</h1>
        <p>Structure your thoughts and share knowledge.</p>
        <Editor />
      </div>
    </>
  )
}
