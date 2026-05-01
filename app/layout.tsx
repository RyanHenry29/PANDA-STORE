import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Panda Store - Pods e Vapes Premium',
  description: 'Panda Store - Os melhores pods descartáveis, recarregáveis, essências e acessórios. Entrega rápida e discreta em todo Brasil.',
  icons: {
    icon: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  keywords: ['pods', 'vapes', 'pod descartável', 'ignite', 'elfbar', 'essências', 'vape shop'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  )
}
