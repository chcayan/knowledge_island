import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { ThemeProvider } from '@wrksz/themes/next'
import '@/scss/index.scss'
import styles from './layout.module.scss'
import Nav from '@/components/layout/nav'
import LogoIcon from '@/components/icon/logo-icon'
import EmitterNotification from '@/components/common/emitter-notification'
import ConfirmProvider from '@/components/common/confirm/confirm-provider'
import StoreInitial from '@/components/common/store-initial'

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{
    locale: string
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
            <ConfirmProvider>
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
              <StoreInitial />
            </ConfirmProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
