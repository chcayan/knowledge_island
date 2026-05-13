'use client'

import HomeIcon from '../icon/home-icon'
import AiIcon from '../icon/ai-icon'
import ChatIcon from '../icon/chat-icon'
import SettingIcon from '../icon/setting-icon'
import PublishIcon from '../icon/publish-icon'
import styles from './nav.module.scss'
import { useTranslations } from 'next-intl'
import { ComponentType } from 'react'
import clsx from 'clsx'
import { Link, usePathname } from '@/i18n/navigation'

type NavKey = 'home' | 'ai' | 'chat' | 'publish' | 'setting'

const topLinks: { name: NavKey; href: string; icon: ComponentType }[] = [
  { name: 'home', href: '/', icon: HomeIcon },
  { name: 'publish', href: '/publish', icon: PublishIcon },
  { name: 'ai', href: '/ai', icon: AiIcon },
  { name: 'chat', href: '/chat', icon: ChatIcon },
]

const bottomLinks: { name: NavKey; href: string; icon: ComponentType }[] = [
  { name: 'setting', href: '/setting', icon: SettingIcon },
]

export default function Nav() {
  const pathname = usePathname()
  const t = useTranslations('RootLayout')

  return (
    <nav className={styles.nav}>
      <div className={styles.top}>
        {topLinks.map((link) => {
          const LinkIcon = link.icon
          return (
            <Link
              key={link.name}
              href={link.href}
              scroll={false}
              className={clsx(styles.link, {
                'nav-active': pathname === link.href,
              })}
            >
              <LinkIcon />
              <p>{t(`nav.${link.name}`)}</p>
            </Link>
          )
        })}
      </div>
      <div className={styles.bottom}>
        {bottomLinks.map((link) => {
          const LinkIcon = link.icon
          return (
            <Link
              key={link.name}
              href={link.href}
              scroll={false}
              className={clsx(styles.link, {
                'nav-active': pathname === link.href,
              })}
            >
              <LinkIcon />
              <p>{t(`nav.${link.name}`)}</p>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
