function fixedChoices(correct, candidates) {
  const set = new Set([correct, ...candidates])
  return [...set].slice(0, 4)
}

const additionExercises = []
for (let a = 1; a <= 9; a++) {
  for (let b = 1; b <= 9; b++) {
    if (a + b > 10) continue
    const answer = a + b
    additionExercises.push({
      id: `cp-math-add-${a}-${b}`,
      level: 'cp',
      subject: 'maths',
      type: 'addition',
      question: `${a} + ${b}`,
      answer,
      choices: fixedChoices(answer, [answer - 1, answer + 1, answer + 2, answer - 2]),
      difficulty: answer <= 5 ? 1 : 2,
    })
  }
}

const subtractionExercises = []
for (let a = 2; a <= 10; a++) {
  for (let b = 1; b < a; b++) {
    const answer = a - b
    subtractionExercises.push({
      id: `cp-math-sub-${a}-${b}`,
      level: 'cp',
      subject: 'maths',
      type: 'subtraction',
      question: `${a} − ${b}`,
      answer,
      choices: fixedChoices(answer, [answer + 1, answer - 1, answer + 2, b]),
      difficulty: answer <= 3 ? 1 : 2,
    })
  }
}

const comparisonPairs = [
  [3, 5, '<'],
  [7, 4, '>'],
  [6, 6, '='],
  [2, 8, '<'],
  [9, 1, '>'],
  [5, 5, '='],
  [4, 7, '<'],
  [10, 6, '>'],
  [1, 1, '='],
  [8, 3, '>'],
]

const comparisonExercises = comparisonPairs.map(([left, right, answer], index) => ({
  id: `cp-math-cmp-${index + 1}`,
  level: 'cp',
  subject: 'maths',
  type: 'comparison',
  question: `${left} __ ${right} ?`,
  answer,
  choices: ['<', '=', '>'],
  difficulty: 1,
}))

export const cpMathExercises = [
  ...additionExercises,
  ...subtractionExercises,
  ...comparisonExercises,
]
