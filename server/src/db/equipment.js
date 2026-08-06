import { randomUUID } from 'node:crypto'
import { db } from './index.js'

const insertEquipment = db.prepare(
  `INSERT INTO equipment_rentals
     (id, conversation_id, equipment_name, total_value, start_date, end_date, contact_email, status, created_at, updated_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, 'ativo', ?, ?)`,
)
const selectEquipment = db.prepare(`SELECT * FROM equipment_rentals WHERE id = ?`)
const selectExpiring = db.prepare(
  `SELECT * FROM equipment_rentals
   WHERE status = 'ativo' AND reminder_sent_at IS NULL AND end_date <= ?
   ORDER BY end_date ASC`,
)
const updateStatusStmt = db.prepare(
  `UPDATE equipment_rentals SET status = ?, updated_at = ? WHERE id = ?`,
)
const markReminderSentStmt = db.prepare(
  `UPDATE equipment_rentals SET reminder_sent_at = ?, updated_at = ? WHERE id = ?`,
)

function toApi(e) {
  return {
    id: e.id,
    conversationId: e.conversation_id,
    equipmentName: e.equipment_name,
    totalValue: e.total_value,
    startDate: e.start_date,
    endDate: e.end_date,
    contactEmail: e.contact_email,
    status: e.status,
    reminderSentAt: e.reminder_sent_at,
    createdAt: e.created_at,
    updatedAt: e.updated_at,
  }
}

export function createEquipmentRental({
  conversationId = null,
  equipmentName,
  totalValue,
  startDate,
  endDate,
  contactEmail,
}) {
  const id = randomUUID()
  const now = Date.now()
  insertEquipment.run(id, conversationId, equipmentName, totalValue, startDate, endDate, contactEmail, now, now)
  return toApi(selectEquipment.get(id))
}

export function getEquipmentRental(id) {
  const e = selectEquipment.get(id)
  return e ? toApi(e) : null
}

export function listExpiringEquipmentRentals(withinMs) {
  return selectExpiring.all(Date.now() + withinMs).map(toApi)
}

export function updateEquipmentRentalStatus(id, status) {
  updateStatusStmt.run(status, Date.now(), id)
  return getEquipmentRental(id)
}

export function markEquipmentReminderSent(id) {
  markReminderSentStmt.run(Date.now(), id)
  return getEquipmentRental(id)
}
