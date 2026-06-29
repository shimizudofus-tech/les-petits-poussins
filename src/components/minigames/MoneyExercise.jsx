import { useMemo } from 'react'
import { playWord } from '../../utils/audio'
import AnswerButtons from './AnswerButtons'

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Couleurs proches des vrais billets euros.
const BILL_COLORS = { 5: '#b0a4c8', 10: '#e09a8a', 20: '#7fb4e0', 50: '#e6b85c' }

function buildChoices(answer, spreads = [1, -1, 2, -2, 5, -5]) {
  const set = new Set([answer])
  let g = 0
  while (set.size < 4 && g++ < 40) {
    const c = answer + pick(spreads)
    if (c > 0 && c !== answer) set.add(c)
  }
  let pad = answer + 1
  while (set.size < 4) { if (pad !== answer && pad > 0) set.add(pad); pad++ }
  return [...set].sort(() => Math.random() - 0.5).map((v) => `${v} €`)
}

function Coin({ value }) {
  return (
    <span className="money-coin" aria-hidden="true">{value}€</span>
  )
}
function Bill({ value }) {
  return (
    <span className="money-bill" style={{ background: BILL_COLORS[value] ?? '#cfc6e0' }} aria-hidden="true">{value}€</span>
  )
}

function renderPiece(value, i) {
  return value <= 2 ? <Coin key={i} value={value} /> : <Bill key={i} value={value} />
}

export default function MoneyExercise({ onCorrect, exerciseKey = 0, level = 'ce1' }) {
  const data = useMemo(() => {
    const mode = pick(level === 'ce1' ? ['count', 'count', 'change'] : ['count', 'change', 'change'])

    if (mode === 'count') {
      const denoms = level === 'ce1' ? [1, 2, 5, 10] : [1, 2, 5, 10, 20]
      const n = rnd(2, level === 'ce1' ? 4 : 5)
      const pieces = Array.from({ length: n }, () => pick(denoms))
      const total = pieces.reduce((a, b) => a + b, 0)
      return { mode, pieces, answer: total, question: "Combien d'argent y a-t-il ?", options: buildChoices(total) }
    }

    // change : on paie avec un billet rond, l'article coûte moins
    const paid = pick(level === 'ce1' ? [10, 20] : [20, 50])
    const price = rnd(Math.ceil(paid / 3), paid - 1)
    const change = paid - price
    return {
      mode,
      pieces: [paid],
      price,
      answer: change,
      question: `L'article coûte ${price} €. Tu paies avec ${paid} €. Combien rend-on ?`,
      options: buildChoices(change),
    }
  }, [exerciseKey, level])

  return (
    <>
      <div className="money-card">
        <div className="money-card-label">
          💶 La monnaie
          <button type="button" className="chalk-listen" onClick={() => playWord('choisis_bonne_reponse')} aria-label="Écouter la consigne">🔊</button>
        </div>
        <p className="money-question">{data.question}</p>
        <div className="money-pieces">{data.pieces.map((v, i) => renderPiece(v, i))}</div>
      </div>
      <AnswerButtons
        options={data.options}
        correct={`${data.answer} €`}
        onCorrect={onCorrect}
        columns={2}
        feedbackMeta={{ exerciseId: `monnaie-${data.mode}-${data.answer}` }}
      />
    </>
  )
}
