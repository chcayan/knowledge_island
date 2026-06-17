'use client'

import { useTheme } from '@wrksz/themes/client'
import Select from '../common/select/select'
import { useTranslations } from 'next-intl'

export default function ThemeToggle() {
  const t = useTranslations('Setting.subModule.general.subItem.theme')
  const { theme, setTheme } = useTheme()

  return (
    <Select
      value={theme}
      options={[
        {
          label: t('select.system'),
          value: 'system',
        },
        {
          label: t('select.light'),
          value: 'light',
        },
        {
          label: t('select.dark'),
          value: 'dark',
        },
      ]}
      onChange={(value) => setTheme(value)}
    />
  )
}
