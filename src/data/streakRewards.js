import { LEGENDARIES } from './legendaries'

// Récompense de série de connexion : 1 nouveauté par jour d'affilée (1 à 7),
// puis le cycle recommence (les jours déjà obtenus ne redonnent que des étoiles).
//   Jour 1-5 : un animal légendaire (dans l'ordre de LEGENDARIES)
//   Jour 6   : Arbre magique (trésor exclusif, Améliorer)
//   Jour 7   : Château (trésor exclusif, Améliorer)
export const STREAK_TREASURES = [
  { day: 6, key: 'magic_tree', name: 'Arbre magique', icon: '🌳' },
  { day: 7, key: 'castle', name: 'Château', icon: '🏰' },
]

// Description de la récompense pour un jour donné du cycle (1..7).
export function getStreakReward(dayInWeek) {
  if (dayInWeek >= 1 && dayInWeek <= 5) {
    const leg = LEGENDARIES[dayInWeek - 1]
    return { day: dayInWeek, type: 'legendary', key: leg.key, name: leg.name, icon: leg.icon }
  }
  const treasure = STREAK_TREASURES.find((t) => t.day === dayInWeek)
  return { day: dayInWeek, type: 'item', key: treasure.key, name: treasure.name, icon: treasure.icon }
}

// Les 7 récompenses du cycle, pour l'aperçu du calendrier.
export function getStreakRewardsPreview() {
  return [1, 2, 3, 4, 5, 6, 7].map(getStreakReward)
}
