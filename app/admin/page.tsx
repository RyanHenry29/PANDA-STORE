'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, Users, ShoppingCart, AlertTriangle, Loader2 } from 'lucide-react'
import {
  clients,
  products,
  notifications,
  stats,
  formatPrice,
  categories,
} from '@/lib/site-data'

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
  total: number
  status: 'Pago' | 'Separando' | 'Enviado' | 'Entregue' | 'Cancelado'
  createdAt: string
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/orders', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setOrders(data.orders || [])
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const pendingOrders = orders.filter(
    (o) => o.status === 'Pago' || o.status === 'Separando'
  ).length
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelado')
    .reduce((s, o) => s + o.total, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Admin</p>
      <h1 className="text-3xl font-black text-white">Painel Panda Store</h1>
      <p className="mt-2 text-slate-400">Gerencie seus produtos, pedidos e clientes</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <Package className="h-8 w-8 text-sky-400" />
            <span className="text-3xl font-black text-white">{products.length}</span>
          </div>
          <p className="mt-3 text-sm text-slate-400">Produtos cadastrados</p>
        </div>
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <ShoppingCart className="h-8 w-8 text-emerald-400" />
            <span className="text-3xl font-black text-white">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : pendingOrders}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-400">Pedidos pendentes</p>
        </div>
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <Users className="h-8 w-8 text-violet-400" />
            <span className="text-3xl font-black text-white">{orders.length}</span>
          </div>
          <p className="mt-3 text-sm text-slate-400">Pedidos totais</p>
        </div>
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <AlertTriangle className="h-8 w-8 text-amber-400" />
            <span className="text-2xl font-black text-white">{formatPrice(totalRevenue)}</span>
          </div>
          <p className="mt-3 text-sm text-slate-400">Receita acumulada</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="glass rounded-3xl p-5">
            <p className="text-3xl font-black text-white">{item.value}</p>
            <p className="mt-2 text-sm text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass rounded-[1.75rem] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Pedidos recentes</h2>
            <Link href="/admin/pedidos" className="text-sm text-sky-300 hover:text-sky-200">
              Ver todos
            </Link>
          </div>
          {loading ? (
            <div className="mt-4 flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-sky-400" />
            </div>
          ) : orders.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">
              Nenhum pedido registrado ainda.{' '}
              <Link href="/admin/pedidos" className="text-sky-300 hover:text-sky-200">
                Criar primeiro pedido
              </Link>
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-white">{order.id}</p>
                    <p className="text-sm text-slate-400">{order.customerName}</p>
                    <p className="truncate text-xs text-slate-500">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sky-300">{formatPrice(order.total)}</p>
                    <span
                      className={`text-xs ${
                        order.status === 'Entregue'
                          ? 'text-emerald-400'
                          : order.status === 'Enviado'
                            ? 'text-violet-400'
                            : order.status === 'Cancelado'
                              ? 'text-red-400'
                              : order.status === 'Separando'
                                ? 'text-blue-400'
                                : 'text-amber-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="glass rounded-[1.75rem] p-6">
          <h2 className="text-xl font-semibold text-white">Avisos do sistema</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {notifications.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="glass rounded-[1.75rem] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Produtos por categoria</h2>
            <Link href="/admin/produtos" className="text-sm text-sky-300 hover:text-sky-200">
              Gerenciar
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat.slug).length
              return (
                <div
                  key={cat.slug}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-white">{cat.name}</p>
                    <p className="text-sm text-slate-400">{cat.description}</p>
                  </div>
                  <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-sm text-sky-200">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        <section className="glass rounded-[1.75rem] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Clientes recentes</h2>
            <Link href="/admin/clientes" className="text-sm text-sky-300 hover:text-sky-200">
              Ver todos
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {clients.slice(0, 4).map((client) => (
              <div
                key={client.email}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{client.name}</p>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-300">
                    {client.orders} pedidos
                  </span>
                </div>
                <p className="text-sm text-slate-400">{client.email}</p>
                <p className="text-sm text-slate-500">{client.phone}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
