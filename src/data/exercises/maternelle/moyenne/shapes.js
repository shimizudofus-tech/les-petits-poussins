const ROUND_OBJECTS = [
  { id: 'ballon', emoji: '⚽', label: 'Ballon', shapeId: 'circle' },
  { id: 'soleil', emoji: '☀️', label: 'Soleil', shapeId: 'circle' },
  { id: 'roue', emoji: '🛞', label: 'Roue', shapeId: 'circle' },
]

const SQUARE_OBJECTS = [
  { id: 'fenetre', emoji: '🪟', label: 'Fenêtre', shapeId: 'square' },
  { id: 'cadeau', emoji: '🎁', label: 'Cadeau', shapeId: 'square' },
]

const TRIANGLE_OBJECTS = [
  { id: 'montagne', emoji: '⛰️', label: 'Montagne', shapeId: 'triangle' },
  { id: 'tente', emoji: '⛺', label: 'Tente', shapeId: 'triangle' },
]

function findShape(id, shapeId, name, difficulty) {
  return {
    id,
    section: 'moyenne',
    level: 'maternelle',
    subject: 'shapes',
    type: 'findShape',
    shapeId,
    name,
    difficulty,
    audioKey: name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  }
}

function roundObject(id, correct, distractors, difficulty) {
  return {
    id,
    section: 'moyenne',
    level: 'maternelle',
    subject: 'shapes',
    type: 'roundObject',
    shapeId: 'circle',
    name: 'rond',
    promptLabel: 'rond',
    correct,
    distractors,
    difficulty,
    audioKey: 'cercle',
  }
}

export const moyenneShapeExercises = [
  findShape('mat-moy-s-cercle', 'circle', 'Cercle', 1),
  findShape('mat-moy-s-carre', 'square', 'Carré', 1),
  findShape('mat-moy-s-triangle', 'triangle', 'Triangle', 1),
  findShape('mat-moy-s-rectangle', 'rectangle', 'Rectangle', 1),
  roundObject('mat-moy-s-rond-1', ROUND_OBJECTS[0], [SQUARE_OBJECTS[0], TRIANGLE_OBJECTS[0]], 1),
  roundObject('mat-moy-s-rond-2', ROUND_OBJECTS[1], [SQUARE_OBJECTS[1], TRIANGLE_OBJECTS[1]], 1),

  findShape('mat-moy-s-etoile', 'star', 'Étoile', 2),
  findShape('mat-moy-s-coeur', 'heart', 'Cœur', 2),
  findShape('mat-moy-s-ovale', 'oval', 'Ovale', 2),
  {
    id: 'mat-moy-s-match-carre',
    section: 'moyenne',
    level: 'maternelle',
    subject: 'shapes',
    type: 'matchShape',
    shapeId: 'square',
    name: 'Carré',
    correct: SQUARE_OBJECTS[0],
    distractors: [ROUND_OBJECTS[0], TRIANGLE_OBJECTS[0]],
    difficulty: 2,
    audioKey: 'carre',
  },

  findShape('mat-moy-s-losange', 'diamond', 'Losange', 3),
  {
    id: 'mat-moy-s-match-triangle',
    section: 'moyenne',
    level: 'maternelle',
    subject: 'shapes',
    type: 'matchShape',
    shapeId: 'triangle',
    name: 'Triangle',
    correct: TRIANGLE_OBJECTS[0],
    distractors: [ROUND_OBJECTS[1], SQUARE_OBJECTS[1]],
    difficulty: 3,
    audioKey: 'triangle',
  },
  roundObject('mat-moy-s-rond-3', ROUND_OBJECTS[2], [SQUARE_OBJECTS[0], TRIANGLE_OBJECTS[1]], 3),
]
