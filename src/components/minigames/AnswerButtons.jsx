import { useState } from 'react'
import { useGame } from '../../context/GameContext'

export default function AnswerButtons({ options, correct, onCorrect, columns = 3 }) {
  const { showFeedback } = useGame()
  const [answeredIndex, setAnsweredIndex] = useState(null)
  const [answerCorrect, setAnswerCorrect] = useState(null)

  const colsClass = columns === 4 ? 'cols-4' : 'cols-3'

  const handleClick = (index, value) => {
    if (answeredIndex !== null) return
    const isCorrect = value == correct
    setAnsweredIndex(index)
    setAnswerCorrect(isCorrect)
    showFeedback(isCorrect)
    if (isCorrect) onCorrect?.()
  }

  return (
    <div className={`answers-grid ${colsClass}`}>
      {options.map((opt, index) => {
        const value = typeof opt === 'object' ? opt.value : opt
        const label = typeof opt === 'object' ? opt.label : opt
        const isAnswered = answeredIndex === index
        const stateClass = isAnswered ? (answerCorrect ? 'correct' : 'wrong') : ''

        return (
          <button
            key={`${label}-${index}`}
            type="button"
            onClick={() => handleClick(index, value)}
            disabled={answeredIndex !== null}
            className={`ans-btn ${stateClass}`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
