import { NextResponse, type NextRequest } from 'next/server'
import { verifySessionToken } from '../auth'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const token = request.cookies.get('orrgolf_auth')?.value
  const user = token ? await verifySessionToken(token) : null

  if (
    !user &&
    request.nextUrl.pathname !== '/' &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }
  
  if (user && request.nextUrl.pathname === '/') {
    // user is signed in and on the login page, redirect to game
    const url = request.nextUrl.clone()
    url.pathname = '/game'
    return NextResponse.redirect(url)
  }

  return response
}
