import { useMemo, useRef, useState } from 'react'
import { pickGradeExercise } from '../../data/exercises'
import { useGame } from '../../context/GameContext'
import { playWord } from '../../utils/audio'
import { weakIdSet } from '../../utils/review'
import AnswerButtons from './AnswerButtons'
import ExerciseUnavailable from './ExerciseUnavailable'

export default function MathExercise({ onCorrect, exerciseKey = 0, level = 'cp' }) {
  const { gameState, showFeedback } = useGame()
  const maxDifficulty = gameState.learningProgress?.[level]?.maths?.unlockedDifficulty ?? 1
  const weakRef = useRef(new Set())
  weakRef.current = weakIdSet(gameState.reviewStats)
  const source = useMemo(
    () => pickGradeExercise(level, 'maths', maxDifficulty, weakRef.current),
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

    if (source.type === 'problem') {
      return {
        type: 'problem',
        question: source.question,
        answer: source.answer,
        options: [...source.choices].sort(() => Math.random() - 0.5),
        columns: 4,
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
          <div className="chalkboard-label">
            ➕ Calcul mental
            <button type="button" className="chalk-listen" onClick={() => playWord('choisis_bonne_reponse')} aria-label="Écouter la consigne">🔊</button>
          </div>
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

  if (exercise.type === 'problem') {
    return (
      <>
        <div className="problem-card">
          <div className="problem-card-label">
            🧩 Petit problème
            <button type="button" className="chalk-listen" onClick={() => playWord('choisis_bonne_reponse')} aria-label="Écouter la consigne">🔊</button>
          </div>
          <p className="problem-card-text">{exercise.question}</p>
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

  return (
    <>
      <div className="chalkboard">
        <div className="chalkboard-label">
          ➕ Calcul mental
          <button type="button" className="chalk-listen" onClick={() => playWord('choisis_bonne_reponse')} aria-label="Écouter la consigne">🔊</button>
        </div>
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
