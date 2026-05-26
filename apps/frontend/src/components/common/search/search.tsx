'use client'

import { useTranslations } from 'next-intl'
import SearchIcon from '../../icon/search-icon'
import styles from './search.module.scss'

export default function Search() {
  const t = useTranslations('Home')

  return (
    <label className={styles.search}>
      <SearchIcon />
      <input type="text" placeholder={t('searchPlaceholder')} />
    </label>
  )
}
