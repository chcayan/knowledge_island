import { locale } from '@/types/locale'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{
    locale: locale
  }>
}>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata.chat' })

  return {
    title: t('title'),
  }
}

export default function ChatPage() {
  return <p>chat</p>
}
