import { getTagPostCountAPI } from '@/api'
import styles from './tag-post-count.module.scss'
import { getTranslations } from 'next-intl/server'

export default async function TagPostCount() {
  const t = await getTranslations('Home.aside.tag')

  const tagPostCountArr = await getTagPostCountAPI()
  const list = tagPostCountArr.slice(0, 10)

  return (
    <div className={styles['tag-rankings']}>
      <p className={styles.title}>{t('title')}</p>
      <ul>
        {list.map((item) => (
          <li tabIndex={0} className="tab-focus" key={item.id}>
            <p className={styles.name}># {item.name}</p>
            <p className={styles.count}>{item.postCount}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
