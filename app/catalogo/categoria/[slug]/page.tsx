import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { formatPrice, getCategoryName, getProductsByCategory, categories } from '@/lib/site-data'

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const items = getProductsByCategory(slug)
  const category = categories.find((c) => c.slug === slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <Link href="/catalogo" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Voltar ao catálogo
      </Link>

      <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Categoria</p>
      <h1 className="text-3xl font-black text-white">{category.name}</h1>
      <p className="mt-2 text-slate-400">{category.description}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/catalogo/categoria/${cat.slug}`}
            className={`rounded-full px-4 py-2 text-sm ${
              cat.slug === slug
                ? 'border border-sky-400/40 bg-sky-400/10 text-sky-200'
                : 'border border-white/10 bg-white/5 text-slate-200 hover:border-sky-400/40 hover:bg-sky-400/10'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-slate-400">Nenhum produto encontrado nesta categoria.</p>
          <Link href="/catalogo" className="mt-4 inline-block text-sky-300 hover:text-sky-200">
            Ver todos os produtos
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <Link key={product.id} href={`/catalogo/produto/${product.id}`} className="glass rounded-[1.5rem] p-5 hover:-translate-y-1">
              <div className="relative mb-4 h-36 rounded-2xl bg-gradient-to-br from-sky-500/30 via-slate-900 to-black">
                <span className="absolute left-3 top-3 rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-1 text-xs text-sky-200">
                  {product.badge}
                </span>
              </div>
              <p className="font-semibold text-white line-clamp-1">{product.name}</p>
              <p className="mt-1 text-sm text-slate-400 line-clamp-2">{product.description}</p>
              {product.puffs && (
                <p className="mt-2 text-xs text-slate-500">{product.puffs.toLocaleString()} puffs · Nicotina {product.nicotina}</p>
              )}
              <p className="mt-3 text-xl font-black text-sky-300">{formatPrice(product.price)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
