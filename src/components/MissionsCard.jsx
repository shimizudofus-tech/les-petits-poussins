import AppIcon from './AppIcon'
import { useGame } from '../context/GameContext'
import { MISSION_BY_ID, ensureTodayMissions, allMissionsDone } from '../data/missions'

export default function MissionsCard() {
  const { gameState } = useGame()
  const { missions } = ensureTodayMissions(gameState)
  const done = allMissionsDone(missions)

  return (
    <div className="missions-card">
      <div className="missions-card__head">
        <span className="missions-card__title">🎯 Missions du jour</span>
        {done && <span className="missions-card__alldone">Toutes réussies ! 🎉</span>}
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
                <div className="mission-row__label">{def.label}</div>
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
