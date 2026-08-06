import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DB_PATH } from '../config.js'

mkdirSync(dirname(DB_PATH), { recursive: true })
export const db = new DatabaseSync(DB_PATH)

db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES conversations(id),
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    text TEXT NOT NULL,
    steps_json TEXT NOT NULL DEFAULT '[]',
    note TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);

  CREATE TABLE IF NOT EXISTS cases (
    id TEXT PRIMARY KEY,
    conversation_id TEXT REFERENCES conversations(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('baixa', 'media', 'alta')),
    status TEXT NOT NULL DEFAULT 'aberto',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
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
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
`)
