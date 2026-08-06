import 'dotenv/config'

export const PORT = Number(process.env.PORT) || 8787
export const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || ''
export const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET || ''
export const BACKEND_API_KEY = process.env.BACKEND_API_KEY || ''
export const DATABASE_URL = process.env.DATABASE_URL || ''

export const CURRENT_USER = {
  id: 'teste-hackaton',
  name: 'Teste hackaton',
  role: 'Operações · perfil padrão',
}
