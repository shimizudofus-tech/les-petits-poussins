// Générateur procédural de maths (CP → CM2).
// Produit un exercice frais à chaque appel, même format que les listes statiques :
//   { id, level, subject:'maths', type, question, answer, choices:[...], difficulty }
// → contenu illimité, jamais répétitif, difficulté croissante.

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// 4 réponses : la bonne + 3 distracteurs proches, sans doublon ni négatif.
function buildChoices(answer, spreads = [1, -1, 2, -2, 10, -10]) {
  const set = new Set([answer])
  let guard = 0
  while (set.size < 4 && guard++ < 60) {
    const cand = answer + pick(spreads)
    if (cand >= 0 && cand !== answer) set.add(cand)
  }
  let pad = answer + 1
  while (set.size < 4) {
    if (pad !== answer && pad >= 0) set.add(pad)
    pad++
  }
  return [...set].sort(() => Math.random() - 0.5)
}

// Plages de nombres par niveau et difficulté (1..3).
const RANGES = {
  cp:  { add: [9, 14, 20], sub: [9, 14, 20], mulMax: 0, divMax: 0, big: [10, 20, 30] },
  ce1: { add: [29, 59, 99], sub: [29, 59, 99], mulTables: [2, 5, 10], divMax: 0, big: [50, 99, 199] },
  ce2: { add: [199, 499, 999], sub: [199, 499, 999], mulTables: [2, 3, 4, 5, 6, 7, 8, 9], divMax: 50, big: [200, 500, 999] },
  cm1: { add: [999, 4999, 9999], sub: [999, 4999, 9999], mulTables: [2, 3, 4, 5, 6, 7, 8, 9, 11, 12], divMax: 100, big: [1000, 5000, 9999] },
  cm2: { add: [9999, 49999, 99999], sub: [9999, 49999, 99999], mulTables: [3, 4, 6, 7, 8, 9, 11, 12, 25], divMax: 144, big: [10000, 99999, 999999] },
}

// Quelles opérations sont proposées par niveau.
const OPS = {
  cp:  ['addition', 'subtraction', 'comparison', 'complement', 'problem'],
  ce1: ['addition', 'subtraction', 'multiplication', 'comparison', 'complement', 'problem'],
  ce2: ['addition', 'subtraction', 'multiplication', 'division', 'comparison', 'problem'],
  cm1: ['addition', 'subtraction', 'multiplication', 'division', 'fraction', 'comparison', 'problem'],
  cm2: ['addition', 'subtraction', 'multiplication', 'division', 'percent', 'comparison', 'problem'],
}

function genAddition(level, d) {
  const max = RANGES[level].add[d - 1]
  const a = rnd(Math.ceil(max / 3), max)
  const b = rnd(1, max)
  const answer = a + b
  return { type: 'addition', question: `${a} + ${b}`, answer, choices: buildChoices(answer, [1, -1, 2, -2, 10, -10, 11, -11]) }
}

function genSubtraction(level, d) {
  const max = RANGES[level].sub[d - 1]
  const a = rnd(Math.ceil(max / 2), max)
  const b = rnd(1, a)
  const answer = a - b
  return { type: 'subtraction', question: `${a} − ${b}`, answer, choices: buildChoices(answer, [1, -1, 2, -2, 10, -10]) }
}

function genMultiplication(level, d) {
  const tables = RANGES[level].mulTables ?? [2, 5, 10]
  const a = pick(tables)
  const b = rnd(d === 1 ? 1 : 2, d === 1 ? 6 : 10)
  const answer = a * b
  return { type: 'multiplication', question: `${a} × ${b}`, answer, choices: buildChoices(answer, [a, -a, 1, -1, 2, -2, a + 1]) }
}

function genDivision(level, d) {
  const tables = RANGES[level].mulTables ?? [2, 3, 4, 5]
  const divisor = pick(tables.filter((t) => t >= 2 && t <= 12)) || 2
  const quotient = rnd(2, d === 1 ? 5 : d === 2 ? 9 : 12)
  const dividend = divisor * quotient
  return { type: 'division', question: `${dividend} ÷ ${divisor}`, answer: quotient, choices: buildChoices(quotient, [1, -1, 2, -2, 3, -3]) }
}

function genComplement(level, d) {
  const total = level === 'cp' ? 10 : pick([10, 100])
  const a = rnd(1, total - 1)
  const answer = total - a
  return { type: 'complement', question: `${a} + ? = ${total}`, answer, choices: buildChoices(answer, [1, -1, 2, -2, 5, -5, 10, -10]) }
}

function genComparison(level, d) {
  const max = RANGES[level].big[d - 1]
  const left = rnd(1, max)
  // 1 chance sur 4 d'être égal
  const right = Math.random() < 0.25 ? left : rnd(1, max)
  const answer = left < right ? '<' : left > right ? '>' : '='
  return { type: 'comparison', question: `${left} __ ${right} ?`, answer, choices: ['<', '=', '>'] }
}

function genFraction(level, d) {
  // « moitié / quart / tiers de N » (N multiple du dénominateur)
  const denom = pick(d === 1 ? [2] : [2, 4, 3])
  const quotient = rnd(2, d === 1 ? 6 : 10)
  const n = denom * quotient
  const word = denom === 2 ? 'la moitié' : denom === 4 ? 'le quart' : 'le tiers'
  return { type: 'fraction', question: `${word} de ${n}`, answer: quotient, choices: buildChoices(quotient, [1, -1, 2, -2, denom, -denom]) }
}

function genPercent(level, d) {
  // « X % de N » avec pourcentages ronds
  const pct = pick(d === 1 ? [50, 10] : [50, 25, 10, 20, 75])
  const base = pick([20, 40, 60, 80, 100, 200])
  const answer = Math.round((pct / 100) * base)
  return { type: 'percent', question: `${pct}% de ${base}`, answer, choices: buildChoices(answer, [1, -1, 2, -2, 5, -5, 10, -10]) }
}

// Petits problèmes (énoncés courts) → réponse numérique.
const NAMES = ['Léo', 'Mia', 'Tom', 'Lou', 'Noé', 'Jade', 'Sam', 'Emma']
const OBJECTS = [
  { s: 'bille', p: 'billes' }, { s: 'pomme', p: 'pommes' }, { s: 'image', p: 'images' },
  { s: 'bonbon', p: 'bonbons' }, { s: 'crayon', p: 'crayons' }, { s: 'fleur', p: 'fleurs' },
  { s: 'œuf', p: 'œufs' }, { s: 'autocollant', p: 'autocollants' },
]

function genProblem(level, d) {
  const max = RANGES[level].add[d - 1]
  const name = pick(NAMES)
  const obj = pick(OBJECTS)
  const kind = level === 'cp' || level === 'ce1' ? pick(['add', 'sub']) : pick(['add', 'sub', 'mul', 'div'])

  if (kind === 'add') {
    const a = rnd(2, max), b = rnd(1, max)
    return { type: 'problem', question: `${name} a ${a} ${obj.p}. ${name} en gagne ${b}. Combien en a ${name} ?`, answer: a + b, choices: buildChoices(a + b, [1, -1, 2, -2, 10, -10]) }
  }
  if (kind === 'sub') {
    const a = rnd(Math.ceil(max / 2), max), b = rnd(1, a)
    return { type: 'problem', question: `${name} a ${a} ${obj.p}. ${name} en donne ${b}. Combien en reste-t-il ?`, answer: a - b, choices: buildChoices(a - b, [1, -1, 2, -2, 10, -10]) }
  }
  if (kind === 'mul') {
    const a = rnd(2, 6), b = rnd(2, 9)
    return { type: 'problem', question: `${a} boîtes de ${b} ${obj.p}. Combien de ${obj.p} en tout ?`, answer: a * b, choices: buildChoices(a * b, [a, -a, b, -b, 1, -1, 2]) }
  }
  // div
  const b = rnd(2, 6), q = rnd(2, 8), total = b * q
  return { type: 'problem', question: `${total} ${obj.p} partagés entre ${b} amis. Combien chacun ?`, answer: q, choices: buildChoices(q, [1, -1, 2, -2, 3]) }
}

const GENERATORS = {
  addition: genAddition,
  subtraction: genSubtraction,
  multiplication: genMultiplication,
  division: genDivision,
  complement: genComplement,
  comparison: genComparison,
  fraction: genFraction,
  percent: genPercent,
  problem: genProblem,
}

// Génère un exercice de maths pour un niveau donné (cp..cm2), difficulté 1..3.
export function generateMathExercise(level = 'cp', maxDifficulty = 1) {
  const ops = OPS[level] ?? OPS.cp
  const op = pick(ops)
  const d = rnd(1, Math.max(1, Math.min(3, maxDifficulty)))
  const gen = GENERATORS[op] ?? genAddition
  const ex = gen(level, d)
  return {
    id: `${level}-gen-${op}-${ex.question}`.replace(/\s+/g, ''),
    level,
    subject: 'maths',
    type: ex.type,
    question: ex.question,
    answer: ex.answer,
    choices: ex.choices,
    difficulty: d,
  }
}
