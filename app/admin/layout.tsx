'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'

const adminLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/produtos', label: 'Produtos' },
  { href: '/admin/pedidos', label: 'Pedidos' },
  { href: '/admin/clientes', label: 'Clientes' },
  { href: '/admin/estoque', label: 'Estoque' },
  { href: '/admin/notificacoes', label: 'Notificacoes' },
  { href: '/admin/configuracoes', label: 'Configuracoes' },
]

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/auth/admin-login')
    router.refresh()
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {adminLinks.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:border-sky-400/40 hover:bg-sky-400/10">
                {item.label}
              </Link>
            ))}
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm text-red-300 hover:border-red-400/50 hover:bg-red-400/20"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>
      {children}
    </SiteShell>
  )
}
