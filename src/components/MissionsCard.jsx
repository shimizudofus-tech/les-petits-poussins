import AppIcon from './AppIcon'
import { useGame } from '../context/GameContext'
import { useT } from '../i18n/useT'
import { MISSION_BY_ID, ensureTodayMissions, allMissionsDone } from '../data/missions'

export default function MissionsCard() {
  const { gameState } = useGame()
  const t = useT()
  const { missions } = ensureTodayMissions(gameState)
  const done = allMissionsDone(missions)

  return (
    <div className="missions-card">
      <div className="missions-card__head">
        <span className="missions-card__title">{t('missions.title')}</span>
        {done && <span className="missions-card__alldone">{t('missions.allDone')}</span>}
      </div>
      <ul className="missions-list">
        {missions.map((m) => {
          const def = MISSION_BY_ID[m.id]
          if (!def) return null
          const pct = Math.min(100, Math.round((m.progress / def.target) * 100))
          return (
            <li key={m.id} className={`mission-row${m.claimed ? ' mission-row--done' : ''}`}>
              <div className="mission-row__icon">
                <AppIcon name={def.icon} size={26} />
              </div>
              <div className="mission-row__body">
                <div className="mission-row__label">{t(`missions.${m.id}`)}</div>
                <div className="mission-bar">
                  <div className="mission-bar__fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="mission-row__count">
                {m.claimed ? (
                  <span className="mission-row__check">✓</span>
                ) : (
                  <span>{m.progress}/{def.target}</span>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
