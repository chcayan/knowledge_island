'use client'
import Select from '../select/select'
// import styles from './locale-toggle.module.scss'
import { usePathname, useRouter } from 'next/navigation'

type Locale = 'zh' | 'en'

export default function LocaleToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  const path = pathname.slice(3)
  return (
    <Select
      value={locale}
      options={[
        {
          label: '简体中文',
          value: 'zh',
        },
        {
          label: 'English',
          value: 'en',
        },
      ]}
      onChange={(value) => {
        router.push(`/${value}${path}`)
      }}
    />
  )
}
