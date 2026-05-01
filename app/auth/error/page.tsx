import Link from 'next/link'

export default function ErrorPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-md flex-col justify-center px-4 py-12 text-center md:px-6">
      <div className="glass rounded-[2rem] p-8">
        <h1 className="text-3xl font-black text-white">Algo deu errado</h1>
        <p className="mt-3 text-slate-400">A autenticação antiga do back-end antigo foi removida.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950 hover:bg-sky-300">
          Voltar para a home
        </Link>
      </div>
    </div>
  )
}
