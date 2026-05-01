'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react'
import { formatPrice, products } from '@/lib/site-data'

type OrderItem = {
  productId: number
  name: string
  price: number
  quantity: number
}

type Order = {
  id: string
  userId: string | null
  customerName: string
  customerEmail: string
  customerPhone?: string
  address?: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  status: 'Pago' | 'Separando' | 'Enviado' | 'Entregue' | 'Cancelado'
  notes?: string
  createdAt: string
  updatedAt: string
}

const STATUS_OPTIONS: Order['status'][] = ['Pago', 'Separando', 'Enviado', 'Entregue', 'Cancelado']

const statusConfig: Record<string, { icon: typeof Package; color: string; bg: string }> = {
  Pago: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
  Separando: { icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
  Enviado: { icon: Truck, color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/30' },
  Entregue: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
  Cancelado: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
}

type FormState = {
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  notes: string
  status: Order['status']
  shipping: number
  items: OrderItem[]
}

const emptyForm: FormState = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  address: '',
  notes: '',
  status: 'Pago',
  shipping: 15,
  items: [],
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'todos' | Order['status']>('todos')

  // Modal
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders', { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Erro ao carregar pedidos')
      } else {
        setOrders(data.orders || [])
        setError('')
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

  const filtered = useMemo(() => {
    if (filter === 'todos') return orders
    return orders.filter((o) => o.status === filter)
  }, [orders, filter])

  const counts = useMemo(() => {
    const c = { Pago: 0, Separando: 0, Enviado: 0, Entregue: 0, Cancelado: 0 }
    orders.forEach((o) => {
      c[o.status]++
    })
    return c
  }, [orders])

  // ---------- Form helpers ----------

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormError('')
    setShowModal(true)
  }

  const openEdit = (order: Order) => {
    setEditingId(order.id)
    setForm({
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone || '',
      address: order.address || '',
      notes: order.notes || '',
      status: order.status,
      shipping: order.shipping,
      items: order.items.map((i) => ({ ...i })),
    })
    setFormError('')
    setShowModal(true)
  }

  const closeModal = () => {
    if (saving) return
    setShowModal(false)
  }

  const addItemFromCatalog = (productId: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    setForm((f) => {
      const existing = f.items.find((i) => i.productId === productId)
      if (existing) {
        return {
          ...f,
          items: f.items.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return {
        ...f,
        items: [
          ...f.items,
          { productId: product.id, name: product.name, price: product.price, quantity: 1 },
        ],
      }
    })
  }

  const updateItem = (idx: number, patch: Partial<OrderItem>) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    }))
  }

  const removeItem = (idx: number) => {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }))
  }

  const formSubtotal = form.items.reduce((s, i) => s + i.price * i.quantity, 0)
  const formTotal = formSubtotal + Number(form.shipping || 0)

  const handleSave = async () => {
    setFormError('')
    if (!form.customerName.trim()) {
      setFormError('Nome do cliente é obrigatório')
      return
    }
    if (!form.customerEmail.trim()) {
      setFormError('E-mail do cliente é obrigatório')
      return
    }
    if (form.items.length === 0) {
      setFormError('Adicione ao menos 1 item')
      return
    }
    setSaving(true)
    try {
      const payload = {
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        customerPhone: form.customerPhone.trim() || undefined,
        address: form.address.trim() || undefined,
        notes: form.notes.trim() || undefined,
        status: form.status,
        shipping: Number(form.shipping || 0),
        items: form.items,
      }

      const res = editingId
        ? await fetch(`/api/orders/${encodeURIComponent(editingId)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
          })
        : await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
          })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setFormError(data.error || 'Erro ao salvar')
        setSaving(false)
        return
      }
      setShowModal(false)
      setSaving(false)
      load()
    } catch {
      setFormError('Erro de conexão')
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(`Excluir o pedido ${id}? Essa ação não pode ser desfeita.`)) return
    const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) {
      load()
    } else {
      const d = await res.json().catch(() => ({}))
      alert(d.error || 'Falha ao excluir')
    }
  }

  const handleQuickStatus = async (id: string, status: Order['status']) => {
    const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    })
    if (res.ok) load()
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Admin</p>
          <h1 className="text-3xl font-black text-white">Pedidos</h1>
          <p className="mt-1 text-slate-400">{orders.length} pedidos no total</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-5 py-2.5 font-semibold text-slate-950 hover:bg-sky-300"
        >
          <Plus className="h-5 w-5" />
          Novo pedido
        </button>
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {STATUS_OPTIONS.map((s) => {
          const cfg = statusConfig[s]
          const Icon = cfg.icon
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`glass flex items-center gap-3 rounded-2xl p-4 text-left ${
                filter === s ? 'ring-2 ring-sky-400/50' : ''
              }`}
            >
              <Icon className={`h-6 w-6 ${cfg.color}`} />
              <div>
                <p className="text-2xl font-bold text-white">{counts[s]}</p>
                <p className="text-sm text-slate-400">{s}</p>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('todos')}
          className={`rounded-full px-4 py-2 text-sm ${
            filter === 'todos'
              ? 'border border-sky-400/40 bg-sky-400/10 text-sky-200'
              : 'border border-white/10 bg-white/5 text-slate-200 hover:border-sky-400/40 hover:bg-sky-400/10'
          }`}
        >
          Todos ({orders.length})
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-2 text-sm ${
              filter === s
                ? `border ${statusConfig[s].bg} ${statusConfig[s].color}`
                : 'border border-white/10 bg-white/5 text-slate-200 hover:border-sky-400/40 hover:bg-sky-400/10'
            }`}
          >
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-sky-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">
          Nenhum pedido encontrado.
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {filtered.map((order) => {
            const cfg = statusConfig[order.status]
            const StatusIcon = cfg.icon
            return (
              <div key={order.id} className="glass rounded-3xl p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-2xl border p-3 ${cfg.bg}`}>
                      <StatusIcon className={`h-6 w-6 ${cfg.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{order.id}</p>
                      <p className="text-sm text-slate-400">
                        {order.customerName} • {order.customerEmail}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-right">
                      <p className="text-xl font-bold text-sky-300">{formatPrice(order.total)}</p>
                      <select
                        value={order.status}
                        onChange={(e) => handleQuickStatus(order.id, e.target.value as Order['status'])}
                        className={`mt-1 rounded-full border bg-transparent px-3 py-1 text-xs ${cfg.bg} ${cfg.color}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-slate-900 text-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(order)}
                        className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white"
                        aria-label="Editar"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="rounded-full border border-red-400/30 bg-red-400/10 p-2 text-red-300 hover:border-red-400/60 hover:bg-red-400/20"
                        aria-label="Excluir"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="glass max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingId ? `Editar pedido ${editingId}` : 'Novo pedido'}
              </h2>
              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {formError}
              </div>
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
                  Nome do cliente *
                </label>
                <input
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-sky-400/40 focus:outline-none"
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
                  E-mail *
                </label>
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-sky-400/40 focus:outline-none"
                  placeholder="cliente@email.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
                  Telefone
                </label>
                <input
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-sky-400/40 focus:outline-none"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as Order['status'] })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-sky-400/40 focus:outline-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-slate-900">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
                  Endereço
                </label>
                <input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-sky-400/40 focus:outline-none"
                  placeholder="Rua, número, bairro, cidade/UF"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
                  Observações
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-sky-400/40 focus:outline-none"
                  placeholder="Observações internas"
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold text-white">Itens do pedido</h3>
                <select
                  onChange={(e) => {
                    const id = Number(e.target.value)
                    if (id) addItemFromCatalog(id)
                    e.target.value = ''
                  }}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 focus:border-sky-400/40 focus:outline-none"
                  defaultValue=""
                >
                  <option value="" className="bg-slate-900">
                    + Adicionar produto do catálogo
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900">
                      {p.name} — {formatPrice(p.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 space-y-2">
                {form.items.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-slate-400">
                    Nenhum item. Adicione produtos do catálogo acima.
                  </p>
                ) : (
                  form.items.map((it, idx) => (
                    <div
                      key={`${it.productId}-${idx}`}
                      className="grid grid-cols-[1fr_auto_auto_auto] gap-2 rounded-2xl border border-white/10 bg-white/5 p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-white">{it.name}</p>
                        <p className="text-xs text-slate-400">
                          {formatPrice(it.price)} • Subtotal {formatPrice(it.price * it.quantity)}
                        </p>
                      </div>
                      <input
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) =>
                          updateItem(idx, { quantity: Math.max(1, Number(e.target.value) || 1) })
                        }
                        className="w-16 rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-center text-sm text-white"
                      />
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        value={it.price}
                        onChange={(e) => updateItem(idx, { price: Number(e.target.value) || 0 })}
                        className="w-24 rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-center text-sm text-white"
                      />
                      <button
                        onClick={() => removeItem(idx)}
                        className="rounded-full border border-red-400/30 bg-red-400/10 p-2 text-red-300 hover:bg-red-400/20"
                        aria-label="Remover item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(formSubtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Frete</span>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={form.shipping}
                    onChange={(e) => setForm({ ...form, shipping: Number(e.target.value) || 0 })}
                    className="w-24 rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-right text-white"
                  />
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-base font-bold text-white">
                  <span>Total</span>
                  <span className="text-sky-300">{formatPrice(formTotal)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-slate-200 hover:bg-white/10 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-6 py-2.5 font-semibold text-slate-950 hover:bg-sky-300 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : editingId ? (
                  'Salvar alterações'
                ) : (
                  'Criar pedido'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
