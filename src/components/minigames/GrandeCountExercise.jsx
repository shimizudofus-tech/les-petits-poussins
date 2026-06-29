import { useMemo, useState } from 'react'
import { pickMaternelleExercise } from '../../data/exercises'
import { useGame } from '../../context/GameContext'
import { getUnlockedDifficulty, recordMaternelleSuccess } from '../../utils/maternelleProgress'
import { makeOpts } from '../../utils/exerciseUtils'
import AnswerButtons from './AnswerButtons'
import ExerciseUnavailable from './ExerciseUnavailable'
import PetiteExerciseHeader from './PetiteExerciseHeader'

export default function GrandeCountExercise({ section = 'grande', onCorrect }) {
  const { gameState, setGameState, showFeedback } = useGame()
  const inTest = Boolean(gameState.achievements?.tests?.activeTest)
  const maxDifficulty = getUnlockedDifficulty(gameState.learningProgress, section, 'counting')
  const [answered, setAnswered] = useState(false)

  const source = useMemo(
    () => pickMaternelleExercise(section, 'counting', maxDifficulty),
    [section, maxDifficulty],
  )

  const quiz = useMemo(() => {
    if (!source) return null
    if (source.type === 'count') {
      const maxAnswer = source.difficulty === 1 ? 5 : 10
      return {
        type: 'count',
        scene: source.emoji.repeat(source.count),
        answer: source.count,
        options: makeOpts(source.count, 1, maxAnswer, 3),
        audioKey: source.audioKey,
        parentHint: 'Combien y en a-t-il ?',
      }
    }
    return {
      type: 'compare',
      groupA: source.groupA,
      groupB: source.groupB,
      compareType: source.compareType,
      answer: source.answer,
      audioKey: source.audioKey,
      parentHint:
        source.compareType === 'more' ? 'Où y en a-t-il le plus ?' : 'Où y en a-t-il le moins ?',
    }
  }, [source])

  if (!quiz) {
    return <ExerciseUnavailable />
  }

  const handleCountCorrect = () => {
    recordMaternelleSuccess(setGameState, section, 'counting')
    onCorrect?.()
  }

  const handleComparePick = (choice) => {
    if (answered) return
    setAnswered(true)
    const isCorrect = choice === quiz.answer
    showFeedback(isCorrect)
    if (isCorrect) {
      recordMaternelleSuccess(setGameState, section, 'counting')
      onCorrect?.()
    } else if (!inTest) {
      setTimeout(() => setAnswered(false), 1100)
    }
  }

  if (quiz.type === 'count') {
    return (
      <>
        <PetiteExerciseHeader
          instruction="Compte"
          parentHint={quiz.parentHint}
          audioKey={quiz.audioKey}
        />
        <div className="chalkboard petite-chalkboard">
          <div className="count-scene petite-count-scene moyenne-count-scene grande-count-scene">
            {quiz.scene}
          </div>
        </div>
        <AnswerButtons
          options={quiz.options}
          correct={quiz.answer}
          onCorrect={handleCountCorrect}
          columns={3}
          variant="petite"
        />
      </>
    )
  }

  const instruction = quiz.compareType === 'more' ? 'Le plus ?' : 'Le moins ?'

  return (
    <>
      <PetiteExerciseHeader
        instruction={instruction}
        parentHint={quiz.parentHint}
        audioKey={quiz.audioKey}
      />
      <div className="moyenne-compare-groups grande-compare-groups flex justify-center gap-3">
        {[
          { key: 'A', group: quiz.groupA },
          { key: 'B', group: quiz.groupB },
        ].map(({ key, group }) => (
          <button
            key={key}
            type="button"
            disabled={answered}
            onClick={() => handleComparePick(key)}
            className="moyenne-compare-group"
            aria-label={`Groupe ${key}`}
          >
            <div className="moyenne-compare-scene grande-compare-scene">
              {group.emoji.repeat(group.count)}
            </div>
            <span className="moyenne-compare-label">Groupe {key}</span>
          </button>
        ))}
      </div>
    </>
  )
}
