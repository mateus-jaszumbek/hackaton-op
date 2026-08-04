import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const PORT = Number(process.env.PORT) || 8787
export const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || ''
export const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'app.db')

export const CURRENT_USER = {
  id: 'teste-hackaton',
  name: 'Teste hackaton',
  role: 'Operações · perfil padrão',
}
