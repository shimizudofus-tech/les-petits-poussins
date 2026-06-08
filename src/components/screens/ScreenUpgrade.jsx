import MobileScreenLayout from '../layout/MobileScreenLayout'
import { useGame } from '../../context/GameContext'
import {
  FARM_UPGRADE_MAX_LEVEL,
  FARM_UPGRADE_PARTS,
  getUpgradeCost,
  isFarmUpgradeAtMax,
} from '../../data/farmUpgrades'

export default function ScreenUpgrade() {
  const { gameState, upgradeFarmPart } = useGame()
  const upgrades = gameState.farmUpgrades

  return (
    <MobileScreenLayout
      className="screen-upgrade"
      title="AMÉLIORER"
      titleIcon="✨"
      scrollable
      mainClassName="px-[var(--screen-padding)] py-3"
    >
      <p className="upgrade-hint shrink-0 text-center text-[0.7rem] font-bold leading-snug text-[#2e7d32]">
        Utilise tes étoiles pour faire grandir ta ferme !
      </p>

      <div className="upgrade-grid">
        {FARM_UPGRADE_PARTS.map(({ key, label, icon }) => {
          const level = upgrades[key] ?? 0
          const atMax = isFarmUpgradeAtMax(level)
          const cost = getUpgradeCost(level)

          return (
            <div
              key={key}
              className={`upgrade-card ${atMax ? 'upgrade-card--max' : ''}`}
            >
              <div className="upgrade-card-icon" aria-hidden="true">
                {icon}
              </div>
              <h3 className="upgrade-card-title">{label}</h3>
              <p className="upgrade-card-level">
                Niveau {level}
                {atMax ? ` / ${FARM_UPGRADE_MAX_LEVEL}` : ''}
              </p>
              {atMax ? (
                <p className="upgrade-card-max-label">Niveau max</p>
              ) : (
                <p className="upgrade-card-cost">Améliorer pour {cost} ⭐</p>
              )}
              <button
                type="button"
                onClick={() => upgradeFarmPart(key)}
                disabled={atMax}
                className="upgrade-card-btn"
              >
                {atMax ? 'Complet' : 'Améliorer'}
              </button>
            </div>
          )
        })}
      </div>
    </MobileScreenLayout>
  )
}
