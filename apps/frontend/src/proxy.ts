import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'
import { BASE_URL } from './config/request'
import { RouterPath } from './config/path'

const handleI18nRouting = createMiddleware(routing)

const publicRoutes = ['/', RouterPath.login, RouterPath.setting]

async function refresh(token: string) {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: `refresh_token=${token}`,
      },
    })

    const cookies = res.headers.getSetCookie()
    return cookies
  } catch (err) {
    console.log('fetch error:', err)
    return []
  }
}

export default async function proxy(request: NextRequest) {
  let response = handleI18nRouting(request)
  if (response.ok) {
    let accessToken = request.cookies.get('access_token')?.value
    const refreshToken = request.cookies.get('refresh_token')?.value

    let newCookies: string[] = []

    if (!accessToken && refreshToken) {
      const cookies = await refresh(refreshToken)

      if (cookies && cookies.length > 0) {
        newCookies = cookies
        accessToken = 'just_refreshed'
      }
    }

    const pathname = request.nextUrl.pathname.replace(/^\/(en|zh)/, '') || '/'

    const isPublicRoute = publicRoutes.includes(pathname)

    if (!accessToken && !isPublicRoute) {
      console.log('未登录')
      response = NextResponse.redirect(
        new URL(`${RouterPath.login}?redirect=${pathname}`, request.url)
      )
    } else if (accessToken && pathname === RouterPath.login) {
      console.log('已登录')
      response = NextResponse.redirect(new URL('/', request.url))
    }

    newCookies.forEach((cookie) => {
      response.headers.append('Set-Cookie', cookie)
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
