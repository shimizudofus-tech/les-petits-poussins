import { useEffect, useRef, useState } from 'react'
import { useGame } from '../../context/GameContext'

export default function AnswerButtons({ options, correct, onCorrect, columns = 3, variant, feedbackMeta }) {
  const { showFeedback, gameState } = useGame()
  const inTest = Boolean(gameState.achievements?.tests?.activeTest)
  const [answeredIndex, setAnsweredIndex] = useState(null)
  const [answerCorrect, setAnswerCorrect] = useState(null)
  const [failCount, setFailCount] = useState(0)
  const retryTimerRef = useRef(null)

  useEffect(() => () => { if (retryTimerRef.current) clearTimeout(retryTimerRef.current) }, [])

  const colsClass =
    columns === 1 ? 'cols-1' : columns === 4 ? 'cols-4' : columns === 2 ? 'cols-2' : 'cols-3'
  const gridClass = variant === 'petite' ? 'answers-grid--petite' : ''

  // Indice après 2 erreurs (entraînement) : on grise une mauvaise réponse
  // pour aider sans donner la solution.
  const hintIndex =
    !inTest && failCount >= 2
      ? options.findIndex((opt) => (typeof opt === 'object' ? opt.value : opt) != correct)
      : -1

  const handleClick = (index, value) => {
    if (answeredIndex !== null || index === hintIndex) return
    const isCorrect = value == correct
    setAnsweredIndex(index)
    setAnswerCorrect(isCorrect)
    showFeedback(isCorrect, feedbackMeta)
    if (isCorrect) {
      onCorrect?.()
    } else if (!inTest) {
      // Entraînement : on remet les boutons cliquables pour réessayer.
      // En test : la réponse est définitive et on passe à la question suivante.
      setFailCount((n) => n + 1)
      retryTimerRef.current = setTimeout(() => {
        setAnsweredIndex(null)
        setAnswerCorrect(null)
      }, 1100)
    }
  }

  return (
    <div className={`answers-grid ${colsClass} ${gridClass}`.trim()}>
      {options.map((opt, index) => {
        const value = typeof opt === 'object' ? opt.value : opt
        const label = typeof opt === 'object' ? opt.label : opt
        const isAnswered = answeredIndex === index
        const stateClass = isAnswered ? (answerCorrect ? 'correct' : 'wrong') : ''
        const dimmed = index === hintIndex

        return (
          <button
            key={`${label}-${index}`}
            type="button"
            onClick={() => handleClick(index, value)}
            disabled={answeredIndex !== null || dimmed}
            className={`ans-btn ${variant === 'petite' ? 'ans-btn--petite' : ''} ${stateClass} ${dimmed ? 'ans-btn--dimmed' : ''}`.trim()}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
