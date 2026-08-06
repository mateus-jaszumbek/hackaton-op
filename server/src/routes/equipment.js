import { Router } from 'express'
import {
  createEquipmentRental,
  getEquipmentRental,
  listExpiringEquipmentRentals,
  markEquipmentReminderSent,
  updateEquipmentRentalStatus,
} from '../db/equipment.js'
import { getConversation } from '../db/conversations.js'
import { BACKEND_API_KEY } from '../config.js'

const STATUSES = ['ativo', 'renovado', 'encerrado']
const DEFAULT_EXPIRING_DAYS = 5

export const equipmentRouter = Router()

equipmentRouter.use((req, res, next) => {
  if (!BACKEND_API_KEY) return next()
  if (req.get('x-api-key') !== BACKEND_API_KEY) {
    return res.status(401).json({ error: 'x-api-key inválida ou ausente' })
  }
  next()
})

equipmentRouter.post('/', (req, res) => {
  const { conversationId, equipmentName, totalValue, startDate, endDate, contactEmail } = req.body ?? {}

  const trimmedName = typeof equipmentName === 'string' ? equipmentName.trim() : ''
  const trimmedEmail = typeof contactEmail === 'string' ? contactEmail.trim() : ''

  if (!trimmedName) return res.status(400).json({ error: 'equipmentName é obrigatório' })
  if (typeof totalValue !== 'number' || totalValue <= 0) {
    return res.status(400).json({ error: 'totalValue deve ser um número maior que zero' })
  }
  if (!Number.isFinite(startDate) || !Number.isFinite(endDate) || endDate <= startDate) {
    return res.status(400).json({ error: 'startDate e endDate devem ser timestamps válidos, com endDate após startDate' })
  }
  if (!trimmedEmail) return res.status(400).json({ error: 'contactEmail é obrigatório' })
  if (conversationId && !getConversation(conversationId)) {
    return res.status(404).json({ error: 'Conversa não encontrada' })
  }

  const created = createEquipmentRental({
    conversationId: conversationId ?? null,
    equipmentName: trimmedName,
    totalValue,
    startDate,
    endDate,
    contactEmail: trimmedEmail,
  })
  res.status(201).json(created)
})

equipmentRouter.get('/expiring', (req, res) => {
  const days = Number(req.query.days) || DEFAULT_EXPIRING_DAYS
  const withinMs = days * 24 * 60 * 60 * 1000
  res.json(listExpiringEquipmentRentals(withinMs))
})

equipmentRouter.get('/:id', (req, res) => {
  const found = getEquipmentRental(req.params.id)
  if (!found) return res.status(404).json({ error: 'Registro de equipamento não encontrado' })
  res.json(found)
})

equipmentRouter.patch('/:id', (req, res) => {
  const found = getEquipmentRental(req.params.id)
  if (!found) return res.status(404).json({ error: 'Registro de equipamento não encontrado' })

  const { status, reminderSent } = req.body ?? {}
  let updated = found

  if (status !== undefined) {
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: `status deve ser um de: ${STATUSES.join(', ')}` })
    }
    updated = updateEquipmentRentalStatus(req.params.id, status)
  }

  if (reminderSent === true) {
    updated = markEquipmentReminderSent(req.params.id)
  }

  res.json(updated)
})
