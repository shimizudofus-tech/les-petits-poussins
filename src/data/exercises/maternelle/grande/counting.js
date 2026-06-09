const EMOJIS = {
  poussin: '🐣',
  oeuf: '🥚',
  fleur: '🌸',
  pomme: '🍎',
  etoile: '⭐',
}

function countExercise(id, emojiKey, count, difficulty) {
  return {
    id,
    section: 'grande',
    level: 'maternelle',
    subject: 'counting',
    type: 'count',
    emoji: EMOJIS[emojiKey],
    emojiKey,
    count,
    difficulty,
    audioKey: emojiKey,
  }
}

function compareExercise(id, groupA, groupB, compareType, difficulty) {
  return {
    id,
    section: 'grande',
    level: 'maternelle',
    subject: 'counting',
    type: 'compare',
    compareType,
    groupA: { ...groupA, emoji: EMOJIS[groupA.emojiKey] },
    groupB: { ...groupB, emoji: EMOJIS[groupB.emojiKey] },
    answer: compareType === 'more'
      ? groupA.count > groupB.count
        ? 'A'
        : 'B'
      : groupA.count < groupB.count
        ? 'A'
        : 'B',
    difficulty,
    audioKey: groupA.emojiKey,
  }
}

export const grandeCountingExercises = [
  countExercise('mat-grd-n-1-poussin', 'poussin', 1, 1),
  countExercise('mat-grd-n-3-oeuf', 'oeuf', 3, 1),
  countExercise('mat-grd-n-4-fleur', 'fleur', 4, 1),
  countExercise('mat-grd-n-5-pomme', 'pomme', 5, 1),

  countExercise('mat-grd-n-6-etoile', 'etoile', 6, 2),
  countExercise('mat-grd-n-7-poussin', 'poussin', 7, 2),
  countExercise('mat-grd-n-8-fleur', 'fleur', 8, 2),
  countExercise('mat-grd-n-9-oeuf', 'oeuf', 9, 2),
  countExercise('mat-grd-n-10-pomme', 'pomme', 10, 2),

  compareExercise(
    'mat-grd-n-plus-1',
    { emojiKey: 'poussin', count: 7 },
    { emojiKey: 'oeuf', count: 3 },
    'more',
    3,
  ),
  compareExercise(
    'mat-grd-n-plus-2',
    { emojiKey: 'fleur', count: 10 },
    { emojiKey: 'pomme', count: 6 },
    'more',
    3,
  ),
  compareExercise(
    'mat-grd-n-moins-1',
    { emojiKey: 'oeuf', count: 2 },
    { emojiKey: 'poussin', count: 8 },
    'less',
    3,
  ),
  compareExercise(
    'mat-grd-n-moins-2',
    { emojiKey: 'pomme', count: 4 },
    { emojiKey: 'etoile', count: 9 },
    'less',
    3,
  ),
]
