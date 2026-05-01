import { NextRequest, NextResponse } from 'next/server'

const ADMIN_SESSION_TOKEN = 'panda_admin_session_2024'
const ADMIN_COOKIE = 'admin_session'
const USER_COOKIE = 'panda_user_session'

// Rotas de catálogo que exigem usuário logado
const PROTECTED_USER_ROUTES = [
  '/catalogo/meus-pedidos',
  '/catalogo/minha-conta',
  '/catalogo/enderecos',
  '/catalogo/favoritos',
  '/catalogo/pedido-confirmado',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protege rotas de admin (exceto /auth/admin-login)
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get(ADMIN_COOKIE)
    if (session?.value !== ADMIN_SESSION_TOKEN) {
      const loginUrl = new URL('/auth/admin-login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Protege rotas privadas do usuário
  if (PROTECTED_USER_ROUTES.some((route) => pathname.startsWith(route))) {
    const session = request.cookies.get(USER_COOKIE)
    if (!session?.value) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/catalogo/meus-pedidos/:path*',
    '/catalogo/minha-conta/:path*',
    '/catalogo/enderecos/:path*',
    '/catalogo/favoritos/:path*',
    '/catalogo/pedido-confirmado/:path*',
  ],
}
