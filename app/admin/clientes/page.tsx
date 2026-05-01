import { Users, Mail, Phone, ShoppingBag, Search, UserPlus } from 'lucide-react'
import { clients } from '@/lib/site-data'

export default function AdminClientesPage() {
  const totalOrders = clients.reduce((sum, c) => sum + c.orders, 0)
  
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Admin</p>
          <h1 className="text-3xl font-black text-white">Clientes</h1>
          <p className="mt-1 text-slate-400">{clients.length} clientes cadastrados</p>
        </div>
        <button className="inline-flex items-center gap-2 self-start rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950 hover:bg-sky-300">
          <UserPlus className="h-4 w-4" />
          Novo cliente
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-sky-400" />
            <div>
              <p className="text-2xl font-bold text-white">{clients.length}</p>
              <p className="text-sm text-slate-400">Total de clientes</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold text-white">{totalOrders}</p>
              <p className="text-sm text-slate-400">Pedidos totais</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-violet-400" />
            <div>
              <p className="text-2xl font-bold text-white">{(totalOrders / clients.length).toFixed(1)}</p>
              <p className="text-sm text-slate-400">Média por cliente</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input 
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-slate-500"
            placeholder="Buscar por nome, e-mail ou telefone..."
          />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {clients.map((client) => (
          <div key={client.email} className="glass rounded-3xl p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-400/10 text-lg font-bold text-sky-300">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{client.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {client.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {client.phone}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                  {client.orders} pedidos
                </span>
                <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white">
                  Ver detalhes
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
