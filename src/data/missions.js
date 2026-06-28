// Missions du jour : 3 petites tâches qui se réinitialisent chaque jour.
// Chaque mission donne des étoiles une fois sa cible atteinte (auto-réclamée).

export const MISSION_CATALOG = [
  { id: 'exercises', icon: 'pencil', label: 'Réussis 5 exercices', target: 5, reward: 10 },
  { id: 'feed', icon: 'apple', label: 'Nourris ton animal 3 fois', target: 3, reward: 5 },
  { id: 'minigame', icon: 'dice', label: 'Joue à 1 mini-jeu', target: 1, reward: 5 },
]

export const MISSION_BY_ID = Object.fromEntries(MISSION_CATALOG.map((m) => [m.id, m]))

export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

// Crée les missions du jour (toutes à 0, non réclamées).
export function freshMissions() {
  return MISSION_CATALOG.map((m) => ({ id: m.id, progress: 0, claimed: false }))
}

// Renvoie l'état des missions à jour (régénère si la date a changé).
export function ensureTodayMissions(state) {
  const today = todayKey()
  if (state.missionsDate === today && Array.isArray(state.missions) && state.missions.length) {
    return { missionsDate: today, missions: state.missions }
  }
  return { missionsDate: today, missions: freshMissions() }
}

export function allMissionsDone(missions) {
  if (!Array.isArray(missions) || !missions.length) return false
  return missions.every((m) => {
    const def = MISSION_BY_ID[m.id]
    return def && m.progress >= def.target
  })
}
