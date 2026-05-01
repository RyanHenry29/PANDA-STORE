'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { AlertCircle, Loader2 } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/catalogo/minha-conta'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Erro ao fazer login')
        setLoading(false)
        return
      }
      // Reload completo para garantir cookie disponível em SSR
      window.location.href = redirect
    } catch {
      setError('Erro de conexão. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="glass rounded-[2rem] p-8">
      <div className="mb-6 flex justify-center">
        <Image src="/panda-logo.png" alt="Panda Store" width={64} height={64} className="rounded-2xl" />
      </div>
      <p className="text-center text-sm uppercase tracking-[0.3em] text-sky-300/70">Panda Store</p>
      <h1 className="mt-2 text-center text-3xl font-black text-white">Entrar na sua conta</h1>
      <p className="mt-2 text-center text-slate-400">Acesse para ver seus pedidos e favoritos</p>

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-300">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400/40 focus:outline-none focus:ring-1 focus:ring-sky-400/40"
            placeholder="seu@email.com"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-300">Senha</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400/40 focus:outline-none focus:ring-1 focus:ring-sky-400/40"
            placeholder="Sua senha"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950 hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Não tem conta?{' '}
        <Link href="/auth/cadastro" className="text-sky-300 hover:text-sky-200">
          Criar agora
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-slate-500">
        Acesso administrativo? <Link href="/auth/admin-login" className="text-amber-300/80 hover:text-amber-200">Entrar como admin</Link>
      </p>
    </div>
  )
}

function LoginFallback() {
  return (
    <div className="glass flex items-center justify-center rounded-[2rem] p-8">
      <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <SiteShell>
      <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md flex-col justify-center px-4 py-12 md:px-6">
        <Suspense fallback={<LoginFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </SiteShell>
  )
}
