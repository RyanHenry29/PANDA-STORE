'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'

export default function CadastroPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Erro ao criar conta')
        setLoading(false)
        return
      }
      setSuccess(true)
      // Já autenticado pelo backend (cookie definido). Redireciona para minha-conta.
      setTimeout(() => {
        window.location.href = '/catalogo/minha-conta'
      }, 600)
    } catch {
      setError('Erro de conexão. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <SiteShell>
      <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md flex-col justify-center px-4 py-12 md:px-6">
        <div className="glass rounded-[2rem] p-8">
          <div className="mb-6 flex justify-center">
            <Image src="/panda-logo.png" alt="Panda Store" width={64} height={64} className="rounded-2xl" />
          </div>
          <p className="text-center text-sm uppercase tracking-[0.3em] text-sky-300/70">Cadastro</p>
          <h1 className="mt-2 text-center text-3xl font-black text-white">Criar conta</h1>
          <p className="mt-2 text-center text-slate-400">Faça parte da Panda Store</p>

          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Conta criada com sucesso! Redirecionando...
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Nome completo</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400/40 focus:outline-none focus:ring-1 focus:ring-sky-400/40"
                placeholder="Seu nome"
              />
            </div>
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
              <label className="mb-2 block text-sm text-slate-300">Telefone (opcional)</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400/40 focus:outline-none focus:ring-1 focus:ring-sky-400/40"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Senha</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400/40 focus:outline-none focus:ring-1 focus:ring-sky-400/40"
                placeholder="Mínimo 6 caracteres"
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
                  Criando...
                </>
              ) : (
                'Cadastrar'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Já tem conta?{' '}
            <Link href="/auth/login" className="text-sky-300 hover:text-sky-200">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </SiteShell>
  )
}
