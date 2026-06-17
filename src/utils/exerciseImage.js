const IMAGE_EMOJI_FALLBACKS = {
  chat: '🐱',
  chien: '🐶',
  poule: '🐔',
  maison: '🏠',
  soleil: '☀️',
  lune: '🌙',
  papa: '👨',
  maman: '👩',
  arbre: '🌳',
  fleur: '🌸',
  vache: '🐄',
  poussin: '🐣',
  // mots CP supplémentaires (indice image, jamais le texte du mot)
  bebe: '👶',
  velo: '🚲',
  ecole: '🏫',
  ami: '🧒',
  sac: '🎒',
  lit: '🛏️',
  bol: '🥣',
  rat: '🐀',
  nid: '🪺',
  oeuf: '🥚',
  ferme: '🚜',
  cochon: '🐷',
  mouton: '🐑',
  // mots CE1
  bateau: '⛵',
  gateau: '🎂',
  oiseau: '🐦',
  jardin: '🌷',
  cheval: '🐴',
  bonbon: '🍬',
  manteau: '🧥',
  fromage: '🧀',
  voiture: '🚗',
  girafe: '🦒',
  etoile: '⭐',
  fenetre: '🪟',
  chateau: '🏰',
  montagne: '⛰️',
  papillon: '🦋',
  chaussure: '👟',
  poisson: '🐟',
  // mots CE2
  renard: '🦊',
  dauphin: '🐬',
  tortue: '🐢',
  abeille: '🐝',
  elephant: '🐘',
  ecureuil: '🐿️',
  parapluie: '☂️',
  parasol: '⛱️',
  dinosaure: '🦕',
  crocodile: '🐊',
  kangourou: '🦘',
  herisson: '🦔',
  tonnerre: '⛈️',
  grenouille: '🐸',
  coquillage: '🐚',
  pingouin: '🐧',
  chouette: '🦉',
}

export function resolveExerciseImage(imageKey) {
  if (!imageKey) {
    return { type: 'generic', label: '📚' }
  }

  const key = String(imageKey).toLowerCase().trim()
  const emoji = IMAGE_EMOJI_FALLBACKS[key]

  if (emoji) {
    return { type: 'emoji', label: emoji }
  }

  // Jamais afficher le mot en toutes lettres (sinon la réponse de la dictée /
  // de la lecture est donnée). On retombe sur un indice neutre.
  return { type: 'generic', label: '📚' }
}
