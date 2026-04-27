import LocaleToggle from '@/components/common/locale-toggle'
import { locale } from '@/types/locale'

export default async function Setting({
  params,
}: Readonly<{
  params: Promise<{
    locale: locale
  }>
}>) {
  const { locale } = await params

  return (
    <>
      <p>setting</p>
      <LocaleToggle locale={locale} />
    </>
  )
}
