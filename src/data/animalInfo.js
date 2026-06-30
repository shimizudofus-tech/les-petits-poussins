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
  horse: {
    eats: '🌾 Foin, herbe et avoine',
    fact: 'Un cheval peut dormir debout grâce à ses jambes qui se bloquent !',
    reactions: ['🐎', '🌾', '❤️', '⭐', '🏇'],
    food: '🌾',
  },
  goat: {
    eats: '🌿 Herbe, feuilles et brindilles',
    fact: 'Les chèvres ont une excellente mémoire et adorent grimper !',
    reactions: ['🐐', '🌿', '❤️', '⛰️', '✨'],
    food: '🌿',
  },
  dog: {
    eats: '🦴 Croquettes et un bon os',
    fact: "Le chien entend des sons quatre fois plus loin que l'humain !",
    reactions: ['🦴', '🐾', '❤️', '⭐', '🐕'],
    food: '🦴',
  },
  cat: {
    eats: '🐟 Croquettes et un peu de poisson',
    fact: 'Un chat passe environ la moitié de sa journée à dormir !',
    reactions: ['🐟', '🧶', '❤️', '😴', '🐈'],
    food: '🐟',
  },
  turkey: {
    eats: '🌽 Graines, maïs et insectes',
    fact: 'La dinde peut faire gonfler ses plumes pour paraître plus grande !',
    reactions: ['🌽', '🪶', '❤️', '⭐', '🦃'],
    food: '🌽',
  },
  mouse: {
    eats: '🧀 Graines, fromage et miettes',
    fact: 'Une souris peut se faufiler dans un trou large comme un crayon !',
    reactions: ['🧀', '🌾', '❤️', '✨', '🐭'],
    food: '🧀',
  },
  // ── Légendaires ──
  unicorn: {
    eats: '🌈 Fleurs magiques et arcs-en-ciel',
    fact: 'La licorne laisse des paillettes partout où elle passe !',
    reactions: ['🌈', '✨', '❤️', '🌸', '🦄'],
    food: '🌈',
  },
  dragon: {
    eats: '🍖 Surtout de la viande',
    fact: 'Le dragon peut souffler de petites flammes !',
    reactions: ['🔥', '🍖', '❤️', '✨', '🐉'],
    food: '🍖',
  },
  mermaid: {
    eats: '🐚 Algues et coquillages',
    fact: 'La sirène chante pour appeler les poissons !',
    reactions: ['🐚', '🌊', '❤️', '✨', '🧜'],
    food: '🐚',
  },
  yeti: {
    eats: '🍓 Baies des montagnes et glace',
    fact: 'Le yéti vit tout en haut des montagnes enneigées !',
    reactions: ['❄️', '🍓', '❤️', '⛰️', '✨'],
    food: '🍓',
  },
  nessie: {
    eats: '🐟 Poissons du lac',
    fact: "Personne n'a jamais vraiment photographié Nessie !",
    reactions: ['🌊', '🐟', '❤️', '✨', '🦕'],
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
