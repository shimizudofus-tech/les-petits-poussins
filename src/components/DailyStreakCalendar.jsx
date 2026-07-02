import { useT } from '../i18n/useT'
import { getStreakReward } from '../data/streakRewards'

// Icône d'une récompense : image (animal légendaire) ou emoji (trésor Améliorer).
function RewardIcon({ reward, className = '' }) {
  if (reward.type === 'legendary') {
    return <img src={reward.icon} alt={reward.name} className={`streak-reward-img ${className}`.trim()} />
  }
  return <span className={`streak-reward-emoji ${className}`.trim()} aria-hidden="true">{reward.icon}</span>
}

// Calendrier de série : 7 cases, chacune montre CE QU'ON GAGNE ce jour-là
// (jours 1-5 : animal légendaire · jour 6 : Arbre magique · jour 7 : Château).
// dayInWeek (1..7) = jour atteint dans le cycle courant.
export default function DailyStreakCalendar({ dayInWeek = 1, awarded = null }) {
  const t = useT()
  return (
    <div className="streak-cal">
      <div className="streak-cal-row">
        {Array.from({ length: 7 }).map((_, i) => {
          const day = i + 1
          const reward = getStreakReward(day)
          const done = day < dayInWeek
          const today = day === dayInWeek
          const upcoming = day > dayInWeek
          return (
            <div
              key={day}
              className={`streak-cell${done ? ' streak-cell--done' : ''}${today ? ' streak-cell--today' : ''}${upcoming ? ' streak-cell--upcoming' : ''}`}
              title={reward.name}
            >
              <span className="streak-cell-icon">
                <RewardIcon reward={reward} />
                {done && <span className="streak-cell-check">✓</span>}
              </span>
              <span className="streak-cell-day">J{day}</span>
            </div>
          )
        })}
      </div>
      {awarded ? (
        <div className="streak-legend-win">
          <RewardIcon reward={awarded} className="streak-legend-img" />
          <div className="streak-legend-text">
            <strong>{t('daily.legendWin')}</strong>
            <span>{t('daily.youWon')} {awarded.name}</span>
          </div>
        </div>
      ) : (
        <p className="streak-cal-hint">{t('daily.comeBack')}</p>
      )}
    </div>
  )
}
