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
  const t = await getTranslations({ locale, namespace: 'Metadata.ai' })

  return {
    title: t('title'),
  }
}

export default function AiPage() {
  return <p>ai</p>
}
