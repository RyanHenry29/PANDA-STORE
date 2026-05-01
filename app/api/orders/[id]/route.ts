import { NextRequest, NextResponse } from 'next/server'
import {
  deleteOrder,
  findOrderById,
  updateOrder,
  type DBOrderStatus,
} from '@/lib/db'
import { getCurrentUser, isAdminAuthenticated } from '@/lib/auth-helpers'

const VALID_STATUS: DBOrderStatus[] = ['Pago', 'Separando', 'Enviado', 'Entregue', 'Cancelado']

type Ctx = { params: Promise<{ id: string }> }

async function authorize(orderId: string) {
  const order = findOrderById(orderId)
  if (!order) return { error: 'Pedido não encontrado', status: 404 as const }

  const isAdmin = await isAdminAuthenticated()
  if (isAdmin) return { order, isAdmin: true as const }

  const user = await getCurrentUser()
  if (!user) return { error: 'Não autenticado', status: 401 as const }
  if (order.userId !== user.id) return { error: 'Acesso negado', status: 403 as const }

  return { order, isAdmin: false as const }
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  // ID pode vir como "PD-3001" na URL (sem o #). Tentamos os dois formatos.
  const decoded = decodeURIComponent(id)
  const tryId = decoded.startsWith('#') ? decoded : `#${decoded}`
  const result = await authorize(tryId)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }
  return NextResponse.json({ order: result.order })
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  const decoded = decodeURIComponent(id)
  const tryId = decoded.startsWith('#') ? decoded : `#${decoded}`

  const result = await authorize(tryId)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  // Apenas admin pode editar pedido. Usuário pode no máximo cancelar.
  const body = await req.json().catch(() => ({}))
  const patch: Record<string, unknown> = {}

  if (result.isAdmin) {
    if (typeof body.customerName === 'string') patch.customerName = body.customerName.trim()
    if (typeof body.customerEmail === 'string') patch.customerEmail = body.customerEmail.trim()
    if (typeof body.customerPhone === 'string') patch.customerPhone = body.customerPhone.trim()
    if (typeof body.address === 'string') patch.address = body.address.trim()
    if (typeof body.notes === 'string') patch.notes = body.notes.trim()
    if (typeof body.shipping === 'number') patch.shipping = body.shipping
    if (Array.isArray(body.items)) {
      const items = body.items.map(
        (it: { productId?: number; name?: string; price?: number; quantity?: number }) => ({
          productId: Number(it.productId) || 0,
          name: String(it.name ?? '').trim() || 'Produto',
          price: Number(it.price) || 0,
          quantity: Math.max(1, Number(it.quantity) || 1),
        })
      )
      patch.items = items
      const subtotal = items.reduce(
        (sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity,
        0
      )
      patch.subtotal = subtotal
      const ship =
        typeof body.shipping === 'number' ? body.shipping : result.order.shipping
      patch.total = subtotal + ship
    }
    if (VALID_STATUS.includes(body.status)) patch.status = body.status
  } else {
    // Usuário só pode cancelar o próprio pedido se ainda não foi enviado
    if (body.status === 'Cancelado' && (result.order.status === 'Pago' || result.order.status === 'Separando')) {
      patch.status = 'Cancelado'
    } else {
      return NextResponse.json({ error: 'Operação não permitida' }, { status: 403 })
    }
  }

  const updated = updateOrder(tryId, patch)
  if (!updated) {
    return NextResponse.json({ error: 'Falha ao atualizar' }, { status: 500 })
  }
  return NextResponse.json({ success: true, order: updated })
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  const decoded = decodeURIComponent(id)
  const tryId = decoded.startsWith('#') ? decoded : `#${decoded}`

  // Apenas admin pode deletar
  const isAdmin = await isAdminAuthenticated()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Apenas administradores' }, { status: 403 })
  }
  const ok = deleteOrder(tryId)
  if (!ok) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
  return NextResponse.json({ success: true })
}
