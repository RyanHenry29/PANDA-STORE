import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { categories, formatPrice, products } from '@/lib/site-data'

export default function CatalogoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Catálogo</p>
          <h1 className="text-3xl font-black text-white">Todos os Pods e Acessórios</h1>
        </div>
        <Link href="/catalogo/carrinho" className="inline-flex items-center gap-2 self-start rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950 hover:bg-sky-300">
          <ShoppingBag className="h-4 w-4" />
          Ver carrinho
        </Link>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <Link href="/catalogo" className="rounded-full border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-sm text-sky-200">
          Todos
        </Link>
        {categories.map((category) => (
          <Link key={category.slug} href={`/catalogo/categoria/${category.slug}`} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:border-sky-400/40 hover:bg-sky-400/10">
            {category.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Link key={product.id} href={`/catalogo/produto/${product.id}`} className="glass rounded-[1.5rem] p-5 hover:-translate-y-1">
            <div className="mb-4 h-40 rounded-2xl bg-gradient-to-br from-sky-500/30 via-slate-900 to-black" />
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-white line-clamp-1">{product.name}</p>
              <span className="shrink-0 rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-1 text-xs text-sky-200">{product.badge}</span>
            </div>
            <p className="mt-2 text-sm text-slate-400 line-clamp-2">{product.description}</p>
            {product.puffs && (
              <p className="mt-2 text-xs text-slate-500">{product.puffs.toLocaleString()} puffs · Nicotina {product.nicotina}</p>
            )}
            <p className="mt-3 text-xl font-black text-sky-300">{formatPrice(product.price)}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
