/* Multi-profils enfants : chaque profil a sa propre sauvegarde.
   - liste des profils + profil actif dans localStorage
   - état de jeu stocké sous une clé par profil
   - migration : l'ancienne sauvegarde unique devient "Enfant 1" */

const BASE_KEY = 'les-petits-poussins-game-state'
const PROFILES_KEY = 'lpp-profiles'
const ACTIVE_KEY = 'lpp-active-profile'

export const PROFILE_AVATARS = ['🐤', '🐰', '🦊', '🐻', '🐱', '🐶', '🦁', '🐼', '🦄', '🐸']

export function stateKeyForProfile(id) {
  return `${BASE_KEY}::${id}`
}

function uid() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export function getProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    const arr = raw ? JSON.parse(raw) : null
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function writeProfiles(list) {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(list))
  } catch {
    // ignore
  }
}

export function getActiveProfileId() {
  try {
    return localStorage.getItem(ACTIVE_KEY)
  } catch {
    return null
  }
}

export function setActiveProfileId(id) {
  try {
    localStorage.setItem(ACTIVE_KEY, id)
  } catch {
    // ignore
  }
}

// Crée au moins un profil + récupère l'ancienne sauvegarde unique (migration).
export function ensureProfiles() {
  let list = getProfiles()
  if (list.length === 0) {
    const id = uid()
    list = [{ id, name: 'Enfant 1', avatar: PROFILE_AVATARS[0] }]
    writeProfiles(list)
    setActiveProfileId(id)
    try {
      const legacy = localStorage.getItem(BASE_KEY)
      if (legacy && !localStorage.getItem(stateKeyForProfile(id))) {
        localStorage.setItem(stateKeyForProfile(id), legacy)
      }
    } catch {
      // ignore
    }
  }
  let active = getActiveProfileId()
  if (!active || !list.some((p) => p.id === active)) {
    active = list[0].id
    setActiveProfileId(active)
  }
  return { list, active }
}

export function addProfile(name) {
  const list = getProfiles()
  const id = uid()
  const profile = {
    id,
    name: (name || '').trim() || `Enfant ${list.length + 1}`,
    avatar: PROFILE_AVATARS[list.length % PROFILE_AVATARS.length],
  }
  writeProfiles([...list, profile])
  return profile
}

export function deleteProfile(id) {
  const list = getProfiles().filter((p) => p.id !== id)
  writeProfiles(list)
  try {
    localStorage.removeItem(stateKeyForProfile(id))
  } catch {
    // ignore
  }
  if (getActiveProfileId() === id && list[0]) setActiveProfileId(list[0].id)
  return list
}

// Clé de sauvegarde de l'état actif (fallback legacy si pas de profil).
export function getActiveStateKey() {
  const active = getActiveProfileId()
  return active ? stateKeyForProfile(active) : BASE_KEY
}
