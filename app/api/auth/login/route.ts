import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/db'
import { setUserSessionCookie, verifyPassword } from '@/lib/auth-helpers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = (body.email ?? '').toString().trim()
    const password = (body.password ?? '').toString()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const user = findUserByEmail(email)
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: 'E-mail ou senha inválidos' },
        { status: 401 }
      )
    }

    await setUserSessionCookie(user.id)

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
