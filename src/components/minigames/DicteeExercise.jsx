import { useMemo, useState } from 'react'
import { pickGradeExercise } from '../../data/exercises'
import { useGame } from '../../context/GameContext'
import { playWord } from '../../utils/audioManager'
import ExerciseImageDisplay from './ExerciseImageDisplay'
import ExerciseUnavailable from './ExerciseUnavailable'

function buildLetterPool(displayWord) {
  const extra = 'ABCDEFGHIJKLMNOPRSTUVWY'
  const needed = displayWord.split('')
  const pool = [...needed]
  for (let i = 0; i < 4; i++) {
    let r
    do {
      r = extra[Math.floor(Math.random() * extra.length)]
    } while (pool.includes(r))
    pool.push(r)
  }
  return pool.sort(() => Math.random() - 0.5)
}

export default function DicteeExercise({ onCorrect, exerciseKey = 0, level = 'cp' }) {
  const { gameState, showFeedback, showToast } = useGame()
  const maxDifficulty = gameState.learningProgress?.[level]?.dictee?.unlockedDifficulty ?? 1
  const source = useMemo(
    () => pickGradeExercise(level, 'dictee', maxDifficulty),
    [exerciseKey, maxDifficulty, level],
  )

  const exercise = useMemo(() => {
    if (!source) return null
    const displayWord = source.displayWord ?? source.word.toUpperCase()
    return {
      ...source,
      displayWord,
      scrambled: buildLetterPool(displayWord),
    }
  }, [source])

  const [typed, setTyped] = useState([])
  const [usedIndices, setUsedIndices] = useState(new Set())

  if (!exercise) {
    return <ExerciseUnavailable />
  }

  const addLetter = (letter, index) => {
    if (usedIndices.has(index) || typed.length >= exercise.displayWord.length) return
    setTyped((prev) => [...prev, { letter, poolIndex: index }])
    setUsedIndices((prev) => new Set(prev).add(index))
  }

  const handleDelete = () => {
    if (!typed.length) return
    const last = typed[typed.length - 1]
    setTyped((prev) => prev.slice(0, -1))
    setUsedIndices((prev) => {
      const next = new Set(prev)
      next.delete(last.poolIndex)
      return next
    })
  }

  const handleValidate = () => {
    const answer = typed.map((t) => t.letter).join('')
    const correct = answer === exercise.displayWord
    showFeedback(correct, { exerciseId: exercise.id })
    if (correct) {
      onCorrect?.()
    } else {
      setTimeout(() => showToast(`Le mot était : ${exercise.word}`, '#7c4dff'), 400)
    }
  }

  const remaining = exercise.displayWord.length - typed.length

  return (
    <>
      <div className="mb-1 text-center">
        <ExerciseImageDisplay imageKey={exercise.imageKey} className="text-[2rem]" />
      </div>
      <button
        type="button"
        onClick={() => playWord(exercise.audioKey ?? exercise.word)}
        className="listen-btn mx-auto mb-2 block"
      >
        🔊 Écouter
      </button>
      <div className="mb-1 text-center text-[0.82rem] font-extrabold text-[#5d3a00]">
        Écris le mot que tu entends !
      </div>

      <div className="dictee-input flex min-h-[50px] flex-wrap justify-center gap-1.5 p-1.5">
        {typed.map((entry, i) => (
          <div key={`typed-${i}`} className="typed-letter">
            {entry.letter}
          </div>
        ))}
        {Array.from({ length: remaining }).map((_, i) => (
          <div key={`slot-${i}`} className="typed-letter opacity-30">
            _
          </div>
        ))}
      </div>

      <div className="dictee-letters flex flex-wrap justify-center gap-2">
        {exercise.scrambled.map((letter, index) => (
          <button
            key={`${letter}-${index}`}
            type="button"
            disabled={usedIndices.has(index)}
            onClick={() => addLetter(letter, index)}
            className="letter-btn"
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="dictee-actions flex justify-center gap-2.5">
        <button type="button" onClick={handleDelete} className="d-btn del">
          ⌫ Effacer
        </button>
        <button type="button" onClick={handleValidate} className="d-btn validate">
          ✅ Valider
        </button>
      </div>
    </>
  )
}
