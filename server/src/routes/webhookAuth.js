import { Router } from 'express'
import { N8N_WEBHOOK_SECRET } from '../config.js'

export const webhookAuthRouter = Router()

webhookAuthRouter.post('/validate', (req, res) => {
  if (!N8N_WEBHOOK_SECRET) return res.status(200).json({ ok: true })
  if (req.get('x-webhook-secret') === N8N_WEBHOOK_SECRET) {
    return res.status(200).json({ ok: true })
  }
  res.status(401).json({ ok: false })
})
