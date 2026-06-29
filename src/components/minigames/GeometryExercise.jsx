import { useMemo } from 'react'
import { playWord } from '../../utils/audio'
import AnswerButtons from './AnswerButtons'

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Points d'un polygone régulier à n côtés, centré.
function regPoly(n, cx = 50, cy = 53, r = 40) {
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = (-90 + (i * 360) / n) * (Math.PI / 180)
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
}

const SHAPES = [
  { name: 'Triangle', sides: 3, poly: regPoly(3) },
  { name: 'Carré', sides: 4, poly: '16,19 84,19 84,87 16,87' },
  { name: 'Rectangle', sides: 4, poly: '8,28 92,28 92,78 8,78' },
  { name: 'Losange', sides: 4, poly: '50,10 88,53 50,96 12,53' },
  { name: 'Pentagone', sides: 5, poly: regPoly(5) },
  { name: 'Hexagone', sides: 6, poly: regPoly(6) },
  { name: 'Cercle', sides: 0, circle: true },
]

const COLORS = ['#90caf9', '#a5d6a7', '#ffcc80', '#ce93d8', '#f48fb1', '#80cbc4']

function buildNumberChoices(correct) {
  const set = new Set([correct])
  const cands = [3, 4, 5, 6, correct + 1, correct - 1, correct + 2]
  for (const c of cands) { if (c > 0 && set.size < 4) set.add(c) }
  return [...set].sort(() => Math.random() - 0.5).map(String)
}

function buildNameChoices(correct) {
  const others = SHAPES.map((s) => s.name).filter((n) => n !== correct)
  const opts = [correct]
  while (opts.length < 4 && others.length) {
    const i = Math.floor(Math.random() * others.length)
    opts.push(others.splice(i, 1)[0])
  }
  return opts.sort(() => Math.random() - 0.5)
}

export default function GeometryExercise({ onCorrect, exerciseKey = 0 }) {
  const data = useMemo(() => {
    const shape = pick(SHAPES)
    const color = pick(COLORS)
    // « côtés » impossible pour le cercle → on demande le nom
    const mode = shape.circle ? 'name' : pick(['name', 'sides', 'sides'])
    if (mode === 'sides') {
      return {
        shape, color, mode,
        question: 'Combien de côtés ?',
        answer: String(shape.sides),
        options: buildNumberChoices(shape.sides),
      }
    }
    return {
      shape, color, mode,
      question: 'Quelle est cette forme ?',
      answer: shape.name,
      options: buildNameChoices(shape.name),
    }
  }, [exerciseKey])

  const { shape, color } = data

  return (
    <>
      <div className="geo-card">
        <div className="geo-card-label">
          📐 Géométrie
          <button type="button" className="chalk-listen" onClick={() => playWord('choisis_bonne_reponse')} aria-label="Écouter la consigne">🔊</button>
        </div>
        <p className="geo-question">{data.question}</p>
        <svg viewBox="0 0 100 105" className="geo-shape" role="img" aria-label="Forme">
          {shape.circle ? (
            <circle cx="50" cy="53" r="40" fill={color} stroke="#5d3a00" strokeWidth="2.5" />
          ) : (
            <polygon points={shape.poly} fill={color} stroke="#5d3a00" strokeWidth="2.5" strokeLinejoin="round" />
          )}
        </svg>
      </div>
      <AnswerButtons
        options={data.options}
        correct={data.answer}
        onCorrect={onCorrect}
        columns={2}
        feedbackMeta={{ exerciseId: `geo-${data.mode}-${shape.name}` }}
      />
    </>
  )
}
