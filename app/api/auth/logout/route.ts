import { NextResponse } from 'next/server'
import { clearUserSessionCookie } from '@/lib/auth-helpers'

export async function POST() {
  await clearUserSessionCookie()
  return NextResponse.json({ success: true })
}
