import { computeFarmLevel } from '../data/farmUpgrades'
import { useGame } from '../context/GameContext'
import ParentSettingsButton from './ParentSettingsButton'

export default function StatusBar() {
  const { gameState } = useGame()
  const farmLevel = computeFarmLevel(gameState.farmUpgrades)

  return (
    <header className="status-bar z-10 flex shrink-0 items-center justify-between px-3 pb-2 pt-2">
      <div className="status-chip status-chip--stars">
        ⭐ <span>{gameState.stars}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="status-chip status-chip--farm">
          🏡 Ferme Niv. <span>{farmLevel}</span>
        </div>
        <ParentSettingsButton />
      </div>
    </header>
  )
}
