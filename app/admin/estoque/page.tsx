import { Package, AlertTriangle, CheckCircle, TrendingDown, Plus, Minus } from 'lucide-react'
import { products, formatPrice, getCategoryName } from '@/lib/site-data'

// Simulated stock data
const stockData = products.map((product, index) => ({
  ...product,
  stock: Math.max(2, 30 - index * 3),
  minStock: 10,
}))

export default function AdminEstoquePage() {
  const lowStock = stockData.filter(p => p.stock <= p.minStock)
  const normalStock = stockData.filter(p => p.stock > p.minStock)
  const totalItems = stockData.reduce((sum, p) => sum + p.stock, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Admin</p>
      <h1 className="text-3xl font-black text-white">Controle de Estoque</h1>
      <p className="mt-1 text-slate-400">Monitore e gerencie o estoque de produtos</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-sky-400" />
            <div>
              <p className="text-2xl font-bold text-white">{totalItems}</p>
              <p className="text-sm text-slate-400">Itens em estoque</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold text-white">{normalStock.length}</p>
              <p className="text-sm text-slate-400">Estoque normal</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
            <div>
              <p className="text-2xl font-bold text-white">{lowStock.length}</p>
              <p className="text-sm text-slate-400">Estoque baixo</p>
            </div>
          </div>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Produtos com estoque baixo</h2>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lowStock.map((product) => (
              <div key={product.id} className="glass rounded-2xl border border-amber-400/20 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-white">{product.name}</p>
                    <p className="text-xs text-slate-500">{getCategoryName(product.category)}</p>
                  </div>
                  <TrendingDown className="h-5 w-5 text-amber-400" />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-amber-400">{product.stock}</p>
                    <p className="text-xs text-slate-500">unidades</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-sky-400/40 hover:bg-sky-400/10">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white">Todos os produtos</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stockData.map((product) => {
            const isLow = product.stock <= product.minStock
            return (
              <div key={product.id} className="glass rounded-2xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-white line-clamp-1">{product.name}</p>
                    <p className="text-xs text-slate-500">{getCategoryName(product.category)}</p>
                    <p className="mt-1 text-sm text-sky-300">{formatPrice(product.price)}</p>
                  </div>
                  {isLow ? (
                    <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-xs text-amber-300">Baixo</span>
                  ) : (
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300">OK</span>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className={`text-2xl font-bold ${isLow ? 'text-amber-400' : 'text-white'}`}>{product.stock}</p>
                    <p className="text-xs text-slate-500">em estoque (min: {product.minStock})</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-red-400/40 hover:bg-red-400/10">
                      <Minus className="h-4 w-4" />
                    </button>
                    <button className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-sky-400/40 hover:bg-sky-400/10">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
