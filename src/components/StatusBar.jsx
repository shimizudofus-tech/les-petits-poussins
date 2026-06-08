import { computeFarmLevel } from '../data/farmUpgrades'
import { useGame } from '../context/GameContext'
import ParentSettingsButton from './ParentSettingsButton'

export default function StatusBar() {
  const { gameState } = useGame()
  const farmLevel = computeFarmLevel(gameState.farmUpgrades)

  return (
    <header className="status-bar z-10 flex shrink-0 items-center justify-between border-b-[3px] border-[#e8b84b] bg-gradient-to-b from-[#fff8e7] to-[#ffefc0] px-3 pb-2 pt-2">
      <div className="flex items-center gap-1.5 rounded-[20px] bg-gradient-to-br from-[#ff9800] to-[#ffb74d] px-3 py-1 text-sm font-extrabold text-white shadow-[0_3px_0_#e65100,0_4px_8px_rgba(0,0,0,0.2)]">
        ⭐ <span>{gameState.stars}</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="rounded-[20px] bg-gradient-to-br from-[#66bb6a] to-[#a5d6a7] px-2.5 py-1 text-[0.75rem] font-extrabold text-[#1b5e20] shadow-[0_3px_0_#2e7d32]">
          🏡 Ferme Niv. <span>{farmLevel}</span>
        </div>
        <ParentSettingsButton />
      </div>
    </header>
  )
}
