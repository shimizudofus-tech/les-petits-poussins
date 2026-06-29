import { useMemo, useState } from 'react'
import { pickMaternelleExercise } from '../../data/exercises'
import { useGame } from '../../context/GameContext'
import { getUnlockedDifficulty, recordMaternelleSuccess } from '../../utils/maternelleProgress'
import ExerciseUnavailable from './ExerciseUnavailable'
import PetiteExerciseHeader from './PetiteExerciseHeader'

function shuffleOptions(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

export default function GrandeSoundsExercise({ section = 'grande', onCorrect }) {
  const { gameState, setGameState, showFeedback } = useGame()
  const inTest = Boolean(gameState.achievements?.tests?.activeTest)
  const maxDifficulty = getUnlockedDifficulty(gameState.learningProgress, section, 'sounds')
  const exercise = useMemo(
    () => pickMaternelleExercise(section, 'sounds', maxDifficulty),
    [section, maxDifficulty],
  )
  const options = useMemo(
    () =>
      exercise
        ? shuffleOptions([exercise.correct, ...exercise.distractors])
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
    const isCorrect = choice.id === exercise.correct.id
    showFeedback(isCorrect)
    if (isCorrect) {
      recordMaternelleSuccess(setGameState, section, 'sounds')
      onCorrect?.()
    } else if (!inTest) {
      setTimeout(() => setAnswered(false), 1100)
    }
  }

  return (
    <>
      <PetiteExerciseHeader
        instruction="Écoute et trouve"
        parentHint={`Commence par ${exercise.targetSound}`}
        audioKey={exercise.audioKey}
        audioLabel={`Son ${exercise.targetSound}`}
      />
      <div className="grande-sound-hint text-center text-[2.5rem] font-black text-[#5d3a00]">
        {exercise.targetSound}
      </div>
      <div className="grande-sound-choices flex flex-wrap justify-center gap-3">
        {options.map((choice) => (
          <button
            key={choice.id}
            type="button"
            disabled={answered}
            onClick={() => handlePick(choice)}
            className="grande-sound-choice"
            aria-label={choice.label}
          >
            <span className="grande-sound-emoji">{choice.emoji}</span>
          </button>
        ))}
      </div>
    </>
  )
}
