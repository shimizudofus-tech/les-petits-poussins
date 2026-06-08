import { useMemo } from 'react'
import { pickRandomExercise } from '../../data/exercises'
import { makeOpts } from '../../utils/exerciseUtils'
import AnswerButtons from './AnswerButtons'
import ExerciseUnavailable from './ExerciseUnavailable'

export default function CountExercise({ onCorrect }) {
  const exercise = useMemo(() => {
    const source = pickRandomExercise('maternelle', 'counting')
    if (!source) return null

    return {
      answer: source.count,
      scene: source.emoji.repeat(source.count),
      options: makeOpts(source.count, 1, source.count + 2, 3),
    }
  }, [])

  if (!exercise) {
    return <ExerciseUnavailable />
  }

  return (
    <>
      <div className="chalkboard">
        <div className="chalkboard-label">Combien y en a-t-il ?</div>
        <div className="count-scene">{exercise.scene}</div>
      </div>
      <AnswerButtons
        options={exercise.options}
        correct={exercise.answer}
        onCorrect={onCorrect}
        columns={3}
      />
    </>
  )
}
