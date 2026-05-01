import { Bell, AlertTriangle, ShoppingCart, Heart, Package, Check, Trash2 } from 'lucide-react'
import { notifications } from '@/lib/site-data'

const allNotifications = [
  { id: 1, type: 'order', message: 'Novo pedido #PD-2042 de Lucas Martins', time: '5 min', read: false },
  { id: 2, type: 'stock', message: 'Estoque do Ignite V80 Frutas Vermelhas esta baixo (5 unidades)', time: '15 min', read: false },
  { id: 3, type: 'favorite', message: 'Um cliente salvou 4 produtos nos favoritos', time: '30 min', read: false },
  { id: 4, type: 'stock', message: 'Elfbar BC5000 Mango Ice esgotando em breve', time: '1h', read: true },
  { id: 5, type: 'order', message: 'Pedido #PD-2041 foi marcado como enviado', time: '2h', read: true },
  { id: 6, type: 'order', message: 'Pedido #PD-2040 foi entregue com sucesso', time: '3h', read: true },
]

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  order: { icon: ShoppingCart, color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-400/30' },
  stock: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
  favorite: { icon: Heart, color: 'text-pink-400', bg: 'bg-pink-400/10 border-pink-400/30' },
}

export default function AdminNotificacoesPage() {
  const unreadCount = allNotifications.filter(n => !n.read).length

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Admin</p>
          <h1 className="text-3xl font-black text-white">Notificacoes</h1>
          <p className="mt-1 text-slate-400">{unreadCount} notificacoes nao lidas</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white">
            <Check className="h-4 w-4" />
            Marcar todas como lidas
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button className="rounded-full border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-sm text-sky-200">
          Todas ({allNotifications.length})
        </button>
        <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:border-sky-400/40 hover:bg-sky-400/10">
          Nao lidas ({unreadCount})
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {allNotifications.map((item) => {
          const config = typeConfig[item.type] || typeConfig.order
          const Icon = config.icon
          return (
            <div key={item.id} className={`glass rounded-3xl p-5 ${!item.read ? 'border-l-4 border-l-sky-400' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`rounded-2xl border p-3 ${config.bg}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div>
                    <p className={`${!item.read ? 'font-semibold text-white' : 'text-slate-300'}`}>{item.message}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.time} atras</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!item.read && (
                    <span className="h-2 w-2 rounded-full bg-sky-400" />
                  )}
                  <button className="rounded-full p-1 text-slate-500 hover:bg-red-400/10 hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
