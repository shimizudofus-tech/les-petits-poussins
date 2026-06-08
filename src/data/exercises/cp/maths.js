function fixedChoices(correct, candidates) {
  const merged = [correct]
  for (const value of candidates) {
    if (!merged.includes(value)) merged.push(value)
  }
  return merged.slice(0, 4)
}

const additionPack = [
  [1, 1, 2],
  [1, 2, 3],
  [2, 2, 4],
  [2, 3, 5],
  [3, 3, 6],
  [3, 4, 7],
  [4, 4, 8],
  [4, 5, 9],
  [5, 5, 10],
  [6, 2, 8],
  [7, 1, 8],
  [8, 2, 10],
]

const subtractionPack = [
  [2, 1, 1],
  [3, 1, 2],
  [4, 2, 2],
  [5, 2, 3],
  [6, 3, 3],
  [7, 2, 5],
  [8, 4, 4],
  [9, 5, 4],
  [10, 5, 5],
  [10, 2, 8],
]

const comparisonPack = [
  [2, 3, '<'],
  [5, 5, '='],
  [7, 4, '>'],
  [1, 6, '<'],
  [8, 8, '='],
  [9, 2, '>'],
  [4, 6, '<'],
  [10, 3, '>'],
  [0, 1, '<'],
  [6, 6, '='],
]

const additionExercises = additionPack.map(([a, b, answer]) => ({
  id: `cp-math-add-${a}-${b}`,
  level: 'cp',
  subject: 'maths',
  type: 'addition',
  question: `${a} + ${b}`,
  answer,
  choices: fixedChoices(answer, [answer - 1, answer + 1, answer + 2, answer - 2, b, a]),
  difficulty: answer <= 5 ? 1 : 2,
}))

const subtractionExercises = subtractionPack.map(([a, b, answer]) => ({
  id: `cp-math-sub-${a}-${b}`,
  level: 'cp',
  subject: 'maths',
  type: 'subtraction',
  question: `${a} − ${b}`,
  answer,
  choices: fixedChoices(answer, [answer + 1, answer - 1, answer + 2, b, a - b + 1]),
  difficulty: answer <= 3 ? 1 : 2,
}))

const comparisonExercises = comparisonPack.map(([left, right, answer], index) => ({
  id: `cp-math-cmp-pack1-${index + 1}`,
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
