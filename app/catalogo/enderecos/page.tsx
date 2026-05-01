import { addresses } from '@/lib/site-data'

export default function EnderecosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Endereços</p>
      <h1 className="text-3xl font-black text-white">Locais salvos</h1>

      <div className="mt-8 space-y-4">
        {addresses.map((address) => (
          <div key={address} className="glass rounded-3xl p-5 text-slate-200">
            {address}
          </div>
        ))}
      </div>
    </div>
  )
}
