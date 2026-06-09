import { useMemo } from 'react'
import { pickMaternelleExercise } from '../../data/exercises'
import { useGame } from '../../context/GameContext'
import { getUnlockedDifficulty, recordMaternelleSuccess } from '../../utils/maternelleProgress'
import { makeOpts } from '../../utils/exerciseUtils'
import AnswerButtons from './AnswerButtons'
import ExerciseUnavailable from './ExerciseUnavailable'
import PetiteExerciseHeader from './PetiteExerciseHeader'

export default function PetiteCountExercise({ section = 'petite', onCorrect }) {
  const { gameState, setGameState } = useGame()
  const maxDifficulty = getUnlockedDifficulty(gameState.learningProgress, section, 'counting')

  const exercise = useMemo(() => {
    const source = pickMaternelleExercise(section, 'counting', maxDifficulty)
    if (!source) return null

    const maxAnswer = maxDifficulty === 1 ? 3 : maxDifficulty === 2 ? 4 : 5
    const optionCount = maxDifficulty === 1 ? 2 : 3

    return {
      answer: source.count,
      scene: source.emoji.repeat(source.count),
      options: makeOpts(source.count, 1, maxAnswer, optionCount),
      audioKey: source.emojiKey,
    }
  }, [section, maxDifficulty])

  if (!exercise) {
    return <ExerciseUnavailable />
  }

  const handleCorrect = () => {
    recordMaternelleSuccess(setGameState, section, 'counting')
    onCorrect?.()
  }

  return (
    <>
      <PetiteExerciseHeader
        instruction="Compte"
        parentHint="Combien y en a-t-il ?"
        audioKey={exercise.audioKey}
      />
      <div className="chalkboard petite-chalkboard">
        <div className="count-scene petite-count-scene">{exercise.scene}</div>
      </div>
      <AnswerButtons
        options={exercise.options}
        correct={exercise.answer}
        onCorrect={handleCorrect}
        columns={exercise.options.length <= 2 ? 2 : 3}
        variant="petite"
      />
    </>
  )
}
