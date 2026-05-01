'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  ArrowLeft,
  Loader2,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { formatPrice } from '@/lib/site-data'

type OrderItem = {
  productId: number
  name: string
  price: number
  quantity: number
}

type Order = {
  id: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  status: 'Pago' | 'Separando' | 'Enviado' | 'Entregue' | 'Cancelado'
  createdAt: string
  notes?: string
  address?: string
}

const statusConfig: Record<string, { icon: typeof Package; color: string; bg: string }> = {
  Pago: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
  Separando: { icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
  Enviado: { icon: Truck, color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/30' },
  Entregue: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
  Cancelado: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function MeusPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders', { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Erro ao carregar pedidos')
      } else {
        setOrders(data.orders || [])
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleCancel = async (id: string) => {
    if (!confirm('Cancelar este pedido?')) return
    const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: 'Cancelado' }),
    })
    if (res.ok) {
      load()
    } else {
      const d = await res.json().catch(() => ({}))
      alert(d.error || 'Falha ao cancelar')
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <Link href="/catalogo/minha-conta" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Voltar para minha conta
      </Link>

      <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Meus pedidos</p>
      <h1 className="text-3xl font-black text-white">Histórico de compras</h1>
      <p className="mt-2 text-slate-400">Acompanhe todos os seus pedidos na Panda Store</p>

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-sky-400" />
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-12 text-center">
          <Package className="mx-auto h-16 w-16 text-slate-600" />
          <p className="mt-4 text-lg text-slate-400">Você ainda não fez nenhum pedido</p>
          <Link
            href="/catalogo"
            className="mt-4 inline-block rounded-full bg-sky-400 px-6 py-3 font-semibold text-slate-950 hover:bg-sky-300"
          >
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => {
            const config = statusConfig[order.status] || statusConfig.Pago
            const StatusIcon = config.icon
            const isOpen = openId === order.id
            return (
              <div key={order.id} className="glass rounded-3xl p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-2xl border p-3 ${config.bg}`}>
                      <StatusIcon className={`h-6 w-6 ${config.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{order.id}</p>
                      <p className="text-sm text-slate-400">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'itens'} • {formatDate(order.createdAt)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xl font-bold text-sky-300">{formatPrice(order.total)}</p>
                      <span className={`rounded-full border px-3 py-1 text-xs ${config.bg} ${config.color}`}>
                        {order.status}
                      </span>
                    </div>
                    <button
                      onClick={() => setOpenId(isOpen ? null : order.id)}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white"
                    >
                      {isOpen ? 'Fechar' : 'Detalhes'}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500">Itens</p>
                      <ul className="mt-2 space-y-1 text-sm text-slate-200">
                        {order.items.map((it, i) => (
                          <li key={i} className="flex justify-between">
                            <span>
                              {it.quantity}x {it.name}
                            </span>
                            <span className="text-slate-400">{formatPrice(it.price * it.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid gap-2 text-sm sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-slate-500">Subtotal</p>
                        <p className="text-slate-200">{formatPrice(order.subtotal)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Frete</p>
                        <p className="text-slate-200">{formatPrice(order.shipping)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Total</p>
                        <p className="font-bold text-sky-300">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                    {order.address && (
                      <div>
                        <p className="text-xs text-slate-500">Endereço de entrega</p>
                        <p className="text-sm text-slate-200">{order.address}</p>
                      </div>
                    )}
                    {(order.status === 'Pago' || order.status === 'Separando') && (
                      <div className="pt-2">
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="rounded-full border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm text-red-300 hover:border-red-400/50 hover:bg-red-400/20"
                        >
                          Cancelar pedido
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
