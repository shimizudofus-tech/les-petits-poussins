import unicorn from '../assets/images/legendaries/unicorn.png'
import dragon from '../assets/images/legendaries/dragon.png'
import mermaid from '../assets/images/legendaries/mermaid.png'
import yeti from '../assets/images/legendaries/yeti.png'
import nessie from '../assets/images/legendaries/nessie.png'

// Animaux légendaires : gagnés UNIQUEMENT via la série de 7 jours de connexion.
// Ordre d'obtention.
export const LEGENDARIES = [
  { key: 'unicorn', name: 'Licorne', icon: unicorn },
  { key: 'dragon', name: 'Dragon', icon: dragon },
  { key: 'mermaid', name: 'Sirène', icon: mermaid },
  { key: 'yeti', name: 'Yéti', icon: yeti },
  { key: 'nessie', name: 'Nessie', icon: nessie },
]

export const LEGENDARY_KEYS = new Set(LEGENDARIES.map((l) => l.key))

export function isLegendary(key) {
  return LEGENDARY_KEYS.has(key)
}

// Entrées de collection pour les légendaires (verrouillées au départ).
export function createLegendaryCollectionEntries() {
  const out = {}
  for (const l of LEGENDARIES) {
    out[l.key] = {
      name: l.name,
      age: 99,
      currentStage: 'adult',
      completed: true,
      unlocked: false,
      legendary: true,
      stages: {
        egg: { icon: '📦', name: 'Mystère', nextAge: 1 },
        baby: { icon: l.icon, name: l.name },
        adult: { icon: l.icon, name: l.name },
      },
    }
  }
  return out
}

// Prochain légendaire à débloquer (le 1er encore verrouillé). null si tous obtenus.
export function nextLockedLegendary(collection = {}) {
  for (const l of LEGENDARIES) {
    if (!collection[l.key]?.unlocked) return l
  }
  return null
}
