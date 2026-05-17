import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'

const handleI18nRouting = createMiddleware(routing)

const publicRoutes = ['/', '/login', '/setting']

export default async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request)
  if (response.ok) {
    const token = request.cookies.get('access_token')

    const pathname = request.nextUrl.pathname.replace(/^\/(en|zh)/, '') || '/'

    const isPublicRoute = publicRoutes.includes(pathname)

    if (!token && !isPublicRoute) {
      console.log('未登录')
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url)
      )
    }

    if (token && pathname === '/login') {
      console.log('已登录')
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
