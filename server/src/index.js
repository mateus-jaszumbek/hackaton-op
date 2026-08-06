import express from 'express'
import cors from 'cors'
import { ensureSchema } from './db/index.js'
import { PORT } from './config.js'
import { meRouter } from './routes/me.js'
import { conversationsRouter } from './routes/conversations.js'
import { chatRouter } from './routes/chat.js'
import { casesRouter } from './routes/cases.js'
import { useCasesRouter } from './routes/useCases.js'
import { webhookAuthRouter } from './routes/webhookAuth.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/me', meRouter)
app.use('/api/conversations', conversationsRouter)
app.use('/api/chat', chatRouter)
app.use('/api/cases', casesRouter)
app.use('/api/use-cases', useCasesRouter)
app.use('/api/webhook-auth', webhookAuthRouter)

const HOST = '0.0.0.0'

await ensureSchema()
app.listen(PORT, HOST, () => {
  console.log(`[server] rodando em http://${HOST}:${PORT}`)
})
