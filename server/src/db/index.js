import pg from 'pg'
import { DATABASE_URL } from '../config.js'

const { Pool } = pg

export const db = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes('localhost') || DATABASE_URL.includes('127.0.0.1') ? false : { rejectUnauthorized: false },
})

export async function ensureSchema() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id),
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
      text TEXT NOT NULL,
      steps_json TEXT NOT NULL DEFAULT '[]',
      note TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT 'ia',
      pending_use_case_json TEXT,
      use_case_saved BOOLEAN NOT NULL DEFAULT false,
      created_at BIGINT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS pending_use_case_json TEXT;
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS use_case_saved BOOLEAN NOT NULL DEFAULT false;

    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      conversation_id TEXT REFERENCES conversations(id),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT NOT NULL CHECK (priority IN ('baixa', 'media', 'alta')),
      status TEXT NOT NULL DEFAULT 'aberto',
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS use_cases (
      id TEXT PRIMARY KEY,
      conversation_id TEXT REFERENCES conversations(id),
      setor TEXT NOT NULL DEFAULT 'CS',
      cenario TEXT NOT NULL,
      objetivo_cliente TEXT NOT NULL,
      duvida TEXT NOT NULL,
      perguntas_para_entender TEXT NOT NULL DEFAULT '',
      caminho_1 TEXT NOT NULL DEFAULT '',
      caminho_2 TEXT NOT NULL DEFAULT '',
      caminho_3 TEXT NOT NULL DEFAULT '',
      recomendacao_final TEXT NOT NULL DEFAULT '',
      observacoes TEXT NOT NULL DEFAULT '',
      embedding TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'ia')),
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL
    );
  `)
}
