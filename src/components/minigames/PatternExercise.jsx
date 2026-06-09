import { useMemo, useState } from 'react'
import { pickMaternelleExercise } from '../../data/exercises'
import { useGame } from '../../context/GameContext'
import { getUnlockedDifficulty, recordMaternelleSuccess } from '../../utils/maternelleProgress'
import ExerciseUnavailable from './ExerciseUnavailable'
import PetiteExerciseHeader from './PetiteExerciseHeader'

export default function PatternExercise({ section = 'moyenne', onCorrect }) {
  const { gameState, setGameState, showFeedback } = useGame()
  const maxDifficulty = getUnlockedDifficulty(gameState.learningProgress, section, 'patterns')
  const exercise = useMemo(
    () => pickMaternelleExercise(section, 'patterns', maxDifficulty),
    [section, maxDifficulty],
  )
  const options = useMemo(
    () => (exercise ? [...exercise.options].sort(() => Math.random() - 0.5) : []),
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
      recordMaternelleSuccess(setGameState, section, 'patterns')
      onCorrect?.()
    }
  }

  return (
    <>
      <PetiteExerciseHeader
        instruction="Continue"
        parentHint={`Suite ${exercise.patternType}`}
      />
      <div className="pattern-sequence flex flex-wrap items-center justify-center gap-2">
        {exercise.sequence.map((item, index) => (
          <span key={`${item}-${index}`} className="pattern-sequence-item">
            {item}
          </span>
        ))}
        <span className="pattern-sequence-hole" aria-label="Case à compléter">
          ?
        </span>
      </div>
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
