'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShoppingBag,
  Zap,
  Truck,
  Shield,
  Menu,
  X,
  LogIn,
  User as UserIcon,
} from 'lucide-react'

const navItems = [
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/catalogo/carrinho', label: 'Carrinho' },
  { href: '/catalogo/favoritos', label: 'Favoritos' },
]

type Me = { id: string; name: string; email: string } | null

export function SiteShell({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [me, setMe] = useState<Me>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setMe(data.user)
        }
      } finally {
        setChecked(true)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b14]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <Image
              src="/panda-logo.png"
              alt="Panda Store"
              width={54}
              height={54}
              className="h-12 w-12 rounded-2xl object-cover shadow-lg shadow-blue-500/20"
              priority
            />
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">Panda Store</p>
              <p className="hidden text-sm text-slate-300 sm:block">Pods e Vapes Premium</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            {checked && me ? (
              <Link
                href="/catalogo/minha-conta"
                className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-200 hover:bg-sky-400/20"
              >
                <UserIcon className="h-4 w-4" />
                {me.name.split(' ')[0]}
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white"
              >
                <LogIn className="h-4 w-4" />
                Entrar
              </Link>
            )}
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-slate-200 hover:border-sky-400/40 hover:bg-sky-400/10 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#070b14]/95 backdrop-blur-xl md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              {checked && me ? (
                <Link
                  href="/catalogo/minha-conta"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-sm text-sky-200"
                >
                  Minha conta ({me.name.split(' ')[0]})
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:border-sky-400/40 hover:bg-sky-400/10"
                >
                  Entrar
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-2 md:px-6">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/panda-logo.png" alt="Panda Store" width={42} height={42} className="rounded-xl object-cover" />
              <div>
                <p className="font-semibold">Panda Store</p>
                <p className="text-sm text-slate-400">Sua loja de Pods e Vapes de confiança.</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">Venda proibida para menores de 18 anos.</p>
          </div>
          <div className="grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-sky-300" /> Produtos originais
            </p>
            <p className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-sky-300" /> Catálogo completo
            </p>
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-sky-300" /> Entrega rápida
            </p>
            <p className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-sky-300" /> Garantia em tudo
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
