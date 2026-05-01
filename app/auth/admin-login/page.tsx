'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Shield, Loader2, AlertCircle } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'

function AdminLoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(data.error || 'Erro ao fazer login')
        setLoading(false)
        return
      }

      // Força recarregamento completo para garantir que o cookie seja enviado
      window.location.href = redirect
    } catch {
      setError('Erro de conexao. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="glass rounded-[2rem] p-8">
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10">
          <Shield className="h-8 w-8 text-amber-400" />
        </div>
      </div>
      <p className="text-center text-sm uppercase tracking-[0.3em] text-amber-300/70">Acesso Restrito</p>
      <h1 className="mt-2 text-center text-3xl font-black text-white">Painel Administrativo</h1>
      <p className="mt-2 text-center text-slate-400">Acesso exclusivo para administradores da Panda Store</p>

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-300">E-mail do administrador</label>
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-amber-400/40 focus:outline-none focus:ring-1 focus:ring-amber-400/40"
            placeholder="admin@pandastore.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-300">Senha</label>
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-amber-400/40 focus:outline-none focus:ring-1 focus:ring-amber-400/40"
            placeholder="Senha de administrador"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Entrando...
            </>
          ) : (
            'Acessar painel'
          )}
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400">
        <p className="font-semibold text-slate-300">Credenciais de acesso:</p>
        <p className="mt-1">E-mail: admin@pandastore.com</p>
        <p>Senha: admin123</p>
      </div>

      <div className="mt-6 flex items-center justify-center text-sm">
        <Link href="/" className="text-slate-400 hover:text-white">Voltar ao site</Link>
      </div>
    </div>
  )
}

function AdminLoginFallback() {
  return (
    <div className="glass flex items-center justify-center rounded-[2rem] p-8">
      <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <SiteShell>
      <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md flex-col justify-center px-4 py-12 md:px-6">
        <Suspense fallback={<AdminLoginFallback />}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </SiteShell>
  )
}
