'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Package, Truck, Mail } from 'lucide-react'

function PedidoConfirmadoContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('id') || '#PD-XXXX'

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center md:px-6">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
        <CheckCircle2 className="h-12 w-12 text-emerald-400" />
      </div>

      <h1 className="mt-6 text-4xl font-black text-white">Pedido confirmado!</h1>
      <p className="mt-2 text-lg text-sky-300">{orderNumber}</p>
      <p className="mt-3 max-w-xl text-slate-300">
        Obrigado por comprar na Panda Store! Seu pedido foi recebido e está sendo preparado.
      </p>

      <div className="mt-8 w-full max-w-md">
        <div className="glass rounded-[1.75rem] p-6">
          <h2 className="text-lg font-semibold text-white">Próximos passos</h2>
          <div className="mt-4 space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 p-2">
                <Mail className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-white">Confirmação por e-mail</p>
                <p className="text-sm text-slate-400">Você receberá um e-mail com os detalhes do pedido</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full border border-blue-400/30 bg-blue-400/10 p-2">
                <Package className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-white">Preparação</p>
                <p className="text-sm text-slate-400">Seu pedido será separado e embalado com cuidado</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full border border-violet-400/30 bg-violet-400/10 p-2">
                <Truck className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <p className="font-medium text-white">Envio discreto</p>
                <p className="text-sm text-slate-400">Entrega rápida e embalagem discreta em todo Brasil</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/catalogo/meus-pedidos"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white hover:bg-white/10"
        >
          <Package className="h-5 w-5" />
          Ver meus pedidos
        </Link>
        <Link href="/catalogo" className="rounded-full bg-sky-400 px-6 py-3 font-semibold text-slate-950 hover:bg-sky-300">
          Continuar comprando
        </Link>
      </div>
    </div>
  )
}

export default function PedidoConfirmadoPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-slate-400">Carregando...</div>}>
      <PedidoConfirmadoContent />
    </Suspense>
  )
}
