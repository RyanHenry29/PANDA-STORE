import Link from 'next/link'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { formatPrice, products, categories, getCategoryName } from '@/lib/site-data'

export default function AdminProdutosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Admin</p>
          <h1 className="text-3xl font-black text-white">Produtos</h1>
          <p className="mt-1 text-slate-400">{products.length} produtos cadastrados</p>
        </div>
        <button className="inline-flex items-center gap-2 self-start rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950 hover:bg-sky-300">
          <Plus className="h-4 w-4" />
          Novo produto
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button className="rounded-full border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-sm text-sky-200">
          Todos ({products.length})
        </button>
        {categories.map((cat) => {
          const count = products.filter(p => p.category === cat.slug).length
          return (
            <button key={cat.slug} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:border-sky-400/40 hover:bg-sky-400/10">
              {cat.name} ({count})
            </button>
          )
        })}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="glass rounded-[1.5rem] p-5">
            <div className="mb-4 h-32 rounded-2xl bg-gradient-to-br from-sky-500/30 via-slate-900 to-black" />
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-white line-clamp-1">{product.name}</p>
              <span className="shrink-0 rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-1 text-xs text-sky-200">{product.badge}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{getCategoryName(product.category)}</p>
            <p className="mt-2 text-sm text-slate-400 line-clamp-2">{product.description}</p>
            {product.puffs && (
              <p className="mt-2 text-xs text-slate-500">{product.puffs.toLocaleString()} puffs · Nicotina {product.nicotina}</p>
            )}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-lg font-black text-sky-300">{formatPrice(product.price)}</p>
              <div className="flex gap-2">
                <button className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-300">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
