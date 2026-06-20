import { getTagPostCountAPI } from '@/api'
import styles from './tag-post-count.module.scss'
import { getTranslations } from 'next-intl/server'

export default async function TagPostCount() {
  const t = await getTranslations('Home')

  const tagPostCountArr = await getTagPostCountAPI()
  const list = tagPostCountArr.slice(0, 10)

  return (
    <div className={styles['tag-rankings']}>
      <p className={styles.title}>{t('aside.tag.title')}</p>
      <ul>
        {list.length > 0 ? (
          list.map((item) => (
            <li tabIndex={0} className="tab-focus" key={item.id}>
              <p className={styles.name}># {item.name}</p>
              <p className={styles.count}>{item.postCount}</p>
            </li>
          ))
        ) : (
          <li style={{ fontSize: '14px' }}>{t('error.noTag')}</li>
        )}
      </ul>
    </div>
  )
}
