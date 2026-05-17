import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { ThemeProvider } from '@wrksz/themes/next'
import '@/scss/index.scss'
import styles from './layout.module.scss'
import Nav from '@/components/layout/nav'
import { locale } from '@/types/locale'
import LogoIcon from '@/components/icon/logo-icon'
import EmitterNotification from '@/components/common/emitter-notification'

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{
    locale: locale
  }>
}>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata.home' })

  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      t('keywords.1'),
      t('keywords.2'),
      t('keywords.3'),
      t('keywords.4'),
    ],
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{
    locale: locale
  }>
}>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={styles.layout}>
        <ThemeProvider>
          <NextIntlClientProvider>
            <header className={styles.header}>
              <div className={styles.title}>
                <h1>Knowledge Island</h1>
              </div>
              <div className={styles.logo}>
                <LogoIcon width={40} height={40} />
              </div>
              <Nav />
            </header>
            <div className={styles.children}>{children}</div>
            <EmitterNotification />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
