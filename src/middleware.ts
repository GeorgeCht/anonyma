import { NextResponse } from 'next/server'
import { userSession } from './app/actions/session'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const keyQuery = request.nextUrl.searchParams.get('key')
  const sessionIsValid = await userSession.validate()
  const sensitiveRoutes = ['/c']
  const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (pathname.startsWith('/auth')) {
    if (sessionIsValid) {
      return NextResponse.redirect(new URL('/browse', request.url))
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/config')) {
    if (keyQuery === process.env.CONFIG_KEY) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/404', request.url))
  }

  if (!sessionIsValid && isAccessingSensitiveRoute) {
    return NextResponse.redirect(new URL('/?notauthorized', request.url))
  }
}

export const config = {
  matchter: ['/c/:path*', '/browse/:path*'],
}
