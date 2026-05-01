import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield, Truck } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'
import { categories, products, stats, formatPrice } from '@/lib/site-data'

export default function HomePage() {
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-6 md:py-20">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-200">
            <Sparkles className="h-4 w-4" />
            Panda Store - Sua loja de Pods
          </span>
          <h1 className="max-w-2xl text-4xl font-black leading-tight text-white md:text-6xl">
            Os melhores Pods e Vapes com entrega expressa.
          </h1>
          <p className="max-w-xl text-lg text-slate-300">
            Descartáveis, recarregáveis, essências e acessórios das melhores marcas. Qualidade garantida e preços imbatíveis.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/catalogo" className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-6 py-3 font-semibold text-slate-950 hover:bg-sky-300">
              Ver catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/auth/login" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white hover:bg-white/10">
              Entrar na conta
            </Link>
          </div>
          <div className="grid gap-4 pt-4 sm:grid-cols-3">
            {stats.slice(0, 3).map((item) => (
              <div key={item.label} className="glass rounded-3xl p-4">
                <p className="text-2xl font-bold text-white">{item.value}</p>
                <p className="text-sm text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-sky-500/20 blur-3xl" />
          <div className="glass overflow-hidden rounded-[2rem] p-6">
            <Image
              src="/panda-logo.png"
              alt="Panda Store"
              width={900}
              height={900}
              className="h-[420px] w-full rounded-[1.5rem] object-cover"
              priority
            />
            <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-sm text-slate-400">Destaque da semana</p>
                <p className="text-lg font-semibold">{products[0].name}</p>
              </div>
              <p className="text-right text-xl font-black text-sky-300">{formatPrice(products[0].price)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 md:px-6">
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="glass rounded-3xl p-5">
              <p className="text-3xl font-black text-white">{item.value}</p>
              <p className="mt-2 text-sm text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 md:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Categorias</p>
            <h2 className="text-2xl font-bold text-white">Encontre o Pod perfeito para você</h2>
          </div>
          <Link href="/catalogo" className="text-sm text-sky-300 hover:text-sky-200">
            Ver todos
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.slug} href={`/catalogo/categoria/${category.slug}`} className="glass rounded-3xl p-5 hover:-translate-y-1">
              <p className="text-lg font-semibold text-white">{category.name}</p>
              <p className="mt-2 text-sm text-slate-400">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Mais vendidos</p>
          <h2 className="text-2xl font-bold text-white">Os favoritos dos nossos clientes</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {products.filter((item) => item.featured).map((product) => (
            <Link key={product.id} href={`/catalogo/produto/${product.id}`} className="glass rounded-[1.5rem] p-5 hover:-translate-y-1">
              <div className="mb-4 h-36 rounded-2xl bg-gradient-to-br from-sky-500/30 via-slate-900 to-black" />
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-white line-clamp-1">{product.name}</p>
                <span className="shrink-0 rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-1 text-xs text-sky-200">{product.badge}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400 line-clamp-2">{product.description}</p>
              {product.puffs && (
                <p className="mt-2 text-xs text-slate-500">{product.puffs.toLocaleString()} puffs</p>
              )}
              <p className="mt-3 text-lg font-bold text-sky-300">{formatPrice(product.price)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="glass grid gap-6 rounded-[2rem] p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Por que escolher a Panda Store?</p>
            <h2 className="mt-3 text-3xl font-black text-white">Qualidade, variedade e confiança em cada pedido.</h2>
            <p className="mt-4 max-w-xl text-slate-300">
              Trabalhamos apenas com produtos originais das melhores marcas do mercado. Sua satisfação é nossa prioridade.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300">
              <Zap className="h-5 w-5 text-sky-400" />
              Produtos 100% originais
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300">
              <Truck className="h-5 w-5 text-sky-400" />
              Entrega rápida e discreta
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300">
              <Shield className="h-5 w-5 text-sky-400" />
              Garantia em todos os produtos
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300">
              <Sparkles className="h-5 w-5 text-sky-400" />
              Atendimento personalizado
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
