import { useEffect, useMemo, useRef, useState } from 'react'
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
  const inTest = Boolean(gameState.achievements?.tests?.activeTest)
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
  const retryRef = useRef(null)

  useEffect(() => () => { if (retryRef.current) clearTimeout(retryRef.current) }, [])

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
    } else if (!inTest) {
      // Entraînement : on réactive les boutons pour réessayer. En test : définitif.
      retryRef.current = setTimeout(() => setAnswered(false), 1100)
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
