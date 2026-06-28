import { SCREENS, useGame } from '../context/GameContext'

const CONFETTI_COLORS = ['#ffca28', '#ef5350', '#42a5f5', '#66bb6a', '#ab47bc', '#ff7043']

function Confetti() {
  return (
    <div className="confetti-burst" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${50 + (Math.random() * 60 - 30)}%`,
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDelay: `${Math.random() * 0.15}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  )
}

export default function Feedback() {
  const { feedback, gameState } = useGame()
  if (!feedback) return null

  const isMaternelleChild =
    gameState.currentScreen === SCREENS.MATERNELLE_SECTION &&
    ['petite', 'moyenne', 'grande'].includes(gameState.maternelleSection ?? 'petite')

  if (isMaternelleChild) {
    return (
      <div className="feedback-overlay feedback-overlay--child">
        {feedback.correct && <Confetti />}
        <div
          className={`feedback-content feedback-content--child ${
            feedback.correct ? 'feedback-content--child-correct' : 'feedback-content--child-wrong'
          }`}
        >
          {feedback.correct ? (
            <>
              <span className="feedback-child-star" aria-hidden="true">
                ⭐
              </span>
              <span className="feedback-child-text">{feedback.message ?? 'Bravo !'}</span>
            </>
          ) : (
            <>
              <span className="feedback-child-emoji" aria-hidden="true">
                😊
              </span>
              <span className="feedback-child-text">{feedback.message ?? 'Encore !'}</span>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="feedback-overlay">
      {feedback.correct && <Confetti />}
      <div
        className="feedback-content"
        style={{ background: feedback.correct ? '#43a047' : '#e53935' }}
      >
        {feedback.correct
          ? `🎉 ${feedback.message ?? 'Bravo !'} +2 ⭐`
          : `😅 ${feedback.message ?? 'Essaie encore !'}`}
      </div>
    </div>
  )
}
