import { useMemo, useState } from 'react'
import { pickGradeExercise } from '../../data/exercises'
import { useGame } from '../../context/GameContext'
import AnswerButtons from './AnswerButtons'
import ExerciseUnavailable from './ExerciseUnavailable'

export default function MathExercise({ onCorrect, exerciseKey = 0, level = 'cp' }) {
  const { gameState, showFeedback } = useGame()
  const maxDifficulty = gameState.learningProgress?.[level]?.maths?.unlockedDifficulty ?? 1
  const source = useMemo(
    () => pickGradeExercise(level, 'maths', maxDifficulty),
    [exerciseKey, maxDifficulty, level],
  )
  const [answeredIndex, setAnsweredIndex] = useState(null)
  const [answerCorrect, setAnswerCorrect] = useState(null)

  const exercise = useMemo(() => {
    if (!source) return null

    if (source.type === 'comparison') {
      return {
        type: 'compare',
        question: source.question,
        options: [...source.choices]
          .sort(() => Math.random() - 0.5)
          .map((symbol) => ({
            label: ` ${symbol} `,
            value: symbol === source.answer ? 'ok' : 'no',
          })),
        columns: 3,
      }
    }

    return {
      type: 'numeric',
      question: `${source.question} = ?`,
      answer: source.answer,
      options: [...source.choices].sort(() => Math.random() - 0.5),
      columns: 4,
    }
  }, [source])

  if (!exercise) {
    return <ExerciseUnavailable />
  }

  if (exercise.type === 'compare') {
    const handleCompare = (index, value) => {
      if (answeredIndex !== null) return
      const isCorrect = value === 'ok'
      setAnsweredIndex(index)
      setAnswerCorrect(isCorrect)
      showFeedback(isCorrect, { exerciseId: source?.id })
      if (isCorrect) {
        onCorrect?.()
      } else {
        // Mauvaise réponse : on réactive les boutons pour réessayer.
        setTimeout(() => {
          setAnsweredIndex(null)
          setAnswerCorrect(null)
        }, 1100)
      }
    }

    return (
      <>
        <div className="chalkboard">
          <div className="chalkboard-label">➕ Calcul mental</div>
          <div className="chalk-question">{exercise.question}</div>
        </div>
        <div className="answers-grid cols-3">
          {exercise.options.map((opt, index) => {
            const isAnswered = answeredIndex === index
            const stateClass = isAnswered ? (answerCorrect ? 'correct' : 'wrong') : ''
            return (
              <button
                key={`${opt.label}-${index}`}
                type="button"
                disabled={answeredIndex !== null}
                onClick={() => handleCompare(index, opt.value)}
                className={`ans-btn ${stateClass}`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </>
    )
  }

  return (
    <>
      <div className="chalkboard">
        <div className="chalkboard-label">➕ Calcul mental</div>
        <div className="chalk-question">{exercise.question}</div>
      </div>
      <AnswerButtons
        options={exercise.options}
        correct={exercise.answer}
        onCorrect={onCorrect}
        columns={exercise.columns}
        feedbackMeta={{ exerciseId: source?.id }}
      />
    </>
  )
}
