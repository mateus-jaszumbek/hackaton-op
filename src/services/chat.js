import { ANSWERS } from '../data/answers.js'
import { SUGGESTIONS } from '../data/suggestions.js'

export function matchKey(text) {
  const words = text.toLowerCase().split(' ')
  const hit = SUGGESTIONS.find((s) =>
    words.some((w) => w.length > 4 && s.text.toLowerCase().includes(w)),
  )
  return hit ? hit.key : 'fin'
}

export function getAnswer(key) {
  return ANSWERS[key]
}
