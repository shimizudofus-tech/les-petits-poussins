const EMOJIS = {
  poussin: '🐣',
  oeuf: '🥚',
  fleur: '🌸',
}

function makeCountEntries(count, difficulty) {
  return Object.entries(EMOJIS).map(([key, emoji], index) => ({
    id: `mat-petite-count-${count}-${key}`,
    section: 'petite',
    level: 'maternelle',
    subject: 'counting',
    count,
    emoji,
    emojiKey: key,
    difficulty,
  }))
}

export const petiteCountingExercises = [
  ...makeCountEntries(1, 1),
  ...makeCountEntries(2, 1),
  ...makeCountEntries(3, 1),
  ...makeCountEntries(4, 2),
  ...makeCountEntries(5, 3),
]
