'use client'

import { locale } from '@/types/locale'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function LocaleToggle({ locale }: { locale: locale }) {
  const pathname = usePathname()
  const path = pathname.slice(4)
  return (
    <Link href={locale === 'en' ? `/zh/${path}` : `/en/${path}`}>
      切换为 {locale === 'en' ? '中文' : '英文'}
    </Link>
  )
}
