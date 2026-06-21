import BackButton from '@/components/common/back-button'
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
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.notification',
  })

  return {
    title: t('title'),
  }
}

export default async function NotificationPage() {
  const t = await getTranslations('Notification')
  return (
    <>
      <BackButton />
      <h1
        style={{
          marginTop: '20px',
        }}
      >
        {t('title')}
      </h1>
      <p style={{ marginTop: '20px' }}>{t('tip')}</p>
    </>
  )
}
