// Maths CM2 (~10-11 ans) : mult à 2 chiffres, divisions, décimaux, fractions,
// pourcentages, priorités opératoires. Format identique CE2.
function choices(correct, cands) {
  const out = [correct]
  for (const v of cands) if (!out.includes(v) && v >= 0) out.push(v)
  return out.slice(0, 4)
}

const mult = [
  [12, 11, 132, 1], [15, 12, 180, 1], [14, 13, 182, 2],
  [23, 14, 322, 2], [25, 16, 400, 3], [32, 21, 672, 3],
]
const div = [
  [96, 8, 12, 1], [120, 10, 12, 1], [144, 12, 12, 2],
  [156, 12, 13, 2], [225, 15, 15, 3], [196, 14, 14, 3],
]
// décimaux (réponses entières pour le QCM)
const deci = [
  ['2,5 + 1,5', 4, 1], ['3,5 + 2,5', 6, 1], ['10 − 2,5', '7,5', 2],
  ['1,5 × 4', 6, 2], ['2,5 × 4', 10, 3], ['7,5 + 2,5', 10, 3],
]
const frac = [
  ['3/4 de 20', 15, 1], ['2/3 de 9', 6, 1], ['3/5 de 25', 15, 2],
  ['2/3 de 30', 20, 2], ['5/6 de 36', 30, 3], ['3/8 de 40', 15, 3],
]
const pct = [
  ['50% de 80', 40, 1], ['10% de 200', 20, 1], ['25% de 60', 15, 2],
  ['20% de 50', 10, 2], ['75% de 80', 60, 3], ['30% de 90', 27, 3],
]
const order = [
  ['5 + 3 × 2', 11, 2], ['10 − 2 × 3', 4, 2], ['(4 + 6) × 2', 20, 3], ['12 ÷ 3 + 5', 9, 3],
]

const numericPack = (arr, tag, type) =>
  arr.map(([q, r, d], i) => ({
    id: `cm2-${tag}-${i}`, level: 'cm2', subject: 'maths', type,
    question: q,
    answer: r,
    choices: choices(r, typeof r === 'number' ? [r + 1, r - 1, r + 5, r - 2] : [r, '8', '5', '9']),
    difficulty: d,
  }))

export const cm2MathExercises = [
  ...mult.map(([a, b, r, d]) => ({ id: `cm2-mul-${a}-${b}`, level: 'cm2', subject: 'maths', type: 'multiplication', question: `${a} × ${b}`, answer: r, choices: choices(r, [r + b, r - a, r + 10, r + 2]), difficulty: d })),
  ...div.map(([a, b, r, d]) => ({ id: `cm2-div-${a}-${b}`, level: 'cm2', subject: 'maths', type: 'division', question: `${a} ÷ ${b}`, answer: r, choices: choices(r, [r + 1, r - 1, r + 2, b]), difficulty: d })),
  ...numericPack(deci, 'deci', 'decimal'),
  ...numericPack(frac, 'frac', 'fraction'),
  ...numericPack(pct, 'pct', 'percent'),
  ...numericPack(order, 'ord', 'order'),
]
