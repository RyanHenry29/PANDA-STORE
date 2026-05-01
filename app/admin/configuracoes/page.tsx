import { Store, Palette, Bell, Shield, Truck, CreditCard, Save, ToggleLeft, ToggleRight } from 'lucide-react'

export default function AdminConfiguracoesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Admin</p>
      <h1 className="text-3xl font-black text-white">Configuracoes</h1>
      <p className="mt-1 text-slate-400">Gerencie as configuracoes da sua loja</p>

      <div className="mt-8 space-y-6">
        <div className="glass rounded-[1.75rem] p-6">
          <div className="flex items-center gap-3">
            <Store className="h-6 w-6 text-sky-400" />
            <h2 className="text-lg font-semibold text-white">Informacoes da Loja</h2>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-400">Nome da Loja</label>
              <input 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500"
                defaultValue="Panda Store"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-400">E-mail de Contato</label>
              <input 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500"
                defaultValue="contato@pandastore.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-400">Telefone</label>
              <input 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500"
                defaultValue="(11) 99999-9999"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-400">WhatsApp</label>
              <input 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500"
                defaultValue="(11) 99999-9999"
              />
            </div>
          </div>
        </div>

        <div className="glass rounded-[1.75rem] p-6">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Configuracoes de Entrega</h2>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="font-medium text-white">Frete gratis acima de R$ 200</p>
                <p className="text-sm text-slate-400">Oferecer frete gratis para pedidos acima desse valor</p>
              </div>
              <ToggleRight className="h-8 w-8 text-sky-400" />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="font-medium text-white">Embalagem discreta</p>
                <p className="text-sm text-slate-400">Enviar todos os pedidos em embalagem sem identificacao</p>
              </div>
              <ToggleRight className="h-8 w-8 text-sky-400" />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="font-medium text-white">Envio expresso</p>
                <p className="text-sm text-slate-400">Priorizar envio rapido para todas as regioes</p>
              </div>
              <ToggleLeft className="h-8 w-8 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="glass rounded-[1.75rem] p-6">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">Notificacoes</h2>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="font-medium text-white">Alerta de estoque baixo</p>
                <p className="text-sm text-slate-400">Receber alerta quando estoque estiver abaixo do minimo</p>
              </div>
              <ToggleRight className="h-8 w-8 text-sky-400" />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="font-medium text-white">Novos pedidos</p>
                <p className="text-sm text-slate-400">Notificar a cada novo pedido recebido</p>
              </div>
              <ToggleRight className="h-8 w-8 text-sky-400" />
            </div>
          </div>
        </div>

        <div className="glass rounded-[1.75rem] p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">Status do Sistema</h2>
          </div>
          <div className="mt-4 space-y-3 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Tema Panda Store ativado
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Sistema de pedidos operacional
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Pronto para conectar ao banco de dados
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Logo oficial aplicada
            </div>
          </div>
        </div>

        <button className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-6 py-3 font-semibold text-slate-950 hover:bg-sky-300">
          <Save className="h-5 w-5" />
          Salvar configuracoes
        </button>
      </div>
    </div>
  )
}
