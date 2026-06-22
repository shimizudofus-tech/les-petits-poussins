import { SCREENS, useGame } from '../context/GameContext'

export default function Feedback() {
  const { feedback, gameState } = useGame()
  if (!feedback) return null

  const isMaternelleChild =
    gameState.currentScreen === SCREENS.MATERNELLE_SECTION &&
    ['petite', 'moyenne', 'grande'].includes(gameState.maternelleSection ?? 'petite')

  if (isMaternelleChild) {
    return (
      <div className="feedback-overlay feedback-overlay--child">
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
