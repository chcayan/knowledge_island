import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Metadata } from 'next'
import { ThemeProvider } from '@wrksz/themes/next'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import '@/scss/index.scss'

type locales = ['zh', 'en']
type locale = locales[number]

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{
    locale: locale
  }>
}>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

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
      <body>
        <ThemeProvider>
          <NextIntlClientProvider>
            <Link href={locale === 'en' ? '/zh' : '/en'}>
              切换为 {locale === 'en' ? '中文' : '英文'}
            </Link>
            <ThemeToggle />
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
