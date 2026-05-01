import { SiteShell } from '@/components/site-shell'

export default function CatalogoLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <SiteShell>{children}</SiteShell>
}
