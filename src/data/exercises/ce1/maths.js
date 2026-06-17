// Maths CE1 (~7-8 ans) : additions/soustractions à 2 chiffres, tables ×2/×5/×10,
// compléments, comparaisons de nombres. Même format que le CP (numeric / comparison).
function fixedChoices(correct, candidates) {
  const merged = [correct]
  for (const value of candidates) {
    if (!merged.includes(value) && value >= 0) merged.push(value)
  }
  return merged.slice(0, 4)
}

// [a, b, answer, difficulty]
const additionPack = [
  [10, 5, 15, 1],
  [12, 4, 16, 1],
  [20, 7, 27, 1],
  [13, 6, 19, 1],
  [25, 13, 38, 2],
  [34, 23, 57, 2],
  [27, 18, 45, 2],
  [46, 27, 73, 3],
  [38, 36, 74, 3],
  [49, 28, 77, 3],
]

const subtractionPack = [
  [18, 6, 12, 1],
  [25, 4, 21, 1],
  [29, 7, 22, 1],
  [37, 14, 23, 2],
  [48, 23, 25, 2],
  [56, 31, 25, 2],
  [62, 27, 35, 3],
  [74, 38, 36, 3],
  [90, 45, 45, 3],
]

// tables ×2, ×5, ×10
const multPack = [
  [2, 3, 6, 1],
  [2, 6, 12, 1],
  [5, 2, 10, 1],
  [5, 4, 20, 2],
  [5, 6, 30, 2],
  [10, 3, 30, 1],
  [10, 7, 70, 2],
  [2, 9, 18, 2],
  [5, 8, 40, 3],
  [10, 9, 90, 2],
]

// compléments à 10 / 100
const complementPack = [
  [7, 10, 3, 1],
  [4, 10, 6, 1],
  [30, 100, 70, 2],
  [60, 100, 40, 2],
  [25, 100, 75, 3],
  [80, 100, 20, 2],
]

// comparaisons de nombres à 2 chiffres
const comparisonPack = [
  [34, 43, '<', 1],
  [56, 56, '=', 1],
  [72, 27, '>', 1],
  [19, 91, '<', 2],
  [40, 38, '>', 2],
  [65, 65, '=', 2],
  [88, 89, '<', 3],
  [70, 17, '>', 3],
]

const additionExercises = additionPack.map(([a, b, answer, difficulty]) => ({
  id: `ce1-math-add-${a}-${b}`,
  level: 'ce1',
  subject: 'maths',
  type: 'addition',
  question: `${a} + ${b}`,
  answer,
  choices: fixedChoices(answer, [answer - 1, answer + 1, answer + 10, answer - 10, answer + 2]),
  difficulty,
}))

const subtractionExercises = subtractionPack.map(([a, b, answer, difficulty]) => ({
  id: `ce1-math-sub-${a}-${b}`,
  level: 'ce1',
  subject: 'maths',
  type: 'subtraction',
  question: `${a} − ${b}`,
  answer,
  choices: fixedChoices(answer, [answer + 1, answer - 1, answer + 10, answer - 10, answer + 2]),
  difficulty,
}))

const multExercises = multPack.map(([a, b, answer, difficulty]) => ({
  id: `ce1-math-mul-${a}-${b}`,
  level: 'ce1',
  subject: 'maths',
  type: 'multiplication',
  question: `${a} × ${b}`,
  answer,
  choices: fixedChoices(answer, [answer + a, answer - a, answer + 1, answer - 2, answer + 2]),
  difficulty,
}))

const complementExercises = complementPack.map(([a, total, answer, difficulty]) => ({
  id: `ce1-math-cmp10-${a}-${total}`,
  level: 'ce1',
  subject: 'maths',
  type: 'complement',
  question: `${a} + ? = ${total}`,
  answer,
  choices: fixedChoices(answer, [answer + 1, answer - 1, total - answer, answer + 10, answer - 10]),
  difficulty,
}))

const comparisonExercises = comparisonPack.map(([left, right, answer, difficulty], index) => ({
  id: `ce1-math-cmp-${index + 1}`,
  level: 'ce1',
  subject: 'maths',
  type: 'comparison',
  question: `${left} __ ${right} ?`,
  answer,
  choices: ['<', '=', '>'],
  difficulty,
}))

export const ce1MathExercises = [
  ...additionExercises,
  ...subtractionExercises,
  ...multExercises,
  ...complementExercises,
  ...comparisonExercises,
]
