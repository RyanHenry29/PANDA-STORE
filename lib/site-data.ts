export type Product = {
  id: number
  name: string
  slug: string
  category: string
  price: number
  badge: string
  description: string
  puffs?: number
  nicotina?: string
  featured?: boolean
}

export const categories = [
  { slug: 'pods-descartaveis', name: 'Pods Descartáveis', description: 'Praticidade e sabor em cada puff' },
  { slug: 'pods-recarregaveis', name: 'Pods Recarregáveis', description: 'Economia e personalização' },
  { slug: 'essencias', name: 'Essências', description: 'Sabores para todos os gostos' },
  { slug: 'acessorios', name: 'Acessórios', description: 'Cases, carregadores e mais' },
]

export const products: Product[] = [
  {
    id: 1,
    name: 'Ignite V80 Frutas Vermelhas',
    slug: 'ignite-v80-frutas-vermelhas',
    category: 'pods-descartaveis',
    price: 89.90,
    badge: 'Mais vendido',
    description: 'Pod descartável com 8000 puffs, sabor frutas vermelhas intenso.',
    puffs: 8000,
    nicotina: '5%',
    featured: true,
  },
  {
    id: 2,
    name: 'Elfbar BC5000 Mango Ice',
    slug: 'elfbar-bc5000-mango-ice',
    category: 'pods-descartaveis',
    price: 79.90,
    badge: 'Top 3',
    description: 'Sabor manga gelada com 5000 puffs de duração.',
    puffs: 5000,
    nicotina: '5%',
    featured: true,
  },
  {
    id: 3,
    name: 'Lost Mary OS5000 Uva',
    slug: 'lost-mary-os5000-uva',
    category: 'pods-descartaveis',
    price: 74.90,
    badge: 'Novo',
    description: 'Design compacto com sabor uva refrescante.',
    puffs: 5000,
    nicotina: '5%',
  },
  {
    id: 4,
    name: 'Vaporesso XROS 3 Kit',
    slug: 'vaporesso-xros-3-kit',
    category: 'pods-recarregaveis',
    price: 189.90,
    badge: 'Premium',
    description: 'Kit completo recarregável com bateria de longa duração.',
    featured: true,
  },
  {
    id: 5,
    name: 'SMOK Nord 5 Kit',
    slug: 'smok-nord-5-kit',
    category: 'pods-recarregaveis',
    price: 219.90,
    badge: 'Potente',
    description: 'Pod system com 2000mAh e tela OLED integrada.',
  },
  {
    id: 6,
    name: 'Essência Mentol Ice 30ml',
    slug: 'essencia-mentol-ice-30ml',
    category: 'essencias',
    price: 49.90,
    badge: 'Refrescante',
    description: 'Líquido premium com intenso frescor mentolado.',
    nicotina: '3%',
  },
  {
    id: 7,
    name: 'Essência Tobacco Classic 30ml',
    slug: 'essencia-tobacco-classic-30ml',
    category: 'essencias',
    price: 44.90,
    badge: 'Clássico',
    description: 'Sabor tradicional de tabaco para quem busca autenticidade.',
    nicotina: '6%',
  },
  {
    id: 8,
    name: 'Case Protetor Universal',
    slug: 'case-protetor-universal',
    category: 'acessorios',
    price: 29.90,
    badge: 'Proteção',
    description: 'Case de silicone compatível com a maioria dos pods.',
  },
  {
    id: 9,
    name: 'Carregador USB-C Rápido',
    slug: 'carregador-usb-c-rapido',
    category: 'acessorios',
    price: 34.90,
    badge: 'Essencial',
    description: 'Carregador compacto com carga rápida para pods.',
  },
  {
    id: 10,
    name: 'Ignite V150 Blueberry',
    slug: 'ignite-v150-blueberry',
    category: 'pods-descartaveis',
    price: 129.90,
    badge: 'Lançamento',
    description: 'Super pod com 15000 puffs e sabor mirtilo.',
    puffs: 15000,
    nicotina: '5%',
    featured: true,
  },
]

export const stats = [
  { label: 'Pedidos entregues', value: '3.2k+' },
  { label: 'Avaliação média', value: '4.9/5' },
  { label: 'Produtos em estoque', value: '250+' },
  { label: 'Clientes satisfeitos', value: '1.8k+' },
]

export const recentOrders = [
  { id: '#PD-2042', customer: 'Lucas Martins', total: 'R$ 179,90', status: 'Pago', items: 'Ignite V80 x2' },
  { id: '#PD-2041', customer: 'Ana Costa', total: 'R$ 89,90', status: 'Separando', items: 'Elfbar BC5000' },
  { id: '#PD-2040', customer: 'João Silva', total: 'R$ 259,90', status: 'Enviado', items: 'SMOK Nord 5 Kit' },
  { id: '#PD-2039', customer: 'Maria Oliveira', total: 'R$ 149,80', status: 'Entregue', items: 'Lost Mary x2' },
  { id: '#PD-2038', customer: 'Pedro Santos', total: 'R$ 219,90', status: 'Pago', items: 'Vaporesso XROS 3' },
]

export const clients = [
  { name: 'Lucas Martins', email: 'lucas@email.com', phone: '(11) 99999-1111', orders: 8 },
  { name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 98888-2222', orders: 5 },
  { name: 'João Silva', email: 'joao@email.com', phone: '(11) 97777-3333', orders: 12 },
  { name: 'Maria Oliveira', email: 'maria@email.com', phone: '(21) 96666-4444', orders: 3 },
  { name: 'Pedro Santos', email: 'pedro@email.com', phone: '(31) 95555-5555', orders: 6 },
]

export const notifications = [
  'Novo pedido #PD-2042 aguardando separação.',
  'Estoque do Ignite V80 Frutas Vermelhas está baixo (5 unidades).',
  'Um cliente salvou 4 produtos favoritos.',
  'Elfbar BC5000 Mango Ice esgotando em breve.',
]

export const addresses = [
  'Rua da Liberdade, 120 - Guarulhos/SP',
  'Av. Central, 455 - São Paulo/SP',
]

export function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function getProductById(id: string | number) {
  const numericId = typeof id === 'string' ? Number(id) : id
  return products.find((product) => product.id === numericId)
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.category === slug)
}

export function getCategoryName(slug: string) {
  return categories.find((category) => category.slug === slug)?.name ?? 'Categoria'
}
