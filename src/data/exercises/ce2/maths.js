// Maths CE2 (~8-9 ans) : add/sous à 3 chiffres, tables ×3..×9, divisions simples,
// comparaisons de grands nombres. Format identique CP/CE1 (numeric / comparison).
function fixedChoices(correct, candidates) {
  const merged = [correct]
  for (const value of candidates) {
    if (!merged.includes(value) && value >= 0) merged.push(value)
  }
  return merged.slice(0, 4)
}

// [a, b, answer, difficulty]
const additionPack = [
  [125, 40, 165, 1],
  [234, 123, 357, 1],
  [318, 51, 369, 1],
  [246, 137, 383, 2],
  [357, 228, 585, 2],
  [469, 256, 725, 3],
  [538, 347, 885, 3],
]

const subtractionPack = [
  [180, 60, 120, 1],
  [275, 134, 141, 1],
  [456, 123, 333, 2],
  [528, 245, 283, 2],
  [603, 247, 356, 3],
  [740, 385, 355, 3],
]

// tables ×3, ×4, ×6, ×7, ×8, ×9
const multPack = [
  [3, 7, 21, 1],
  [4, 6, 24, 1],
  [3, 9, 27, 1],
  [6, 6, 36, 2],
  [4, 8, 32, 2],
  [7, 8, 56, 2],
  [6, 9, 54, 2],
  [8, 7, 56, 3],
  [9, 8, 72, 3],
  [7, 9, 63, 3],
]

// divisions exactes simples
const divisionPack = [
  [12, 3, 4, 1],
  [20, 4, 5, 1],
  [24, 6, 4, 2],
  [42, 7, 6, 2],
  [54, 6, 9, 2],
  [63, 9, 7, 3],
  [72, 8, 9, 3],
  [56, 7, 8, 3],
]

// comparaisons de grands nombres
const comparisonPack = [
  [340, 304, '>', 1],
  [199, 201, '<', 1],
  [560, 560, '=', 1],
  [718, 781, '<', 2],
  [903, 309, '>', 2],
  [645, 654, '<', 3],
  [820, 280, '>', 3],
]

const additionExercises = additionPack.map(([a, b, answer, difficulty]) => ({
  id: `ce2-math-add-${a}-${b}`,
  level: 'ce2',
  subject: 'maths',
  type: 'addition',
  question: `${a} + ${b}`,
  answer,
  choices: fixedChoices(answer, [answer - 1, answer + 1, answer + 100, answer - 10, answer + 10]),
  difficulty,
}))

const subtractionExercises = subtractionPack.map(([a, b, answer, difficulty]) => ({
  id: `ce2-math-sub-${a}-${b}`,
  level: 'ce2',
  subject: 'maths',
  type: 'subtraction',
  question: `${a} − ${b}`,
  answer,
  choices: fixedChoices(answer, [answer + 1, answer - 1, answer + 100, answer - 10, answer + 10]),
  difficulty,
}))

const multExercises = multPack.map(([a, b, answer, difficulty]) => ({
  id: `ce2-math-mul-${a}-${b}`,
  level: 'ce2',
  subject: 'maths',
  type: 'multiplication',
  question: `${a} × ${b}`,
  answer,
  choices: fixedChoices(answer, [answer + a, answer - a, answer + b, answer - 1, answer + 1]),
  difficulty,
}))

const divisionExercises = divisionPack.map(([a, b, answer, difficulty]) => ({
  id: `ce2-math-div-${a}-${b}`,
  level: 'ce2',
  subject: 'maths',
  type: 'division',
  question: `${a} ÷ ${b}`,
  answer,
  choices: fixedChoices(answer, [answer + 1, answer - 1, answer + 2, answer - 2, b]),
  difficulty,
}))

const comparisonExercises = comparisonPack.map(([left, right, answer, difficulty], index) => ({
  id: `ce2-math-cmp-${index + 1}`,
  level: 'ce2',
  subject: 'maths',
  type: 'comparison',
  question: `${left} __ ${right} ?`,
  answer,
  choices: ['<', '=', '>'],
  difficulty,
}))

export const ce2MathExercises = [
  ...additionExercises,
  ...subtractionExercises,
  ...multExercises,
  ...divisionExercises,
  ...comparisonExercises,
]
