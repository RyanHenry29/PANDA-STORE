import { NextRequest, NextResponse } from 'next/server'
import { createOrder, listOrders, type DBOrderItem, type DBOrderStatus } from '@/lib/db'
import { getCurrentUser, isAdminAuthenticated } from '@/lib/auth-helpers'

const VALID_STATUS: DBOrderStatus[] = ['Pago', 'Separando', 'Enviado', 'Entregue', 'Cancelado']

/**
 * GET /api/orders
 * - Admin (cookie admin_session): retorna todos os pedidos
 * - Usuário logado: retorna apenas seus pedidos
 * - Anônimo: 401
 */
export async function GET() {
  const isAdmin = await isAdminAuthenticated()
  if (isAdmin) {
    return NextResponse.json({ orders: listOrders() })
  }

  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }
  return NextResponse.json({ orders: listOrders({ userId: user.id }) })
}

/**
 * POST /api/orders
 * - Cria pedido. Admin pode criar para qualquer cliente; usuário cria para si.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const isAdmin = await isAdminAuthenticated()
    const user = await getCurrentUser()

    if (!isAdmin && !user) {
      return NextResponse.json(
        { error: 'É necessário estar logado para finalizar um pedido' },
        { status: 401 }
      )
    }

    const items = Array.isArray(body.items) ? (body.items as DBOrderItem[]) : []
    if (items.length === 0) {
      return NextResponse.json(
        { error: 'O pedido precisa ter pelo menos 1 item' },
        { status: 400 }
      )
    }

    // Sanitiza/valida itens
    const cleanItems: DBOrderItem[] = items
      .map((it) => ({
        productId: Number(it.productId) || 0,
        name: String(it.name ?? '').trim() || 'Produto',
        price: Number(it.price) || 0,
        quantity: Math.max(1, Number(it.quantity) || 1),
      }))
      .filter((it) => it.price >= 0)

    const subtotal = cleanItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shipping = Number(body.shipping ?? 15)
    const total = subtotal + shipping

    const customerName = isAdmin
      ? (body.customerName ?? '').toString().trim() || 'Cliente'
      : user!.name
    const customerEmail = isAdmin
      ? (body.customerEmail ?? '').toString().trim() || 'sem-email@panda.com'
      : user!.email
    const customerPhone = (body.customerPhone ?? user?.phone ?? '').toString().trim() || undefined
    const address = (body.address ?? '').toString().trim() || undefined
    const notes = (body.notes ?? '').toString().trim() || undefined

    const status: DBOrderStatus = VALID_STATUS.includes(body.status)
      ? body.status
      : 'Pago'

    const order = createOrder({
      userId: isAdmin ? null : user!.id,
      customerName,
      customerEmail,
      customerPhone,
      address,
      items: cleanItems,
      subtotal,
      shipping,
      total,
      status,
      notes,
    })

    return NextResponse.json({ success: true, order })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 })
  }
}
