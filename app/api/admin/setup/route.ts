import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: 'Setup do admin pronto para integrar ao armazenamento do Next.',
  })
}
