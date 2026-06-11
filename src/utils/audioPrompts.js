/** Résout l'audioKey de consigne (bouton 🔊 principal) pour un exercice. */

const COLOR_SPEECH = {
  rouge: 'rouge',
  bleu: 'bleue',
  jaune: 'jaune',
  vert: 'verte',
  orange: 'orange',
  rose: 'rose',
  violet: 'violette',
  noir: 'noire',
  blanc: 'blanche',
  marron: 'marron',
  gris: 'gris',
}

const OBJECT_LABELS = {
  pomme: 'la pomme',
  banane: 'la banane',
  herbe: "l'herbe",
  ciel: 'le ciel',
  carotte: 'la carotte',
  fleur: 'la fleur',
  raisin: 'le raisin',
  mouton: 'le mouton',
  chat: 'le chat',
  soleil: 'le soleil',
  arbre: "l'arbre",
  souris: 'la souris',
  nuage: 'le nuage',
  caillou: 'le caillou',
}

function colorOfObjectPhrase(label) {
  if (label.startsWith('le ')) return `du ${label.slice(3)}`
  if (label.startsWith("l'")) return `de ${label}`
  if (label.startsWith('la ')) return `de ${label}`
  return `de ${label}`
}

const COUNT_LABELS = {
  poussin: 'poussins',
  oeuf: 'œufs',
  fleur: 'fleurs',
  pomme: 'pommes',
  etoile: 'étoiles',
}

export function promptKeyForPetiteColor(colorKey) {
  return `trouve_${colorKey}`
}

export function promptKeyForMoyenneColors(exercise) {
  if (!exercise) return null
  if (exercise.type === 'findObject') {
    const colorKey = exercise.colorKey ?? exercise.correct?.color
    return colorKey ? `trouve_objet_${colorKey}` : exercise.audioKey
  }
  if (exercise.type === 'findColor') {
    const objectKey = exercise.object?.id
    return objectKey ? `quelle_couleur_${objectKey}` : exercise.audioKey
  }
  return exercise.promptAudioKey ?? exercise.audioKey
}

export function promptKeyForCount(exercise) {
  if (!exercise) return null
  if (exercise.type === 'compare') {
    return exercise.compareType === 'more' ? 'le_plus' : 'le_moins'
  }
  const emojiKey = exercise.emojiKey ?? exercise.audioKey
  return emojiKey ? `compte_${emojiKey}` : 'compte'
}

export function promptKeyForShape(shapeKey) {
  return shapeKey ? `trouve_${shapeKey}` : null
}

export function resolvePromptSpeechText(key) {
  if (!key) return null

  if (key.startsWith('trouve_objet_')) {
    const color = key.replace('trouve_objet_', '')
    const spoken = COLOR_SPEECH[color] ?? color
    return `Trouve l'objet ${spoken}`
  }

  if (key.startsWith('quelle_couleur_')) {
    const objectKey = key.replace('quelle_couleur_', '')
    const label = OBJECT_LABELS[objectKey] ?? `le ${objectKey.replace(/_/g, ' ')}`
    return `Quelle est la couleur ${colorOfObjectPhrase(label)} ?`
  }

  if (key.startsWith('compte_')) {
    const thing = key.replace('compte_', '')
    const plural = COUNT_LABELS[thing] ?? thing
    return `Compte les ${plural}`
  }

  if (key.startsWith('trouve_')) {
    const target = key.replace('trouve_', '')
    if (COLOR_SPEECH[target]) {
      return `Trouve la couleur ${COLOR_SPEECH[target]}`
    }
    return `Trouve le ${target}`
  }

  return null
}
