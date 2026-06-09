function findLetter(id, letter, distractors, difficulty) {
  return {
    id,
    section: 'grande',
    level: 'maternelle',
    subject: 'letters',
    type: 'findLetter',
    letter,
    correct: letter,
    distractors,
    difficulty,
    audioKey: `lettre_${letter.toLowerCase()}`,
  }
}

export const grandeLetterExercises = [
  findLetter('mat-grd-l-a', 'A', ['E', 'I'], 1),
  findLetter('mat-grd-l-e', 'E', ['A', 'O'], 1),
  findLetter('mat-grd-l-i', 'I', ['O', 'U'], 1),
  findLetter('mat-grd-l-o', 'O', ['A', 'U'], 1),
  findLetter('mat-grd-l-u', 'U', ['E', 'O'], 1),

  findLetter('mat-grd-l-m', 'M', ['P', 'L'], 2),
  findLetter('mat-grd-l-p', 'P', ['M', 'R'], 2),
  findLetter('mat-grd-l-l', 'L', ['R', 'S'], 2),
  findLetter('mat-grd-l-r', 'R', ['S', 'M'], 2),
  findLetter('mat-grd-l-s', 'S', ['L', 'R'], 2),

  findLetter('mat-grd-l-b', 'B', ['D', 'T'], 3),
  findLetter('mat-grd-l-d', 'D', ['B', 'F'], 3),
  findLetter('mat-grd-l-t', 'T', ['F', 'N'], 3),
  findLetter('mat-grd-l-f', 'F', ['N', 'B'], 3),
  findLetter('mat-grd-l-n', 'N', ['T', 'D'], 3),
]
