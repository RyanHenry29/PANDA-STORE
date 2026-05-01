import Link from 'next/link'
import { Heart } from 'lucide-react'
import { products } from '@/lib/site-data'

export default function FavoritosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="flex items-center gap-3">
        <Heart className="h-6 w-6 text-sky-300" />
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Favoritos</p>
          <h1 className="text-3xl font-black text-white">Seus produtos salvos</h1>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {products.slice(0, 4).map((item) => (
          <Link key={item.id} href={`/catalogo/produto/${item.id}`} className="glass rounded-[1.5rem] p-5">
            <p className="text-lg font-semibold text-white">{item.name}</p>
            <p className="mt-2 text-sm text-slate-400">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
