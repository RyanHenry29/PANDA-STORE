'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, Shield, Loader2, AlertCircle } from 'lucide-react'
import { formatPrice, products } from '@/lib/site-data'

type CartItem = {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  puffs?: number
}

const initialCart: CartItem[] = [
  { ...products[0], quantity: 2 },
  { ...products[1], quantity: 1 },
]

export default function CarrinhoPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>(initialCart)
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = items.length > 0 ? 15 : 0
  const total = subtotal + shipping

  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, quantity: Math.max(0, it.quantity + delta) } : it))
        .filter((it) => it.quantity > 0)
    )
  }

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  const handleCheckout = async () => {
    setError('')
    if (items.length === 0) {
      setError('Carrinho vazio')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: items.map((it) => ({
            productId: it.id,
            name: it.name,
            price: it.price,
            quantity: it.quantity,
          })),
          shipping,
          address: address.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      })

      if (res.status === 401) {
        // Não logado - redireciona para login
        router.push('/auth/login?redirect=/catalogo/carrinho')
        return
      }

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Erro ao finalizar pedido')
        setLoading(false)
        return
      }

      // Sucesso - vai para confirmação com o ID
      const orderId = data.order?.id || ''
      router.push(`/catalogo/pedido-confirmado?id=${encodeURIComponent(orderId)}`)
    } catch {
      setError('Erro de conexão')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <Link href="/catalogo" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Continuar comprando
      </Link>

      <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Carrinho</p>
      <h1 className="text-3xl font-black text-white">
        Seu carrinho ({items.length} {items.length === 1 ? 'item' : 'itens'})
      </h1>

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="glass rounded-3xl p-8 text-center text-slate-400">
              Seu carrinho está vazio.{' '}
              <Link href="/catalogo" className="text-sky-300 hover:text-sky-200">
                Voltar ao catálogo
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="glass rounded-3xl p-5">
                <div className="flex gap-4">
                  <div className="h-24 w-24 shrink-0 rounded-2xl bg-gradient-to-br from-sky-500/30 via-slate-900 to-black" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-white">{item.name}</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="rounded-full p-1 text-slate-400 hover:bg-red-400/10 hover:text-red-400"
                          aria-label="Remover"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-1">{item.description}</p>
                      {item.puffs && <p className="mt-1 text-xs text-slate-500">{item.puffs.toLocaleString()} puffs</p>}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="rounded-full border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10"
                          aria-label="Diminuir"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="rounded-full border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-lg font-bold text-sky-300">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {items.length > 0 && (
            <div className="glass rounded-3xl p-5">
              <h3 className="text-sm font-semibold text-white">Endereço de entrega</h3>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="Rua, número, bairro, cidade/UF"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/40 focus:outline-none focus:ring-1 focus:ring-sky-400/40"
              />
              <h3 className="mt-4 text-sm font-semibold text-white">Observações (opcional)</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Alguma instrução especial?"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/40 focus:outline-none focus:ring-1 focus:ring-sky-400/40"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="glass rounded-[1.75rem] p-6">
            <h2 className="text-lg font-semibold text-white">Resumo do pedido</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Frete</span>
                <span className="text-white">{formatPrice(shipping)}</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-2xl font-black text-sky-300">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || items.length === 0}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950 hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Finalizando...
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  Finalizar compra
                </>
              )}
            </button>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Truck className="h-5 w-5 text-sky-400" />
              Entrega discreta em todo o Brasil
            </div>
          </div>
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Shield className="h-5 w-5 text-emerald-400" />
              Produtos 100% originais com garantia
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
