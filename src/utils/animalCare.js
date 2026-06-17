/* Faim quotidienne des animaux (Explorer la ferme).
   animalCare: { [animalKey]: { lastFedAt: number } }
   - Affamé si Date.now() - lastFedAt >= 24h.
   - Pas d'entrée = pas encore initialisé → considéré PAS affamé (init douce :
     on pose lastFedAt = maintenant au premier chargement / déblocage). */

export const HUNGER_INTERVAL = 24 * 60 * 60 * 1000   // 24 h en ms
export const FEED_REWARD = 3                          // étoiles quand tout nourri
const HOUR = 60 * 60 * 1000

export function isAnimalHungry(care, key, now = Date.now()) {
  const c = care?.[key]
  if (!c || c.lastFedAt == null) return false
  return now - c.lastFedAt >= HUNGER_INTERVAL
}

export function getUnlockedKeys(collection) {
  return Object.entries(collection ?? {})
    .filter(([, a]) => a.unlocked)
    .map(([k]) => k)
}

export function getHungryKeys(collection, care, now = Date.now()) {
  return getUnlockedKeys(collection).filter((k) => isAnimalHungry(care, k, now))
}

// Ajoute lastFedAt = now pour les animaux débloqués sans entrée (migration douce
// + nouveaux animaux). Renvoie { care, changed }.
export function ensureCareInitialized(collection, care, now = Date.now()) {
  const next = { ...(care ?? {}) }
  let changed = false
  for (const k of getUnlockedKeys(collection)) {
    if (!next[k] || next[k].lastFedAt == null) {
      next[k] = { lastFedAt: now }
      changed = true
    }
  }
  return { care: next, changed }
}

// Heures avant le prochain animal affamé (parmi ceux pas encore affamés).
export function nextHungerInHours(collection, care, now = Date.now()) {
  const remaining = getUnlockedKeys(collection)
    .map((k) => care?.[k]?.lastFedAt)
    .filter((t) => t != null)
    .map((t) => t + HUNGER_INTERVAL - now)
    .filter((d) => d > 0)
  if (!remaining.length) return null
  return Math.max(1, Math.ceil(Math.min(...remaining) / HOUR))
}
