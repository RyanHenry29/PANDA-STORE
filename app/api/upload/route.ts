import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: 'Upload desativado no modo sem back-end antigo.',
  })
}
