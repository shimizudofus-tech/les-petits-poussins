import { useMemo } from 'react'
import { playWord } from '../../utils/audio'
import AnswerButtons from './AnswerButtons'

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Minutes possibles selon la difficulté (1 = heures pleines … 3 = 5 min).
const MINUTE_SETS = {
  1: [0],
  2: [0, 30],
  3: [0, 15, 30, 45],
  4: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
}

function label(h, m) {
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, '0')}`
}

function buildOptions(h, m, minutes) {
  const correct = label(h, m)
  const set = new Set([correct])
  let guard = 0
  while (set.size < 4 && guard++ < 40) {
    const dh = pick([0, 0, 1, -1])
    const hh = ((h - 1 + dh + 12) % 12) + 1
    const mm = pick(minutes)
    const cand = label(hh, mm)
    if (cand !== correct) set.add(cand)
  }
  // padding si peu de variété (difficulté 1)
  let extra = 1
  while (set.size < 4) {
    const hh = ((h - 1 + extra + 12) % 12) + 1
    set.add(label(hh, m))
    extra++
  }
  return [...set].sort(() => Math.random() - 0.5)
}

// Aiguille : extrémité à partir d'un angle (degrés, sens horaire depuis midi).
function hand(angleDeg, length) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return { x2: 50 + length * Math.cos(rad), y2: 50 + length * Math.sin(rad) }
}

export default function ClockExercise({ onCorrect, exerciseKey = 0 }) {
  const data = useMemo(() => {
    const difficulty = pick([1, 2, 2, 3, 3, 4])
    const minutes = MINUTE_SETS[difficulty]
    const h = rnd(1, 12)
    const m = pick(minutes)
    return { h, m, minutes }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseKey])

  const { h, m, minutes } = data
  const minuteAngle = (m / 60) * 360
  const hourAngle = ((h % 12) + m / 60) * 30 // 360/12
  const min = hand(minuteAngle, 32)
  const hr = hand(hourAngle, 22)
  const options = useMemo(() => buildOptions(h, m, minutes), [h, m, minutes])

  return (
    <>
      <div className="clock-card">
        <div className="clock-card-label">
          ⏰ Quelle heure est-il ?
          <button type="button" className="chalk-listen" onClick={() => playWord('choisis_bonne_reponse')} aria-label="Écouter la consigne">🔊</button>
        </div>
        <svg viewBox="0 0 100 100" className="clock-face" role="img" aria-label="Horloge">
          <circle cx="50" cy="50" r="47" fill="#fffef8" stroke="#c8902a" strokeWidth="3" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * 360
            const outer = hand(a, 44)
            const inner = hand(a, i % 3 === 0 ? 37 : 40)
            return <line key={i} x1={inner.x2} y1={inner.y2} x2={outer.x2} y2={outer.y2} stroke="#8d6e3a" strokeWidth={i % 3 === 0 ? 2.2 : 1} strokeLinecap="round" />
          })}
          {[12, 3, 6, 9].map((num, i) => {
            const a = (i * 90)
            const p = hand(a, 31)
            return <text key={num} x={p.x2} y={p.y2 + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="#5d3a00">{num}</text>
          })}
          <line x1="50" y1="50" x2={hr.x2} y2={hr.y2} stroke="#3e2723" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="50" x2={min.x2} y2={min.y2} stroke="#e53935" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="50" r="3" fill="#3e2723" />
        </svg>
      </div>
      <AnswerButtons
        options={options}
        correct={label(h, m)}
        onCorrect={onCorrect}
        columns={2}
        feedbackMeta={{ exerciseId: `heure-${h}-${m}` }}
      />
    </>
  )
}
