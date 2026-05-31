'use client'

import { getTagPostCountAPI, TagPostCountType } from '@/api'
import styles from './tag-post-count.module.scss'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

export default function TagPostCount() {
  const t = useTranslations('Home.aside.tag')
  const [list, setList] = useState<TagPostCountType[]>([])

  useEffect(() => {
    async function getTagPostCount() {
      const tagPostCountArr = await getTagPostCountAPI()
      setList(tagPostCountArr.slice(0, 10))
    }

    getTagPostCount()
  }, [])

  return (
    <div className={styles['tag-rankings']}>
      <p className={styles.title}>{t('title')}</p>
      <ul>
        {list.map((item, index) => (
          <li tabIndex={0} className="tab-focus" key={item.id}>
            <p className={styles.rank}>{index + 1}</p>
            <p className={styles.name}>{item.name}</p>
            <p className={styles.count}>{item.postCount}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
