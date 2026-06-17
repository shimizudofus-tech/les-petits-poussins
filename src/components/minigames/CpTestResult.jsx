import { getCpTestEncouragement } from '../../utils/cpProgress'

const TITLE_BY_MOOD = {
  excellent: 'Excellent !',
  bravo: 'Bravo !',
  réussi: 'Bien joué !',
  continue: 'Continue comme ça !',
}

export default function CpTestResult({ result, subjectLabel, onReplay, onBack }) {
  const mood = getCpTestEncouragement(result.score, result.length)
  const title = TITLE_BY_MOOD[mood] ?? 'Test terminé !'

  return (
    <div className="cp-test-result">
      <p className="cp-test-result-emoji" aria-hidden="true">
        {result.perfect ? '💎' : result.score >= 3 ? '🌟' : '⭐'}
      </p>
      <h3 className="cp-test-result-title">{title}</h3>
      <p className="cp-test-result-score">
        {subjectLabel} — {result.score} / {result.length}
      </p>
      <p className="cp-test-result-stars">+{result.stars}⭐</p>
      <div className="cp-test-result-actions">
        <button type="button" onClick={onReplay} className="cp-test-result-btn cp-test-result-btn--primary">
          Rejouer
        </button>
        <button type="button" onClick={onBack} className="cp-test-result-btn">
          Retour
        </button>
      </div>
    </div>
  )
}
