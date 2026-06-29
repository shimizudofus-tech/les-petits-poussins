import { useMemo, useState } from 'react'
import { pickMaternelleExercise } from '../../data/exercises'
import { useGame } from '../../context/GameContext'
import { getUnlockedDifficulty, recordMaternelleSuccess } from '../../utils/maternelleProgress'
import ExerciseUnavailable from './ExerciseUnavailable'
import PetiteExerciseHeader from './PetiteExerciseHeader'

function shuffleOptions(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

export default function GrandeLogicExercise({ section = 'grande', onCorrect }) {
  const { gameState, setGameState, showFeedback } = useGame()
  const inTest = Boolean(gameState.achievements?.tests?.activeTest)
  const maxDifficulty = getUnlockedDifficulty(gameState.learningProgress, section, 'logic')
  const exercise = useMemo(
    () => pickMaternelleExercise(section, 'logic', maxDifficulty),
    [section, maxDifficulty],
  )
  const options = useMemo(
    () => (exercise ? shuffleOptions(exercise.options) : []),
    [exercise],
  )
  const [answered, setAnswered] = useState(false)

  if (!exercise) {
    return <ExerciseUnavailable />
  }

  const handlePick = (choice) => {
    if (answered) return
    setAnswered(true)
    const isCorrect = choice === exercise.answer
    showFeedback(isCorrect)
    if (isCorrect) {
      recordMaternelleSuccess(setGameState, section, 'logic')
      onCorrect?.()
    } else if (!inTest) {
      setTimeout(() => setAnswered(false), 1100)
    }
  }

  const instruction =
    exercise.type === 'oddOneOut' ? "Trouve l'intrus" : 'Continue'

  const parentHint =
    exercise.type === 'oddOneOut'
      ? 'Quel élément ne va pas ?'
      : `Suite ${exercise.patternType ?? ''}`.trim()

  return (
    <>
      <PetiteExerciseHeader
        instruction={instruction}
        parentHint={parentHint}
        audioKey={
          exercise.promptAudioKey ??
          (exercise.type === 'oddOneOut' ? 'trouve_intrus' : 'continue_suite')
        }
      />

      {exercise.type === 'oddOneOut' ? (
        <div className="grande-logic-row flex flex-wrap items-center justify-center gap-2">
          {exercise.items.map((item, index) => (
            <span key={`${item}-${index}`} className="grande-logic-item">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <div className="pattern-sequence grande-logic-sequence flex flex-wrap items-center justify-center gap-2">
          {exercise.sequence.map((item, index) => (
            <span key={`${item}-${index}`} className="pattern-sequence-item">
              {item}
            </span>
          ))}
          <span className="pattern-sequence-hole" aria-label="Case à compléter">
            ?
          </span>
        </div>
      )}

      <div className="pattern-choices flex flex-wrap justify-center gap-3">
        {options.map((choice) => (
          <button
            key={choice}
            type="button"
            disabled={answered}
            onClick={() => handlePick(choice)}
            className="pattern-choice"
            aria-label={`Réponse ${choice}`}
          >
            {choice}
          </button>
        ))}
      </div>
    </>
  )
}
