import { useMemo, useState } from 'react'
import { getMaternelleExercises, pickMaternelleExercise } from '../../data/exercises'
import { useGame } from '../../context/GameContext'
import { getUnlockedDifficulty, recordMaternelleSuccess } from '../../utils/maternelleProgress'
import ExerciseUnavailable from './ExerciseUnavailable'
import PetiteExerciseHeader from './PetiteExerciseHeader'
import { promptKeyForPetiteColor } from '../../utils/audioPrompts'

function buildQuiz(section, maxDifficulty) {
  const target = pickMaternelleExercise(section, 'colors', maxDifficulty)
  if (!target) return null

  const pool = getMaternelleExercises(section, 'colors').filter(
    (item) => (item.difficulty ?? 1) <= maxDifficulty && item.id !== target.id,
  )

  const distractors = []
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  for (const item of shuffled) {
    if (distractors.length >= 2) break
    if (!distractors.find((d) => d.colorHex === item.colorHex)) {
      distractors.push(item)
    }
  }

  const options = [target, ...distractors].sort(() => Math.random() - 0.5)
  return { target, options }
}

export default function PetiteColorsExercise({ section = 'petite', onCorrect }) {
  const { gameState, setGameState, showFeedback } = useGame()
  const inTest = Boolean(gameState.achievements?.tests?.activeTest)
  const maxDifficulty = getUnlockedDifficulty(gameState.learningProgress, section, 'colors')
  const quiz = useMemo(() => buildQuiz(section, maxDifficulty), [section, maxDifficulty])
  const [answered, setAnswered] = useState(false)

  if (!quiz) {
    return <ExerciseUnavailable />
  }

  const { target, options } = quiz

  const handlePick = (choice) => {
    if (answered) return
    setAnswered(true)
    const isCorrect = choice.id === target.id
    showFeedback(isCorrect)
    if (isCorrect) {
      recordMaternelleSuccess(setGameState, section, 'colors')
      onCorrect?.()
    } else if (!inTest) {
      setTimeout(() => setAnswered(false), 1100)
    }
  }

  return (
    <>
      <PetiteExerciseHeader
        instruction="Trouve la couleur"
        parentHint={`Cherche : ${target.name}`}
        audioKey={promptKeyForPetiteColor(target.audioKey)}
        audioLabel={target.name}
      />
      <div className="petite-color-choices flex flex-wrap justify-center gap-4">
        {options.map((choice) => (
          <button
            key={choice.id}
            type="button"
            disabled={answered}
            onClick={() => handlePick(choice)}
            className="petite-color-choice"
            aria-label={choice.name}
          >
            <span
              className="petite-color-swatch"
              style={{ background: choice.colorHex }}
              aria-hidden="true"
            />
            <span className="petite-color-btn-label">{choice.name}</span>
          </button>
        ))}
      </div>
    </>
  )
}
