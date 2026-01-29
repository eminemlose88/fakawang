import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth/session'

// Supported locales
const locales = ['en', 'zh']
const defaultLocale = 'zh'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 1. Exclude paths that should not be localized
  // - /api/*: API routes
  // - /manager/*: Admin panel (we handle auth separately below)
  // - /_next/*: Next.js internals
  // - /static/*: Static files
  // - /favicon.ico, /robots.txt, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Exclude files with extensions
  ) {
    return NextResponse.next()
  }

  // 2. Protect /manager routes
  if (pathname.startsWith('/manager') && !pathname.startsWith('/manager/login')) {
    const session = request.cookies.get('session')?.value
    const user = session ? await decrypt(session) : null

    if (!user) {
      return NextResponse.redirect(new URL('/manager/login', request.url))
    }
    return NextResponse.next()
  }

  // If it's a manager route (including login), skip i18n
  if (pathname.startsWith('/manager')) {
    return NextResponse.next()
  }

  // 3. Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // 4. Redirect to default locale if missing
  const locale = defaultLocale
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. /about -> /zh/about
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: Only run on root (/)
    // '/'
  ],
}