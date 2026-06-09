function pattern(id, sequence, answer, options, difficulty, patternType) {
  return {
    id,
    section: 'moyenne',
    level: 'maternelle',
    subject: 'patterns',
    type: 'complete',
    sequence,
    answer,
    options,
    patternType,
    difficulty,
    audioKey: null,
  }
}

export const moyennePatternExercises = [
  pattern('mat-moy-p-ab-rouge', ['🔴', '🔵', '🔴', '🔵'], '🔴', ['🔴', '🔵', '🟡'], 1, 'ABAB'),
  pattern('mat-moy-p-ab-poussin', ['🐣', '🥚', '🐣', '🥚'], '🐣', ['🐣', '🥚', '🌸'], 1, 'ABAB'),
  pattern('mat-moy-p-ab-fleur', ['⭐', '🌸', '⭐', '🌸'], '⭐', ['⭐', '🌸', '🍎'], 1, 'ABAB'),
  pattern('mat-moy-p-ab-vert', ['🟢', '🟡', '🟢', '🟡'], '🟢', ['🟢', '🟡', '🔵'], 1, 'ABAB'),

  pattern('mat-moy-p-aab-rouge', ['🔴', '🔴', '🔵', '🔴', '🔴'], '🔵', ['🔵', '🔴', '🟡'], 2, 'AAB'),
  pattern('mat-moy-p-aab-oeuf', ['🥚', '🥚', '🐣', '🥚', '🥚'], '🐣', ['🐣', '🥚', '⭐'], 2, 'AAB'),
  pattern('mat-moy-p-aab-pomme', ['🍎', '🍎', '⭐', '🍎', '🍎'], '⭐', ['⭐', '🍎', '🌸'], 2, 'AAB'),

  pattern('mat-moy-p-abc-couleur', ['🔴', '🔵', '🟡', '🔴', '🔵'], '🟡', ['🟡', '🔴', '🔵'], 3, 'ABC'),
  pattern('mat-moy-p-abc-nature', ['🐣', '🥚', '🌸', '🐣', '🥚'], '🌸', ['🌸', '🐣', '⭐'], 3, 'ABC'),
  pattern('mat-moy-p-abc-fruit', ['🍎', '⭐', '🍌', '🍎', '⭐'], '🍌', ['🍌', '🍎', '⭐'], 3, 'ABC'),
]
