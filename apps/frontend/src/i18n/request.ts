import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import { hasLocale } from 'next-intl'
import { headers } from 'next/headers'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const acceptLanguage = (await headers()).get('accept-language') || ''

  const browserLocale = acceptLanguage.split(',')[0].split('-')[0]

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : hasLocale(routing.locales, browserLocale)
      ? browserLocale
      : routing.defaultLocale

  return {
    locale,
    messages: (await import(`@/i18n/messages/${locale}.json`)).default,
  }
})
