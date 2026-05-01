import fs from 'node:fs'
import path from 'node:path'

/**
 * Camada de persistência simples baseada em arquivo JSON.
 * - Em desenvolvimento usa .data/panda-store-db.json (no diretório do projeto)
 * - Em produção (Vercel) usa /tmp/panda-store-db.json (único caminho gravável)
 *
 * Estrutura: usuários, pedidos e sessões (token -> userId).
 */

const DB_DIR =
  process.env.NODE_ENV === 'production'
    ? '/tmp'
    : path.join(process.cwd(), '.data')

const DB_PATH = path.join(DB_DIR, 'panda-store-db.json')

export type DBUser = {
  id: string
  name: string
  email: string
  phone?: string
  passwordHash: string
  createdAt: string
}

export type DBOrderItem = {
  productId: number
  name: string
  price: number
  quantity: number
}

export type DBOrderStatus = 'Pago' | 'Separando' | 'Enviado' | 'Entregue' | 'Cancelado'

export type DBOrder = {
  id: string
  userId: string | null
  customerName: string
  customerEmail: string
  customerPhone?: string
  address?: string
  items: DBOrderItem[]
  subtotal: number
  shipping: number
  total: number
  status: DBOrderStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export type DBSession = {
  token: string
  userId: string
  createdAt: string
}

type DB = {
  users: DBUser[]
  orders: DBOrder[]
  sessions: DBSession[]
}

function ensureDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }
}

function readDB(): DB {
  ensureDir()
  if (!fs.existsSync(DB_PATH)) {
    const initial: DB = { users: [], orders: [], sessions: [] }
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2))
    return initial
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8')
    const parsed = JSON.parse(raw) as Partial<DB>
    return {
      users: parsed.users ?? [],
      orders: parsed.orders ?? [],
      sessions: parsed.sessions ?? [],
    }
  } catch {
    return { users: [], orders: [], sessions: [] }
  }
}

function writeDB(db: DB) {
  ensureDir()
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

// ----------------- USERS -----------------

export function listUsers(): DBUser[] {
  return readDB().users
}

export function findUserByEmail(email: string): DBUser | undefined {
  const normalized = email.trim().toLowerCase()
  return readDB().users.find((u) => u.email.toLowerCase() === normalized)
}

export function findUserById(id: string): DBUser | undefined {
  return readDB().users.find((u) => u.id === id)
}

export function createUser(user: Omit<DBUser, 'id' | 'createdAt'>): DBUser {
  const db = readDB()
  const newUser: DBUser = {
    ...user,
    email: user.email.trim().toLowerCase(),
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  }
  db.users.push(newUser)
  writeDB(db)
  return newUser
}

// ----------------- SESSIONS -----------------

export function createSession(userId: string, token: string): DBSession {
  const db = readDB()
  const session: DBSession = {
    token,
    userId,
    createdAt: new Date().toISOString(),
  }
  db.sessions.push(session)
  writeDB(db)
  return session
}

export function findSessionByToken(token: string): DBSession | undefined {
  return readDB().sessions.find((s) => s.token === token)
}

export function deleteSession(token: string) {
  const db = readDB()
  db.sessions = db.sessions.filter((s) => s.token !== token)
  writeDB(db)
}

// ----------------- ORDERS -----------------

function generateOrderId(existing: DBOrder[]): string {
  // Sequencial estilo #PD-3001
  const base = 3000
  const nums = existing
    .map((o) => Number(o.id.replace(/[^0-9]/g, '')))
    .filter((n) => !Number.isNaN(n))
  const next = nums.length ? Math.max(base, ...nums) + 1 : base + 1
  return `#PD-${next}`
}

export function listOrders(filter?: { userId?: string }): DBOrder[] {
  const all = readDB().orders
  const filtered = filter?.userId ? all.filter((o) => o.userId === filter.userId) : all
  // Mais recentes primeiro
  return [...filtered].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export function findOrderById(id: string): DBOrder | undefined {
  return readDB().orders.find((o) => o.id === id)
}

export function createOrder(
  data: Omit<DBOrder, 'id' | 'createdAt' | 'updatedAt'>
): DBOrder {
  const db = readDB()
  const now = new Date().toISOString()
  const newOrder: DBOrder = {
    ...data,
    id: generateOrderId(db.orders),
    createdAt: now,
    updatedAt: now,
  }
  db.orders.push(newOrder)
  writeDB(db)
  return newOrder
}

export function updateOrder(
  id: string,
  patch: Partial<Omit<DBOrder, 'id' | 'createdAt'>>
): DBOrder | null {
  const db = readDB()
  const idx = db.orders.findIndex((o) => o.id === id)
  if (idx === -1) return null
  const updated: DBOrder = {
    ...db.orders[idx],
    ...patch,
    id: db.orders[idx].id,
    createdAt: db.orders[idx].createdAt,
    updatedAt: new Date().toISOString(),
  }
  db.orders[idx] = updated
  writeDB(db)
  return updated
}

export function deleteOrder(id: string): boolean {
  const db = readDB()
  const before = db.orders.length
  db.orders = db.orders.filter((o) => o.id !== id)
  if (db.orders.length === before) return false
  writeDB(db)
  return true
}
