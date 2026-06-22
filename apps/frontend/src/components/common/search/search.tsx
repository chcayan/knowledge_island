'use client'

import { useTranslations } from 'next-intl'
import SearchIcon from '../../icon/search-icon'
import styles from './search.module.scss'
import { useRouter } from 'next/navigation'
import { RoutePath } from '@/config/path'
import { useState } from 'react'
import { Toast } from '@/utils/toast'

export default function Search() {
  const t = useTranslations('Home')
  const router = useRouter()
  const [value, setValue] = useState('')

  const navigateToSearch = () => {
    if (!value.trim()) {
      Toast.show({
        msg: '请输入内容',
        type: 'error',
      })
      return
    }
    router.push(`${RoutePath.search}?keyword=${value}`)
  }

  return (
    <label className={styles.search}>
      <SearchIcon />
      <input
        type="text"
        placeholder={t('searchPlaceholder')}
        onKeyDown={(e) => {
          if (e.key === 'Enter') navigateToSearch()
        }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  )
}
