export const ANIMAL_INFO = {
  chicken: {
    eats: '🌾 Graines et vers de terre',
    fact: 'Une poule peut pondre jusqu\'à 300 œufs par an !',
    reactions: ['🥚', '🌾', '❤️', '⭐', '🐣'],
    food: '🌾',
  },
  pig: {
    eats: '🥕 Légumes, fruits et herbe',
    fact: 'Le cochon est l\'un des animaux les plus intelligents de la ferme !',
    reactions: ['🛁', '🌸', '❤️', '🌟', '🐽'],
    food: '🥕',
  },
  cow: {
    eats: '🌿 Herbe fraîche et foin',
    fact: 'Une vache peut donner jusqu\'à 30 litres de lait par jour !',
    reactions: ['🥛', '🌿', '❤️', '⭐', '🍀'],
    food: '🌿',
  },
  sheep: {
    eats: '🌱 Herbe et feuilles',
    fact: 'La laine d\'un mouton pousse toute l\'année sans jamais s\'arrêter !',
    reactions: ['🧶', '☁️', '❤️', '✨', '🌸'],
    food: '🌱',
  },
  rabbit: {
    eats: '🥕 Carottes, salades et foin',
    fact: 'Les lapins peuvent faire des bonds de plus d\'un mètre de haut !',
    reactions: ['🥕', '🌸', '❤️', '⭐', '🐇'],
    food: '🥕',
  },
  duck: {
    eats: '🐟 Petits poissons, insectes et graines',
    fact: 'Les canards ont des plumes imperméables grâce à une glande spéciale !',
    reactions: ['💧', '🌊', '❤️', '✨', '🦆'],
    food: '🐟',
  },
}

export function getAnimalInfo(animalKey) {
  return ANIMAL_INFO[animalKey] ?? {
    eats: '🌾 Nourriture variée',
    fact: 'Un animal merveilleux de la ferme !',
    reactions: ['❤️', '⭐'],
    food: '🍎',
  }
}
