import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ShoppingCart, Heart, ArrowLeft, Zap, Droplets, Shield } from 'lucide-react'
import { formatPrice, getProductById, getCategoryName, products } from '@/lib/site-data'

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <Link href="/catalogo" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Voltar ao catálogo
      </Link>

      <div className="glass grid gap-8 rounded-[2rem] p-6 md:grid-cols-[0.95fr_1.05fr] md:p-10">
        <div className="relative h-[360px] rounded-[1.75rem] bg-gradient-to-br from-sky-500/30 via-slate-900 to-black">
          <span className="absolute left-4 top-4 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs text-sky-200">
            {product.badge}
          </span>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">{getCategoryName(product.category)}</p>
          <h1 className="mt-2 text-3xl font-black text-white">{product.name}</h1>
          
          <p className="mt-4 text-slate-300">{product.description}</p>

          {(product.puffs || product.nicotina) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {product.puffs && (
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                  <Zap className="h-4 w-4 text-sky-400" />
                  <span className="text-sm text-slate-300">{product.puffs.toLocaleString()} puffs</span>
                </div>
              )}
              {product.nicotina && (
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                  <Droplets className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-slate-300">Nicotina {product.nicotina}</span>
                </div>
              )}
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                <Shield className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-slate-300">Original</span>
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm text-slate-500">Preço</p>
            <p className="text-3xl font-black text-sky-300">{formatPrice(product.price)}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-6 py-3 font-semibold text-slate-950 hover:bg-sky-300">
              <ShoppingCart className="h-5 w-5" />
              Adicionar ao carrinho
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white hover:bg-white/10">
              <Heart className="h-5 w-5" />
              Favoritar
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white">Produtos relacionados</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((item) => (
              <Link key={item.id} href={`/catalogo/produto/${item.id}`} className="glass rounded-[1.5rem] p-5 hover:-translate-y-1">
                <div className="mb-4 h-32 rounded-2xl bg-gradient-to-br from-sky-500/30 via-slate-900 to-black" />
                <p className="font-semibold text-white line-clamp-1">{item.name}</p>
                <p className="mt-1 text-sm text-slate-400 line-clamp-1">{item.description}</p>
                <p className="mt-3 text-lg font-bold text-sky-300">{formatPrice(item.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
