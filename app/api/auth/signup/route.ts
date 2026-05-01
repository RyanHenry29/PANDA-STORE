import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail } from '@/lib/db'
import { hashPassword, setUserSessionCookie } from '@/lib/auth-helpers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = (body.name ?? '').toString().trim()
    const email = (body.email ?? '').toString().trim()
    const password = (body.password ?? '').toString()
    const phone = (body.phone ?? '').toString().trim() || undefined

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, e-mail e senha são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      )
    }

    if (findUserByEmail(email)) {
      return NextResponse.json(
        { error: 'Já existe uma conta com este e-mail' },
        { status: 409 }
      )
    }

    const user = createUser({
      name,
      email,
      phone,
      passwordHash: hashPassword(password),
    })

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
