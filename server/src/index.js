import express from 'express'
import cors from 'cors'
import './db/index.js'
import { PORT } from './config.js'
import { meRouter } from './routes/me.js'
import { conversationsRouter } from './routes/conversations.js'
import { chatRouter } from './routes/chat.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/me', meRouter)
app.use('/api/conversations', conversationsRouter)
app.use('/api/chat', chatRouter)

app.listen(PORT, () => {
  console.log(`[server] rodando em http://localhost:${PORT}`)
})
