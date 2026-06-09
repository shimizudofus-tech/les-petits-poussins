import { useMemo, useState } from 'react'
import { pickMaternelleExercise } from '../../data/exercises'
import { useGame } from '../../context/GameContext'
import { getUnlockedDifficulty, recordMaternelleSuccess } from '../../utils/maternelleProgress'
import ExerciseUnavailable from './ExerciseUnavailable'
import PetiteExerciseHeader from './PetiteExerciseHeader'

function shuffleLetters(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

export default function GrandeLettersExercise({ section = 'grande', onCorrect }) {
  const { gameState, setGameState, showFeedback } = useGame()
  const maxDifficulty = getUnlockedDifficulty(gameState.learningProgress, section, 'letters')
  const exercise = useMemo(
    () => pickMaternelleExercise(section, 'letters', maxDifficulty),
    [section, maxDifficulty],
  )
  const options = useMemo(
    () =>
      exercise
        ? shuffleLetters([exercise.correct, ...exercise.distractors])
        : [],
    [exercise],
  )
  const [answered, setAnswered] = useState(false)

  if (!exercise) {
    return <ExerciseUnavailable />
  }

  const handlePick = (choice) => {
    if (answered) return
    setAnswered(true)
    const isCorrect = choice === exercise.correct
    showFeedback(isCorrect)
    if (isCorrect) {
      recordMaternelleSuccess(setGameState, section, 'letters')
      onCorrect?.()
    }
  }

  return (
    <>
      <PetiteExerciseHeader
        instruction="Trouve la lettre"
        parentHint={`Lettre ${exercise.letter}`}
        audioKey={exercise.audioKey}
        audioLabel={exercise.letter}
      />
      <div className="grande-letter-target" aria-hidden="true">
        {exercise.letter}
      </div>
      <div className="grande-letter-choices flex flex-wrap justify-center gap-3">
        {options.map((choice) => (
          <button
            key={choice}
            type="button"
            disabled={answered}
            onClick={() => handlePick(choice)}
            className="grande-letter-choice"
            aria-label={`Lettre ${choice}`}
          >
            {choice}
          </button>
        ))}
      </div>
    </>
  )
}
