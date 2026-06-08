import { useGame } from '../context/GameContext'

export default function Feedback() {
  const { feedback } = useGame()
  if (!feedback) return null

  return (
    <div className="feedback-overlay">
      <div
        className="feedback-content"
        style={{ background: feedback.correct ? '#43a047' : '#e53935' }}
      >
        {feedback.correct ? '🎉 Bravo ! +2 ⭐' : '😅 Essaie encore !'}
      </div>
    </div>
  )
}
