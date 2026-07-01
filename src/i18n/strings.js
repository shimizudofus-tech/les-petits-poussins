// Dictionnaire de traduction UI. Clé → { fr, en }.
export const STRINGS = {
  // Accueil
  'home.farm': { fr: 'MA FERME', en: 'MY FARM' },
  'home.feed': { fr: 'Nourrir', en: 'Feed' },
  'home.newAnimal': { fr: 'Nouvel animal', en: 'New animal' },
  'home.play': { fr: 'Jouer & Apprendre', en: 'Play & Learn' },
  'home.collection': { fr: 'Collection', en: 'Collection' },
  'home.explore': { fr: 'Explorer', en: 'Explore' },
  'home.upgrade': { fr: 'Améliorer', en: 'Upgrade' },
  'home.eggMystery': { fr: 'Œuf mystère', en: 'Mystery egg' },
  'home.beforeHatch': { fr: "Avant l'éclosion", en: 'Before hatching' },
  'home.growing': { fr: 'Devient grand', en: 'Growing up' },
  'home.adult': { fr: 'Adulte !', en: 'Grown up!' },

  // Choix du niveau
  'level.title': { fr: 'Choisis ton niveau', en: 'Choose your level' },
  'level.maternelle': { fr: 'Maternelle', en: 'Preschool' },
  'level.primaire': { fr: 'Primaire', en: 'Primary' },
  'level.backToFarm': { fr: 'Retour à la ferme', en: 'Back to the farm' },
  'level.petite': { fr: 'Petite Section', en: 'Nursery' },
  'level.moyenne': { fr: 'Moyenne Section', en: 'Lower Kindergarten' },
  'level.grande': { fr: 'Grande Section', en: 'Upper Kindergarten' },
  'level.write': { fr: "J'écris", en: 'I write' },
  'level.minigames': { fr: 'Mini-jeux', en: 'Mini-games' },
  'level.lesson': { fr: 'Leçon du jour', en: 'Daily lesson' },
  'level.lessonSub': { fr: '5 exercices guidés', en: '5 guided exercises' },

  // Leçon du jour
  'lesson.title': { fr: 'Leçon du jour', en: 'Daily lesson' },
  'lesson.pick': { fr: 'Choisis ton niveau pour 5 exercices.', en: 'Pick your level for 5 exercises.' },
  'lesson.question': { fr: 'Question', en: 'Question' },
  'lesson.done': { fr: 'Bravo ! Leçon terminée', en: 'Well done! Lesson complete' },
  'lesson.won': { fr: 'Tu as gagné', en: 'You earned' },
  'lesson.again': { fr: 'Refaire une leçon', en: 'Do another lesson' },

  // Commun
  'common.back': { fr: 'Retour', en: 'Back' },
  'common.backFarm': { fr: 'Retour à la ferme', en: 'Back to the farm' },
  'common.stars': { fr: 'étoiles', en: 'stars' },

  // Réglages parent (langue)
  'parent.language': { fr: 'Langue', en: 'Language' },
  'parent.french': { fr: 'Français', en: 'French' },
  'parent.english': { fr: 'Anglais', en: 'English' },

  // Cadeau du jour
  'daily.dailyGift': { fr: 'Cadeau du jour', en: 'Daily gift' },
  'daily.day': { fr: 'Jour', en: 'Day' },
  'daily.forVisit': { fr: 'pour ta visite.', en: 'for your visit.' },
  'daily.thanks': { fr: 'Super !', en: 'Great!' },
  'daily.legendReward': { fr: 'Récompense légendaire !', en: 'Legendary reward!' },
  'daily.legendWin': { fr: 'Animal légendaire !', en: 'Legendary animal!' },
  'daily.youWon': { fr: 'Tu as gagné :', en: 'You earned:' },
  'daily.comeBack': { fr: 'Reviens chaque jour. Au 7ᵉ jour : un animal légendaire ! 🦄', en: 'Come back every day. On day 7: a legendary animal! 🦄' },
}

export function translate(lang, key) {
  const entry = STRINGS[key]
  if (!entry) return key
  return entry[lang] ?? entry.fr ?? key
}
