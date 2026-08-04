import { Router } from 'express'
import { CURRENT_USER } from '../config.js'

export const meRouter = Router()

meRouter.get('/', (_req, res) => {
  res.json(CURRENT_USER)
})
