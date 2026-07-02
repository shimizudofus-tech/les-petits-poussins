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
  isStreakLocked,
} from '../../data/farmCatalog'

const STREAK_DAY_BY_ITEM = { magic_tree: 6, castle: 7 }

export default function ScreenUpgrade() {
  const { gameState, buyFarmItem, switchScreen, showPaywall } = useGame()
  const shop = gameState.farmShop ?? {}
  const premium = gameState.premium ?? false
  const [tab, setTab] = useState(FARM_CATEGORIES[0].key)
  const [fireKey, setFireKey] = useState(null)

  const owned = countOwnedUpgrades(shop)
  const activeCat = FARM_CATEGORIES.find((c) => c.key === tab) ?? FARM_CATEGORIES[0]

  const triggerFireworks = (id) => {
    setFireKey(id)
    setTimeout(() => setFireKey((k) => (k === id ? null : k)), 900)
  }

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
          const streakItem = isStreakLocked(item.id)

          // Trésors exclusifs (série de connexion) : jamais achetables aux étoiles.
          if (streakItem) {
            const itemOwned = level > 0
            const day = STREAK_DAY_BY_ITEM[item.id]
            const canFire = itemOwned && item.id === 'magic_tree'
            return (
              <div
                key={item.id}
                className={`upgrade-row upgrade-row--treasure${itemOwned ? ' upgrade-row--treasure-owned' : ''}`}
              >
                {canFire ? (
                  <button
                    type="button"
                    className="upgrade-row-icon upgrade-row-icon--treasure"
                    onClick={() => triggerFireworks(item.id)}
                    aria-label={`${item.name} : lancer un feu d'artifice`}
                    style={{ touchAction: 'manipulation' }}
                  >
                    <FarmArt kind={item.id} width={40} />
                    {fireKey === item.id && (
                      <span className="fw-burst" aria-hidden="true">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <span key={i} className="fw-particle" style={{ '--fw-i': i }} />
                        ))}
                      </span>
                    )}
                  </button>
                ) : (
                  <div className="upgrade-row-icon upgrade-row-icon--treasure" aria-hidden="true">
                    {itemOwned ? <FarmArt kind={item.id} width={40} /> : '🔒'}
                  </div>
                )}
                <div className="upgrade-row-mid">
                  <span className="upgrade-row-name">{item.name}</span>
                  <span className="upgrade-row-treasure-hint">
                    {itemOwned
                      ? (canFire ? '✨ Touche pour un feu d\'artifice !' : '🏆 Trésor obtenu')
                      : `🔥 Jour ${day} de connexion`}
                  </span>
                </div>
                <span className={`upgrade-row-btn${itemOwned ? ' upgrade-row-btn--max' : ' upgrade-row-btn--locked'}`}>
                  {itemOwned ? '✓' : '🔒'}
                </span>
              </div>
            )
          }

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
