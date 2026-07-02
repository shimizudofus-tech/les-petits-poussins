import { useGame } from '../context/GameContext'
import { useT } from '../i18n/useT'
import { getStreakRewardsPreview } from '../data/streakRewards'
import { isImageIcon } from '../utils/animalIcon'

// Ruban repliable sur l'accueil : progression du cycle de 7 jours de connexion
// et aperçu des récompenses à débloquer (légendaires, arbre magique, château).
export default function StreakRewardsBar() {
  const { gameState } = useGame()
  const t = useT()
  const streak = gameState.dayStreak || 0
  const dayInWeek = streak > 0 ? ((streak - 1) % 7) + 1 : 0
  const rewards = getStreakRewardsPreview()

  return (
    <details className="streak-bar shrink-0">
      <summary className="streak-bar-summary">
        <span className="streak-bar-title">🎁 {t('streakbar.title')}</span>
        <span className="streak-bar-progress">
          <span className="streak-bar-fill" style={{ width: `${(dayInWeek / 7) * 100}%` }} />
        </span>
        <span className="streak-bar-count">{dayInWeek}/7</span>
      </summary>
      <div className="streak-bar-rewards">
        {rewards.map((r) => {
          const done = r.day < dayInWeek
          const today = r.day === dayInWeek
          return (
            <div
              key={r.day}
              className={`streak-reward${done ? ' streak-reward--done' : ''}${today ? ' streak-reward--today' : ''}`}
            >
              <span className="streak-reward-day">J{r.day}</span>
              {isImageIcon(r.icon) ? (
                <img src={r.icon} alt={r.name} className="streak-reward-img" draggable={false} />
              ) : (
                <span className="streak-reward-emoji" aria-hidden="true">{r.icon}</span>
              )}
              {done && <span className="streak-reward-check">✓</span>}
            </div>
          )
        })}
      </div>
      <p className="streak-bar-hint">{t('streakbar.hint')}</p>
    </details>
  )
}
