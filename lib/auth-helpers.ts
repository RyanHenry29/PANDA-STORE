import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import {
  createSession,
  deleteSession,
  findSessionByToken,
  findUserById,
  type DBUser,
} from './db'

/**
 * Helpers de autenticação:
 * - hash/verificação de senha com scrypt (built-in do Node)
 * - cookie de sessão httpOnly para o usuário comum
 * - cookie do admin permanece o existente (admin_session)
 */

export const USER_SESSION_COOKIE = 'panda_user_session'
export const ADMIN_SESSION_COOKIE = 'admin_session'
export const ADMIN_SESSION_TOKEN = 'panda_admin_session_2024'

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const derived = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${derived}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const derived = scryptSync(password, salt, 64)
  const storedBuf = Buffer.from(hash, 'hex')
  if (derived.length !== storedBuf.length) return false
  return timingSafeEqual(derived, storedBuf)
}

export function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export async function setUserSessionCookie(userId: string): Promise<string> {
  const token = generateToken()
  createSession(userId, token)
  const cookieStore = await cookies()
  cookieStore.set(USER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    path: '/',
  })
  return token
}

export async function clearUserSessionCookie() {
  const cookieStore = await cookies()
  const existing = cookieStore.get(USER_SESSION_COOKIE)
  if (existing?.value) {
    deleteSession(existing.value)
  }
  cookieStore.delete(USER_SESSION_COOKIE)
}

export async function getCurrentUser(): Promise<DBUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value
  if (!token) return null
  const session = findSessionByToken(token)
  if (!session) return null
  const user = findUserById(session.userId)
  return user ?? null
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)
  return session?.value === ADMIN_SESSION_TOKEN
}
