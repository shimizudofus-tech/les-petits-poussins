// Maths CM1 (~9-10 ans) : mult 2 chiffres ×1, divisions, grands nombres,
// fractions simples (moitié/quart), comparaisons. Format identique CE2.
function choices(correct, cands) {
  const out = [correct]
  for (const v of cands) if (!out.includes(v) && v >= 0) out.push(v)
  return out.slice(0, 4)
}

const mult = [
  [13, 4, 52, 1], [23, 3, 69, 1], [14, 5, 70, 1], [21, 6, 126, 2],
  [32, 4, 128, 2], [25, 7, 175, 2], [34, 6, 204, 3], [46, 8, 368, 3],
]
const div = [
  [48, 6, 8, 1], [56, 7, 8, 1], [63, 9, 7, 2], [72, 8, 9, 2],
  [81, 9, 9, 2], [96, 8, 12, 3], [144, 12, 12, 3],
]
const addsub = [
  [1250, 340, 1590, '+', 1], [2480, 150, 2330, '−', 1], [3600, 1200, 4800, '+', 2],
  [5000, 1750, 3250, '−', 2], [4825, 2390, 7215, '+', 3], [6300, 2840, 3460, '−', 3],
]
const frac = [
  ['La moitié de 24', 12, 1], ['Le quart de 20', 5, 1], ['La moitié de 50', 25, 2],
  ['Le quart de 40', 10, 2], ['La moitié de 86', 43, 3], ['Le quart de 100', 25, 3],
]
const comp = [
  [1240, 1420, '<', 1], [3500, 3050, '>', 1], [2700, 2700, '=', 2],
  [4810, 4180, '>', 2], [9090, 9900, '<', 3],
]

export const cm1MathExercises = [
  ...mult.map(([a, b, r, d]) => ({ id: `cm1-mul-${a}-${b}`, level: 'cm1', subject: 'maths', type: 'multiplication', question: `${a} × ${b}`, answer: r, choices: choices(r, [r + a, r - b, r + 10, r - 1, r + 1]), difficulty: d })),
  ...div.map(([a, b, r, d]) => ({ id: `cm1-div-${a}-${b}`, level: 'cm1', subject: 'maths', type: 'division', question: `${a} ÷ ${b}`, answer: r, choices: choices(r, [r + 1, r - 1, r + 2, b]), difficulty: d })),
  ...addsub.map(([a, b, r, op, d]) => ({ id: `cm1-${op === '+' ? 'add' : 'sub'}-${a}-${b}`, level: 'cm1', subject: 'maths', type: op === '+' ? 'addition' : 'subtraction', question: `${a} ${op} ${b}`, answer: r, choices: choices(r, [r + 100, r - 100, r + 10, r - 10]), difficulty: d })),
  ...frac.map(([q, r, d], i) => ({ id: `cm1-frac-${i}`, level: 'cm1', subject: 'maths', type: 'fraction', question: q, answer: r, choices: choices(r, [r + 1, r - 1, r + 5, r - 2]), difficulty: d })),
  ...comp.map(([l, r, ans, d], i) => ({ id: `cm1-cmp-${i}`, level: 'cm1', subject: 'maths', type: 'comparison', question: `${l} __ ${r} ?`, answer: ans, choices: ['<', '=', '>'], difficulty: d })),
]
