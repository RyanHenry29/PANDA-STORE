'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Heart,
  LogOut,
  Loader2,
} from 'lucide-react'

type Me = {
  id: string
  name: string
  email: string
  phone: string | null
  createdAt: string
}

type OrderSummary = {
  id: string
  total: number
  status: string
}

export default function MinhaContaPage() {
  const [user, setUser] = useState<Me | null>(null)
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, ordersRes] = await Promise.all([
          fetch('/api/auth/me', { credentials: 'include' }),
          fetch('/api/orders', { credentials: 'include' }),
        ])
        if (meRes.ok) {
          const d = await meRes.json()
          setUser(d.user)
        }
        if (ordersRes.ok) {
          const d = await ordersRes.json()
          setOrders(d.orders || [])
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="mx-auto flex max-w-4xl items-center justify-center px-4 py-20">
        <Loader2 className="h-10 w-10 animate-spin text-sky-400" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-slate-300">Sua sessão expirou.</p>
        <Link
          href="/auth/login"
          className="mt-4 inline-block rounded-full bg-sky-400 px-6 py-3 font-semibold text-slate-950 hover:bg-sky-300"
        >
          Entrar novamente
        </Link>
      </div>
    )
  }

  const initial = user.name.charAt(0).toUpperCase()
  const memberSince = new Date(user.createdAt).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Minha conta</p>
      <h1 className="text-3xl font-black text-white">Olá, {user.name.split(' ')[0]}!</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <div className="glass rounded-[1.75rem] p-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 text-3xl font-bold text-sky-300">
              {initial}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white">{user.name}</h2>
            <p className="text-sm text-slate-400">{user.email}</p>
            <span className="mt-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              Cliente desde {memberSince}
            </span>
          </div>

          <div className="mt-6 space-y-2">
            <Link
              href="/catalogo/meus-pedidos"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white"
            >
              <ShoppingBag className="h-5 w-5" />
              Meus pedidos ({orders.length})
            </Link>
            <Link
              href="/catalogo/favoritos"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white"
            >
              <Heart className="h-5 w-5" />
              Favoritos
            </Link>
            <Link
              href="/catalogo/enderecos"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white"
            >
              <MapPin className="h-5 w-5" />
              Endereços
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-300"
            >
              <LogOut className="h-5 w-5" />
              Sair da conta
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-[1.75rem] p-6">
            <h3 className="text-lg font-semibold text-white">Informações pessoais</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <User className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">Nome</p>
                  <p className="text-white">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Mail className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">E-mail</p>
                  <p className="text-white">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Phone className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">Telefone</p>
                  <p className="text-white">{user.phone || 'Não informado'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <ShoppingBag className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">Pedidos totais</p>
                  <p className="text-white">{orders.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-[1.75rem] p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Pedidos recentes</h3>
              <Link href="/catalogo/meus-pedidos" className="text-sm text-sky-300 hover:text-sky-200">
                Ver todos
              </Link>
            </div>
            {orders.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">Você ainda não realizou pedidos.</p>
            ) : (
              <div className="mt-4 space-y-2">
                {orders.slice(0, 4).map((o) => (
                  <Link
                    key={o.id}
                    href="/catalogo/meus-pedidos"
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:border-sky-400/40 hover:bg-sky-400/10"
                  >
                    <span className="font-medium text-white">{o.id}</span>
                    <span className="text-sm text-slate-400">{o.status}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
