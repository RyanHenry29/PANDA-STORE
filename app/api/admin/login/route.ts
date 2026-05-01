import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_EMAIL = 'admin@pandastore.com'
const ADMIN_PASSWORD = 'admin123'
const SESSION_TOKEN = 'panda_admin_session_2024'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha sao obrigatorios' },
        { status: 400 }
      )
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Credenciais invalidas' },
        { status: 401 }
      )
    }

    const cookieStore = await cookies()
    cookieStore.set('admin_session', SESSION_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({ success: true, message: 'Login realizado com sucesso' })
  } catch {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
