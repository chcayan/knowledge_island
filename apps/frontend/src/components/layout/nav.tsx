'use client'

import { HomeIcon } from '../icon/home-icon'
import { AiIcon } from '../icon/ai-icon'
import { ChatIcon } from '../icon/chat-icon'
import styles from './nav.module.scss'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'
import { SettingIcon } from '../icon/setting-icon'
import { PublishIcon } from '../icon/publish-icon'

const path = {
  home: '/',
  ai: '/ai',
  chat: '/chat',
  publish: '/publish',
  setting: '/setting',
}

export default function Nav() {
  const pathname = usePathname().slice(3) || path.home
  const t = useTranslations()

  return (
    <nav className={styles.nav}>
      <div className={styles.top}>
        <Link
          href={path.home}
          className={clsx(styles.link, {
            'nav-active': pathname === path.home,
          })}
          title={t('RootLayout.nav.home')}
        >
          <HomeIcon />
          <p>{t('RootLayout.nav.home')}</p>
        </Link>
        <Link
          href={path.publish}
          className={clsx(styles.link, {
            'nav-active': pathname === path.publish,
          })}
          title={t('RootLayout.nav.publish')}
        >
          <PublishIcon />
          <p>{t('RootLayout.nav.publish')}</p>
        </Link>
        <Link
          href={path.ai}
          className={clsx(styles.link, {
            'nav-active': pathname === path.ai,
          })}
          title={t('RootLayout.nav.ai')}
        >
          <AiIcon />
          <p>{t('RootLayout.nav.ai')}</p>
        </Link>
        <Link
          href={path.chat}
          className={clsx(styles.link, {
            'nav-active': pathname === path.chat,
          })}
          title={t('RootLayout.nav.chat')}
        >
          <ChatIcon />
          <p style={{ marginBottom: '5px' }}>{t('RootLayout.nav.chat')}</p>
        </Link>
      </div>
      <div className={styles.bottom}>
        <Link
          href={path.setting}
          className={clsx(styles.link, {
            'nav-active': pathname === path.setting,
          })}
          title={t('RootLayout.nav.setting')}
        >
          <SettingIcon />
          <p>{t('RootLayout.nav.setting')}</p>
        </Link>
      </div>
    </nav>
  )
}
