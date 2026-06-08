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

  return { type: 'text', label: key.toUpperCase() }
}
