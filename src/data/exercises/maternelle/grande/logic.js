function oddOneOut(id, items, answer, options, difficulty) {
  return {
    id,
    section: 'grande',
    level: 'maternelle',
    subject: 'logic',
    type: 'oddOneOut',
    items,
    answer,
    options,
    difficulty,
    promptAudioKey: 'trouve_intrus',
  }
}

function completeSequence(id, sequence, answer, options, difficulty, patternType) {
  return {
    id,
    section: 'grande',
    level: 'maternelle',
    subject: 'logic',
    type: 'complete',
    sequence,
    answer,
    options,
    patternType,
    difficulty,
    promptAudioKey: 'continue_suite',
  }
}

export const grandeLogicExercises = [
  oddOneOut('mat-grd-log-intrus-1', ['🐣', '🐣', '🐣', '🍎'], '🍎', ['🐣', '🍎', '🌸'], 1),
  oddOneOut('mat-grd-log-intrus-2', ['🌸', '🌸', '⭐', '🌸'], '⭐', ['🌸', '⭐', '🐣'], 1),
  oddOneOut('mat-grd-log-intrus-3', ['🔴', '🔴', '🔵', '🔴'], '🔵', ['🔴', '🔵', '🟡'], 1),
  oddOneOut('mat-grd-log-intrus-4', ['🥚', '🥚', '🥚', '🐣'], '🐣', ['🥚', '🐣', '⭐'], 1),

  completeSequence(
    'mat-grd-log-ab-1',
    ['🔴', '🔵', '🔴', '🔵'],
    '🔴',
    ['🔴', '🔵', '🟡'],
    2,
    'ABAB',
  ),
  completeSequence(
    'mat-grd-log-ab-2',
    ['🐣', '🥚', '🐣', '🥚'],
    '🐣',
    ['🐣', '🥚', '🌸'],
    2,
    'ABAB',
  ),
  completeSequence(
    'mat-grd-log-aab-1',
    ['🥚', '🥚', '🐣', '🥚', '🥚'],
    '🐣',
    ['🐣', '🥚', '⭐'],
    2,
    'AAB',
  ),
  oddOneOut('mat-grd-log-intrus-5', ['⭐', '⭐', '🍎', '⭐'], '🍎', ['⭐', '🍎', '🌸'], 2),

  completeSequence(
    'mat-grd-log-abc-1',
    ['⭐', '🌸', '🍎', '⭐', '🌸', '🍎'],
    '⭐',
    ['⭐', '🌸', '🍎'],
    3,
    'ABC',
  ),
  completeSequence(
    'mat-grd-log-abc-2',
    ['🔴', '🔵', '🟡', '🔴', '🔵'],
    '🟡',
    ['🟡', '🔴', '🔵'],
    3,
    'ABC',
  ),
  oddOneOut('mat-grd-log-intrus-6', ['🐣', '🐣', '🌸', '🐣'], '🌸', ['🐣', '🌸', '🥚'], 3),
  oddOneOut('mat-grd-log-intrus-7', ['🍎', '🍎', '⭐', '🍎'], '⭐', ['🍎', '⭐', '🐣'], 3),
]
