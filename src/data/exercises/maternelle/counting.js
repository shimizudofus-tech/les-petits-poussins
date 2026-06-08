const COUNT_EMOJIS = ['🐔', '🌻', '🍎', '⭐', '🐮']

export const maternelleCountingExercises = []

for (let count = 1; count <= 5; count++) {
  COUNT_EMOJIS.forEach((emoji, emojiIndex) => {
    maternelleCountingExercises.push({
      id: `mat-count-${count}-${emojiIndex}`,
      level: 'maternelle',
      subject: 'counting',
      count,
      emoji,
      difficulty: count <= 3 ? 1 : 2,
    })
  })
}
