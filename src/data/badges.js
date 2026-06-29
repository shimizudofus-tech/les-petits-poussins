export const BADGES = [
  {
    id: 'first_success',
    name: 'Première réussite',
    description: 'Réussir son premier exercice',
    icon: '⭐',
    category: 'general',
    rewardStars: 5,
  },
  {
    id: 'five_success',
    name: 'Bien parti !',
    description: 'Réussir 5 exercices',
    icon: '🌟',
    category: 'general',
    rewardStars: 5,
  },
  {
    id: 'ten_success',
    name: 'Petit champion',
    description: 'Réussir 10 exercices',
    icon: '🏆',
    category: 'general',
    rewardStars: 5,
  },
  {
    id: 'twentyfive_success',
    name: 'En pleine forme',
    description: 'Réussir 25 exercices',
    icon: '🎯',
    category: 'general',
    rewardStars: 10,
  },
  {
    id: 'fifty_success',
    name: 'Super élève',
    description: 'Réussir 50 exercices',
    icon: '🥇',
    category: 'general',
    rewardStars: 15,
  },
  {
    id: 'hundred_success',
    name: 'Maître poussin',
    description: 'Réussir 100 exercices',
    icon: '👑',
    category: 'general',
    rewardStars: 25,
  },
  {
    id: 'colors_friend',
    name: 'Ami des couleurs',
    description: 'Réussir 10 exercices de couleurs',
    icon: '🎨',
    category: 'skill',
    rewardStars: 5,
  },
  {
    id: 'puzzle_builder',
    name: 'Mini puzzleur',
    description: 'Réussir 5 puzzles',
    icon: '🧩',
    category: 'skill',
    rewardStars: 5,
  },
  {
    id: 'letter_explorer',
    name: 'Découvreur de lettres',
    description: 'Réussir 10 exercices de lettres',
    icon: '🔤',
    category: 'skill',
    rewardStars: 5,
  },
  {
    id: 'perfect_test',
    name: 'Sans faute',
    description: 'Réussir un test avec 5/5',
    icon: '💎',
    category: 'test',
    rewardStars: 10,
  },
  {
    id: 'petite_champion',
    name: 'Champion des petits',
    description: 'Réussir 10 exercices dans chaque activité Petite Section',
    icon: '🐣',
    category: 'section',
    rewardStars: 15,
  },
  {
    id: 'moyenne_champion',
    name: 'Champion des moyens',
    description: 'Réussir 10 exercices dans chaque activité Moyenne Section',
    icon: '🐥',
    category: 'section',
    rewardStars: 15,
  },
  {
    id: 'grande_champion',
    name: 'Champion des grands',
    description: 'Réussir 10 exercices dans chaque activité Grande Section',
    icon: '🐔',
    category: 'section',
    rewardStars: 15,
  },
]

export const BADGE_BY_ID = Object.fromEntries(BADGES.map((b) => [b.id, b]))

export const TESTABLE_SUBJECTS = new Set([
  'colors',
  'shapes',
  'counting',
  'letters',
  'sounds',
])

export function getTestStarReward(score, length = 5) {
  if (score >= length) return 10
  if (score >= length - 1) return 6
  if (score >= 3) return 3
  return 1
}
