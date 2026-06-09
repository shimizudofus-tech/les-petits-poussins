const OBJ = {
  pomme: { id: 'pomme', emoji: '🍎', label: 'Pomme', color: 'rouge' },
  banane: { id: 'banane', emoji: '🍌', label: 'Banane', color: 'jaune' },
  herbe: { id: 'herbe', emoji: '🌿', label: 'Herbe', color: 'vert' },
  ciel: { id: 'ciel', emoji: '☁️', label: 'Ciel', color: 'bleu' },
  carotte: { id: 'carotte', emoji: '🥕', label: 'Carotte', color: 'orange' },
  fleur: { id: 'fleur', emoji: '🌸', label: 'Fleur', color: 'rose' },
  raisin: { id: 'raisin', emoji: '🍇', label: 'Raisin', color: 'violet' },
  mouton: { id: 'mouton', emoji: '🐑', label: 'Mouton', color: 'blanc' },
  chat: { id: 'chat', emoji: '🐱', label: 'Chat', color: 'noir' },
  soleil: { id: 'soleil', emoji: '☀️', label: 'Soleil', color: 'jaune' },
  arbre: { id: 'arbre', emoji: '🌳', label: 'Arbre', color: 'vert' },
  souris: { id: 'souris', emoji: '🐭', label: 'Souris', color: 'gris' },
}

const COLORS = {
  rouge: { name: 'Rouge', hex: '#ef5350', audioKey: 'rouge' },
  bleu: { name: 'Bleu', hex: '#42a5f5', audioKey: 'bleu' },
  jaune: { name: 'Jaune', hex: '#ffeb3b', audioKey: 'jaune' },
  vert: { name: 'Vert', hex: '#66bb6a', audioKey: 'vert' },
  orange: { name: 'Orange', hex: '#ff9800', audioKey: 'orange' },
  rose: { name: 'Rose', hex: '#f48fb1', audioKey: 'rose' },
  violet: { name: 'Violet', hex: '#ab47bc', audioKey: 'violet' },
  noir: { name: 'Noir', hex: '#424242', audioKey: 'noir' },
  blanc: { name: 'Blanc', hex: '#fafafa', audioKey: 'blanc' },
  marron: { name: 'Marron', hex: '#8d6e63', audioKey: 'marron' },
  gris: { name: 'Gris', hex: '#9e9e9e', audioKey: 'gris' },
}

function findObject(id, targetKey, distractorKeys, difficulty) {
  const target = OBJ[targetKey]
  const color = COLORS[target.color]
  return {
    id,
    section: 'moyenne',
    level: 'maternelle',
    subject: 'colors',
    type: 'findObject',
    difficulty,
    colorName: color.name,
    colorHex: color.hex,
    audioKey: color.audioKey,
    correct: target,
    distractors: distractorKeys.map((k) => OBJ[k]),
  }
}

function findColor(id, objectKey, difficulty) {
  const object = OBJ[objectKey]
  const color = COLORS[object.color]
  const otherKeys = Object.keys(COLORS).filter((k) => k !== object.color)
  const picks = otherKeys.slice(0, 2)
  return {
    id,
    section: 'moyenne',
    level: 'maternelle',
    subject: 'colors',
    type: 'findColor',
    difficulty,
    object,
    colorName: color.name,
    correctHex: color.hex,
    audioKey: object.id,
    colorOptions: [color, ...picks.map((k) => COLORS[k])],
  }
}

export const moyenneColorExercises = [
  findObject('mat-moy-c-obj-rouge', 'pomme', ['banane', 'herbe'], 1),
  findObject('mat-moy-c-obj-bleu', 'ciel', ['pomme', 'soleil'], 1),
  findObject('mat-moy-c-obj-jaune', 'banane', ['herbe', 'pomme'], 1),
  findObject('mat-moy-c-obj-vert', 'herbe', ['pomme', 'ciel'], 1),
  findColor('mat-moy-c-col-pomme', 'pomme', 1),
  findColor('mat-moy-c-col-banane', 'banane', 1),
  findColor('mat-moy-c-col-herbe', 'herbe', 1),
  findColor('mat-moy-c-col-ciel', 'ciel', 1),

  findObject('mat-moy-c-obj-orange', 'carotte', ['banane', 'fleur'], 2),
  findObject('mat-moy-c-obj-rose', 'fleur', ['pomme', 'raisin'], 2),
  findObject('mat-moy-c-obj-violet', 'raisin', ['fleur', 'ciel'], 2),
  findColor('mat-moy-c-col-carotte', 'carotte', 2),
  findColor('mat-moy-c-col-fleur', 'fleur', 2),
  findColor('mat-moy-c-col-raisin', 'raisin', 2),

  findObject('mat-moy-c-obj-noir', 'chat', ['mouton', 'pomme'], 3),
  findObject('mat-moy-c-obj-blanc', 'mouton', ['chat', 'ciel'], 3),
  findObject('mat-moy-c-obj-marron', 'arbre', ['chat', 'herbe'], 3),
  findObject('mat-moy-c-obj-gris', 'souris', ['chat', 'mouton'], 3),
  findColor('mat-moy-c-col-chat', 'chat', 3),
  findColor('mat-moy-c-col-mouton', 'mouton', 3),
]
