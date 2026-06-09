import { useMemo, useState } from 'react'
import { pickMaternelleExercise } from '../../data/exercises'
import { useGame } from '../../context/GameContext'
import { getUnlockedDifficulty, recordMaternelleSuccess } from '../../utils/maternelleProgress'
import ExerciseUnavailable from './ExerciseUnavailable'
import PetiteExerciseHeader from './PetiteExerciseHeader'

function shuffleOptions(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

export default function MoyenneColorsExercise({ section = 'moyenne', onCorrect }) {
  const { gameState, setGameState, showFeedback } = useGame()
  const maxDifficulty = getUnlockedDifficulty(gameState.learningProgress, section, 'colors')
  const exercise = useMemo(
    () => pickMaternelleExercise(section, 'colors', maxDifficulty),
    [section, maxDifficulty],
  )
  const [answered, setAnswered] = useState(false)

  const options = useMemo(() => {
    if (!exercise) return []
    if (exercise.type === 'findObject') {
      return shuffleOptions([exercise.correct, ...exercise.distractors])
    }
    if (exercise.type === 'findColor') {
      return shuffleOptions(exercise.colorOptions)
    }
    return []
  }, [exercise])

  if (!exercise) {
    return <ExerciseUnavailable />
  }

  const handleObjectPick = (choice) => {
    if (answered) return
    setAnswered(true)
    const isCorrect = choice.id === exercise.correct.id
    showFeedback(isCorrect)
    if (isCorrect) {
      recordMaternelleSuccess(setGameState, section, 'colors')
      onCorrect?.()
    }
  }

  const handleColorPick = (choice) => {
    if (answered) return
    setAnswered(true)
    const isCorrect = choice.hex === exercise.correctHex
    showFeedback(isCorrect)
    if (isCorrect) {
      recordMaternelleSuccess(setGameState, section, 'colors')
      onCorrect?.()
    }
  }

  const instruction =
    exercise.type === 'findObject' ? 'Trouve l’objet' : 'Trouve la couleur'

  const parentHint =
    exercise.type === 'findObject'
      ? `Objet ${exercise.colorName.toLowerCase()}`
      : `Couleur de ${exercise.object.label.toLowerCase()}`

  return (
    <>
      <PetiteExerciseHeader
        instruction={instruction}
        parentHint={parentHint}
        audioKey={exercise.audioKey}
        audioLabel={exercise.colorName ?? exercise.object?.label}
      />

      {exercise.type === 'findColor' && (
        <div className="moyenne-object-prompt text-center text-[3.5rem] leading-none">
          {exercise.object.emoji}
        </div>
      )}

      {exercise.type === 'findObject' && (
        <div
          className="moyenne-color-hint mx-auto mb-2 h-4 w-16 rounded-full border-4 border-white shadow-md"
          style={{ background: exercise.colorHex }}
          aria-label={exercise.colorName}
        />
      )}

      {exercise.type === 'findObject' ? (
        <div className="moyenne-object-choices flex flex-wrap justify-center gap-3">
          {options.map((choice) => (
            <button
              key={choice.id}
              type="button"
              disabled={answered}
              onClick={() => handleObjectPick(choice)}
              className="moyenne-object-choice"
              aria-label={choice.label}
            >
              <span className="moyenne-object-emoji">{choice.emoji}</span>
              <span className="moyenne-object-label">{choice.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="petite-color-choices flex flex-wrap justify-center gap-4">
          {options.map((choice) => (
            <button
              key={choice.name}
              type="button"
              disabled={answered}
              onClick={() => handleColorPick(choice)}
              className="petite-color-choice"
              aria-label={choice.name}
            >
              <span
                className="petite-color-swatch"
                style={{ background: choice.hex }}
                aria-hidden="true"
              />
              <span className="petite-color-btn-label">{choice.name}</span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}
