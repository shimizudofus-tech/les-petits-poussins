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
    section: 'moyenne',
    level: 'maternelle',
    subject: 'counting',
    type: 'count',
    emoji: EMOJIS[emojiKey],
    emojiKey,
    count,
    difficulty,
    audioKey: `compte_${emojiKey}`,
  }
}

function compareExercise(id, groupA, groupB, compareType, difficulty) {
  return {
    id,
    section: 'moyenne',
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
    audioKey: compareType === 'more' ? 'le_plus' : 'le_moins',
  }
}

export const moyenneCountingExercises = [
  countExercise('mat-moy-n-1-poussin', 'poussin', 1, 1),
  countExercise('mat-moy-n-2-oeuf', 'oeuf', 2, 1),
  countExercise('mat-moy-n-3-fleur', 'fleur', 3, 1),
  countExercise('mat-moy-n-2-pomme', 'pomme', 2, 1),

  countExercise('mat-moy-n-4-etoile', 'etoile', 4, 2),
  countExercise('mat-moy-n-5-poussin', 'poussin', 5, 2),
  countExercise('mat-moy-n-4-fleur', 'fleur', 4, 2),
  countExercise('mat-moy-n-5-oeuf', 'oeuf', 5, 2),

  compareExercise(
    'mat-moy-n-plus-1',
    { emojiKey: 'poussin', count: 3 },
    { emojiKey: 'oeuf', count: 1 },
    'more',
    3,
  ),
  compareExercise(
    'mat-moy-n-plus-2',
    { emojiKey: 'fleur', count: 5 },
    { emojiKey: 'pomme', count: 2 },
    'more',
    3,
  ),
  compareExercise(
    'mat-moy-n-moins-1',
    { emojiKey: 'oeuf', count: 1 },
    { emojiKey: 'poussin', count: 4 },
    'less',
    3,
  ),
  compareExercise(
    'mat-moy-n-moins-2',
    { emojiKey: 'pomme', count: 2 },
    { emojiKey: 'etoile', count: 5 },
    'less',
    3,
  ),
]
