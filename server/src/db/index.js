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

  CREATE TABLE IF NOT EXISTS equipment_rentals (
    id TEXT PRIMARY KEY,
    conversation_id TEXT REFERENCES conversations(id),
    equipment_name TEXT NOT NULL,
    total_value REAL NOT NULL,
    start_date INTEGER NOT NULL,
    end_date INTEGER NOT NULL,
    contact_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'renovado', 'encerrado')),
    reminder_sent_at INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_equipment_end_date ON equipment_rentals(end_date);
`)
