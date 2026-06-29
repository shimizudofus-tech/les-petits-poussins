import { useEffect, useMemo, useRef, useState } from 'react'
import { playAnimalSound } from '../../utils/audio'
import { getAnimalSound } from '../../data/animalSounds'
import { useGame } from '../../context/GameContext'

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

const ANIMALS = [
  { key: 'chicken', emoji: '🐔' }, { key: 'pig', emoji: '🐷' }, { key: 'cow', emoji: '🐮' },
  { key: 'sheep', emoji: '🐑' }, { key: 'rabbit', emoji: '🐰' }, { key: 'duck', emoji: '🦆' },
  { key: 'horse', emoji: '🐴' }, { key: 'goat', emoji: '🐐' }, { key: 'dog', emoji: '🐶' },
  { key: 'cat', emoji: '🐱' }, { key: 'mouse', emoji: '🐭' },
]

export default function AudioFindExercise({ onCorrect, exerciseKey = 0 }) {
  const { showFeedback } = useGame()
  const [answered, setAnswered] = useState(null)
  const [correctFlag, setCorrectFlag] = useState(null)
  const retryRef = useRef(null)

  const data = useMemo(() => {
    const target = pick(ANIMALS)
    const others = ANIMALS.filter((a) => a.key !== target.key)
    const opts = [target]
    while (opts.length < 4 && others.length) {
      opts.push(others.splice(Math.floor(Math.random() * others.length), 1)[0])
    }
    return { target, options: opts.sort(() => Math.random() - 0.5) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseKey])

  const playCry = () => playAnimalSound(data.target.key, getAnimalSound(data.target.key, 'adult'))

  // Joue le cri automatiquement à l'arrivée.
  useEffect(() => {
    const t = setTimeout(playCry, 350)
    return () => { clearTimeout(t); if (retryRef.current) clearTimeout(retryRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseKey])

  const handleTap = (key, index) => {
    if (answered !== null) return
    const ok = key === data.target.key
    setAnswered(index)
    setCorrectFlag(ok)
    showFeedback(ok, { exerciseId: `ecoute-${data.target.key}` })
    if (ok) onCorrect?.()
    else retryRef.current = setTimeout(() => { setAnswered(null); setCorrectFlag(null) }, 1100)
  }

  return (
    <>
      <div className="audiofind-card">
        <div className="audiofind-label">👂 Écoute et trouve l'animal !</div>
        <button type="button" className="audiofind-play" onClick={playCry} aria-label="Réécouter le cri">
          🔊
        </button>
        <p className="audiofind-hint">Touche l'animal qui fait ce cri</p>
      </div>
      <div className="answers-grid cols-2">
        {data.options.map((a, index) => {
          const isAns = answered === index
          const cls = isAns ? (correctFlag ? 'correct' : 'wrong') : ''
          return (
            <button
              key={a.key}
              type="button"
              disabled={answered !== null}
              onClick={() => handleTap(a.key, index)}
              className={`ans-btn audiofind-choice ${cls}`.trim()}
            >
              {a.emoji}
            </button>
          )
        })}
      </div>
    </>
  )
}
