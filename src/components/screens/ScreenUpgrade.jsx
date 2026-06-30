import { useState } from 'react'
import MobileScreenLayout from '../layout/MobileScreenLayout'
import FarmArt, { hasFarmArt } from '../farm/FarmArt'
import { SCREENS, useGame } from '../../context/GameContext'
import {
  FARM_CATEGORIES,
  TOTAL_FARM_UPGRADES,
  countOwnedUpgrades,
  getItemCost,
  getOwned,
  isItemMaxed,
  isItemFree,
} from '../../data/farmCatalog'

export default function ScreenUpgrade() {
  const { gameState, buyFarmItem, switchScreen, showPaywall } = useGame()
  const shop = gameState.farmShop ?? {}
  const premium = gameState.premium ?? false
  const [tab, setTab] = useState(FARM_CATEGORIES[0].key)

  const owned = countOwnedUpgrades(shop)
  const activeCat = FARM_CATEGORIES.find((c) => c.key === tab) ?? FARM_CATEGORIES[0]

  const header = (
    <header className="screen-header shrink-0 border-b-[3px] border-[#c8902a] bg-gradient-to-br from-[#ffe082] to-[#ffcc02] px-[var(--screen-padding)] py-1.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => switchScreen(SCREENS.TAMAGOTCHI)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/40 text-xl font-black text-[#5d3a00] active:scale-90"
          style={{ touchAction: 'manipulation' }}
          aria-label="Retour"
        >
          ←
        </button>
        <h1 className="min-w-0 flex-1 truncate text-center text-sm font-black uppercase tracking-wide text-[#5d3a00]">
          ✨ AMÉLIORER
        </h1>
        <div className="status-chip status-chip--stars shrink-0">⭐ {gameState.stars}</div>
      </div>
    </header>
  )

  const tabs = (
    <div className="upgrade-tabs">
      {FARM_CATEGORIES.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => setTab(c.key)}
          className={`upgrade-tab${tab === c.key ? ' upgrade-tab--active' : ''}`}
        >
          <span className="upgrade-tab-icon">{c.icon}</span>
          <span className="upgrade-tab-label">{c.label}</span>
        </button>
      ))}
    </div>
  )

  return (
    <MobileScreenLayout
      className="screen-upgrade"
      header={header}
      scrollable={false}
      mainClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <p className="upgrade-progress-line shrink-0">
        🏡 {owned} / {TOTAL_FARM_UPGRADES} améliorations · ta ferme grandit !
      </p>

      {tabs}

      <div className="upgrade-list">
        {activeCat.items.map((item) => {
          const level = getOwned(shop, item.id)
          const maxed = isItemMaxed(shop, item.id)
          const cost = getItemCost(shop, item.id)
          const canAfford = gameState.stars >= cost
          const pct = Math.round((level / item.max) * 100)
          const locked = !premium && !isItemFree(item.id)

          return (
            <div key={item.id} className={`upgrade-row${maxed ? ' upgrade-row--max' : ''}${locked ? ' upgrade-row--locked' : ''}`}>
              <div className="upgrade-row-icon" aria-hidden="true">
                {hasFarmArt(item.id) ? <FarmArt kind={item.id} width={40} /> : item.icon}
              </div>
              <div className="upgrade-row-mid">
                <span className="upgrade-row-name">{item.name}</span>
                <div className="upgrade-row-bar">
                  <div className="upgrade-row-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="upgrade-row-lvl">{level} / {item.max}</span>
              </div>
              {locked ? (
                <button
                  type="button"
                  onClick={() => showPaywall('Débloque toute la ferme avec la version complète !')}
                  className="upgrade-row-btn upgrade-row-btn--locked"
                >
                  🔒
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => buyFarmItem(item.id)}
                  disabled={maxed || !canAfford}
                  className={`upgrade-row-btn${maxed ? ' upgrade-row-btn--max' : ''}`}
                >
                  {maxed ? '✓ Max' : <>{cost} ⭐</>}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </MobileScreenLayout>
  )
}
